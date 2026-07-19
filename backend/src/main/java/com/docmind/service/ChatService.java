package com.docmind.service;

import com.docmind.exception.BadRequestException;
import com.docmind.exception.ResourceNotFoundException;
import com.docmind.exception.WebSearchNotConfiguredException;
import com.docmind.model.dto.request.ChatRequest;
import com.docmind.model.dto.request.CreateConversationRequest;
import com.docmind.model.dto.request.ResponseStyle;
import com.docmind.model.dto.response.ChatResponse;
import com.docmind.model.dto.response.ConversationResponse;
import com.docmind.model.dto.response.ConversationSummaryResponse;
import com.docmind.model.entity.Conversation;
import com.docmind.model.entity.Message;
import com.docmind.model.entity.MessageRole;
import com.docmind.model.entity.PdfDocument;
import com.docmind.model.entity.PdfStatus;
import com.docmind.model.entity.User;
import com.docmind.repository.ConversationRepository;
import com.docmind.repository.UserRepository;
import com.docmind.util.DtoMapper;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.cassandra.AstraDbEmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    /**
     * langchain4j 0.25.0's EmbeddingStore only exposes
     * findRelevant(Embedding, maxResults[, minScore]) -- there is no
     * metadata-filter parameter (that Filter/MetadataFilterBuilder API
     * was added in a later release). To keep each answer scoped to the
     * right user's PDF, we over-fetch a larger candidate pool here and
     * then filter by the userId/pdfId metadata in Java before building
     * the prompt. If this store ever holds many PDFs per user, raise
     * this number so the correct PDF's chunks aren't crowded out by
     * closer-scoring chunks from other PDFs.
     */
    private static final int CANDIDATE_POOL_SIZE = 20;
    private static final int MAX_CONTEXT_SEGMENTS = 5;
    private static final int MAX_CONTEXT_SEGMENTS_DETAILED = 10;

    /**
     * Lightweight fallback so "give more detail" style follow-ups switch to
     * DETAILED mode even if the client never sends an explicit responseStyle
     * (e.g. no frontend yet). Not a substitute for a real intent classifier --
     * just keyword matching on the raw question text, English + Hindi/Hinglish.
     */
    private static final List<String> DETAIL_TRIGGER_PHRASES = List.of(
            "more detail", "in detail", "explain more", "elaborate",
            "go deeper", "expand on", "in depth", "thorough", "comprehensive",
            "detail do", "vistar", "vistaar", "aur detail", "zyada detail",
            "samjhao", "explain karo"
    );

    /**
     * Fallback so clicking a "+/web search" button isn't the only way to trigger it --
     * these phrases work even without the frontend sending an explicit webSearch flag.
     */
    private static final List<String> WEB_SEARCH_TRIGGER_PHRASES = List.of(
            "search on internet", "search on web", "search online", "search the web",
            "google it", "google this", "look it up online", "look this up online",
            "internet pe search", "web par search", "web se search", "online search karo"
    );

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final PdfService pdfService;
    private final AstraDbEmbeddingStore embeddingStore;
    private final EmbeddingModel embeddingModel;
    private final OpenAiChatModel chatModel;
    private final WebSearchService webSearchService;

    @Transactional
    public ConversationResponse createConversation(String userEmail, Long pdfId, CreateConversationRequest request) {
        User user = getUser(userEmail);
        PdfDocument pdf = pdfService.getPdfEntity(user, pdfId);

        if (pdf.getStatus() != PdfStatus.READY) {
            throw new BadRequestException("PDF is not ready for chat yet");
        }

        Conversation conversation = Conversation.builder()
                .user(user)
                .pdfDocument(pdf)
                .title(request.getTitle())
                .build();

        return DtoMapper.toConversationResponse(conversationRepository.save(conversation));
    }

    @Transactional(readOnly = true)
    public List<ConversationSummaryResponse> getConversations(String userEmail) {
        User user = getUser(userEmail);
        return conversationRepository.findByUserOrderByUpdatedAtDesc(user).stream()
                .map(DtoMapper::toConversationSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConversationResponse getConversation(String userEmail, Long conversationId) {
        User user = getUser(userEmail);
        Conversation conversation = conversationRepository.findByIdAndUser(conversationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        return DtoMapper.toConversationResponse(conversation);
    }

    @Transactional
    public void deleteConversation(String userEmail, Long conversationId) {
        User user = getUser(userEmail);
        Conversation conversation = conversationRepository.findByIdAndUser(conversationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        conversationRepository.delete(conversation);
    }

    @Transactional
    public ChatResponse askQuestion(String userEmail, Long pdfId, ChatRequest request) {
        User user = getUser(userEmail);
        PdfDocument pdf = pdfService.getPdfEntity(user, pdfId);

        if (pdf.getStatus() != PdfStatus.READY) {
            throw new BadRequestException("PDF is not ready for chat yet");
        }

        Conversation conversation = resolveConversation(user, pdf, request.getConversationId(), request.getQuestion());

        Message userMessage = Message.builder()
                .conversation(conversation)
                .role(MessageRole.USER)
                .content(request.getQuestion())
                .build();
        conversation.getMessages().add(userMessage);

        boolean useWebSearch = resolveWebSearch(request);
        String answer = useWebSearch
                ? generateWebSearchAnswer(conversation, request.getQuestion())
                : generateAnswer(user.getId(), pdf.getId(), conversation, request.getQuestion(), resolveResponseStyle(request));

        Message assistantMessage = Message.builder()
                .conversation(conversation)
                .role(MessageRole.ASSISTANT)
                .content(answer)
                .build();
        conversation.getMessages().add(assistantMessage);

        conversationRepository.save(conversation);

        return ChatResponse.builder()
                .conversationId(conversation.getId())
                .answer(answer)
                .userMessage(DtoMapper.toMessageResponse(userMessage))
                .assistantMessage(DtoMapper.toMessageResponse(assistantMessage))
                .build();
    }

    private Conversation resolveConversation(User user, PdfDocument pdf, Long conversationId, String question) {
        if (conversationId != null) {
            Conversation conversation = conversationRepository.findByIdAndUser(conversationId, user)
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

            if (!conversation.getPdfDocument().getId().equals(pdf.getId())) {
                throw new BadRequestException("Conversation does not belong to this PDF");
            }
            return conversation;
        }

        String title = question.length() > 60 ? question.substring(0, 57) + "..." : question;
        Conversation conversation = Conversation.builder()
                .user(user)
                .pdfDocument(pdf)
                .title(title)
                .build();
        return conversationRepository.save(conversation);
    }

    /**
     * Replaces the old ConversationalRetrievalChain/EmbeddingStoreContentRetriever
     * pipeline (dev.langchain4j.rag.*), which doesn't exist at 0.25.0. This does
     * retrieval, per-user/per-pdf filtering, and prompt assembly by hand, and --
     * unlike the previous version of this method -- actually includes prior
     * conversation turns in the prompt instead of discarding them.
     */
    private String generateAnswer(Long userId, Long pdfId, Conversation conversation, String question, ResponseStyle style) {
        Embedding queryEmbedding = embeddingModel.embed(question).content();

        List<EmbeddingMatch<TextSegment>> candidates =
                embeddingStore.findRelevant(queryEmbedding, CANDIDATE_POOL_SIZE);

        int segmentLimit = style == ResponseStyle.DETAILED ? MAX_CONTEXT_SEGMENTS_DETAILED : MAX_CONTEXT_SEGMENTS;

        String context = candidates.stream()
                .filter(match -> belongsTo(match, userId, pdfId))
                .sorted(Comparator.comparingDouble(EmbeddingMatch<TextSegment>::score).reversed())
                .limit(segmentLimit)
                .map(match -> match.embedded().text())
                .collect(Collectors.joining("\n\n"));

        String history = conversation.getMessages().stream()
                .map(m -> (m.getRole() == MessageRole.USER ? "User: " : "Assistant: ") + m.getContent())
                .collect(Collectors.joining("\n"));

        String prompt = style == ResponseStyle.DETAILED
                ? buildDetailedPrompt(history, context, question)
                : buildConcisePrompt(history, context, question);

        return chatModel.generate(prompt);
    }

    private String buildConcisePrompt(String history, String context, String question) {
        return """
                Answer the question using only the information provided in the document excerpts below.
                If the answer isn't contained in the excerpts, say you don't know -- do not guess.

                Conversation so far:
                %s

                Relevant document excerpts:
                %s

                Question: %s
                """.formatted(history, context, question);
    }

    private String buildDetailedPrompt(String history, String context, String question) {
        return """
                You are a knowledgeable assistant helping the user deeply understand a document.
                Treat the document excerpts below as your primary, authoritative source -- never
                state anything that contradicts them. Within that constraint, give a thorough,
                well-structured answer:

                - Expand on the excerpts rather than just repeating them verbatim.
                - Use short paragraphs, and bullet points or numbered lists where they help clarity.
                - Add relevant background, examples, or analogies from general knowledge if they help
                  the user understand the topic -- but clearly distinguish this from what the document
                  itself says (e.g. "The document states X. More broadly, this generally means...").
                - If the document only partially covers the question, answer what it does cover in
                  detail, then explicitly note what is not covered by the document.
                - Do not fabricate specific facts, figures, or quotes that aren't in the document.

                Conversation so far:
                %s

                Relevant document excerpts:
                %s

                Question: %s
                """.formatted(history, context, question);
    }

    private ResponseStyle resolveResponseStyle(ChatRequest request) {
        if (request.getResponseStyle() != null) {
            return request.getResponseStyle();
        }
        String q = request.getQuestion() == null ? "" : request.getQuestion().toLowerCase();
        boolean wantsDetail = DETAIL_TRIGGER_PHRASES.stream().anyMatch(q::contains);
        return wantsDetail ? ResponseStyle.DETAILED : ResponseStyle.CONCISE;
    }

    private boolean resolveWebSearch(ChatRequest request) {
        if (request.getWebSearch() != null) {
            return request.getWebSearch();
        }
        String q = request.getQuestion() == null ? "" : request.getQuestion().toLowerCase();
        return WEB_SEARCH_TRIGGER_PHRASES.stream().anyMatch(q::contains);
    }

    private String generateWebSearchAnswer(Conversation conversation, String question) {
        String history = conversation.getMessages().stream()
                .map(m -> (m.getRole() == MessageRole.USER ? "User: " : "Assistant: ") + m.getContent())
                .collect(Collectors.joining("\n"));

        List<WebSearchResult> results;
        try {
            results = webSearchService.search(question);
        } catch (WebSearchNotConfiguredException ex) {
            log.warn("Web search requested but not configured, falling back to general knowledge: {}",
                    ex.getMessage());
            return generateGeneralKnowledgeAnswer(history, question, true);
        }

        if (results.isEmpty()) {
            return "I searched the web but couldn't find relevant results for this question. "
                    + "Try rephrasing it, or ask about the uploaded document instead.";
        }

        String prompt = buildWebSearchPrompt(history, results, question);
        return chatModel.generate(prompt);
    }

    private String buildWebSearchPrompt(String history, List<WebSearchResult> results, String question) {
        StringBuilder sources = new StringBuilder();
        int i = 1;
        for (WebSearchResult result : results) {
            sources.append(i++).append(". ").append(result.title())
                    .append(" (").append(result.url()).append(")\n")
                    .append(result.snippet()).append("\n\n");
        }

        return """
                You are answering using the web search results below, not the uploaded document.
                Synthesize a clear, well-organized answer from these sources. Cite sources inline
                using their number, e.g. [1], and list the numbered sources again at the end.
                If the sources don't actually answer the question, say so honestly instead of guessing.
                These are short search snippets, not full pages -- treat them as a starting point
                and note that specific facts should be verified at the source.

                Conversation so far:
                %s

                Web search results:
                %s
                Question: %s
                """.formatted(history, sources, question);
    }

    private String generateGeneralKnowledgeAnswer(String history, String question, boolean noteNotConfigured) {
        String configNote = noteNotConfigured
                ? "(Note: live web search isn't configured on this server yet, so this answer uses "
                  + "general knowledge instead -- it may not reflect the latest information. "
                  + "Add a Tavily or Serper API key to enable live search.)\n\n"
                : "";

        String prompt = """
                Answer using your own general knowledge -- you do not have access to the uploaded
                document or live internet search for this answer. Be upfront that this comes from
                your training knowledge and may be outdated or incomplete, especially for anything recent.

                %sConversation so far:
                %s

                Question: %s
                """.formatted(configNote, history, question);

        return chatModel.generate(prompt);
    }

    private boolean belongsTo(EmbeddingMatch<TextSegment> match, Long userId, Long pdfId) {
        TextSegment segment = match.embedded();
        if (segment == null || segment.metadata() == null) {
            return false;
        }
        String segmentUserId = segment.metadata().asMap().get("userId");
        String segmentPdfId = segment.metadata().asMap().get("pdfId");
        return Objects.equals(String.valueOf(userId), segmentUserId)
                && Objects.equals(String.valueOf(pdfId), segmentPdfId);
    }

    private User getUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}