package com.docmind.service;

import com.docmind.config.AppProperties;
import com.docmind.exception.BadRequestException;
import com.docmind.exception.ResourceNotFoundException;
import com.docmind.model.dto.response.PdfResponse;
import com.docmind.model.entity.PdfDocument;
import com.docmind.model.entity.PdfStatus;
import com.docmind.model.entity.User;
import com.docmind.repository.PdfDocumentRepository;
import com.docmind.repository.UserRepository;
import com.docmind.util.DtoMapper;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.cassandra.AstraDbEmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfService {

    private final PdfDocumentRepository pdfDocumentRepository;
    private final UserRepository userRepository;
    private final AppProperties appProperties;
    private final EmbeddingModel embeddingModel;
    private final AstraDbEmbeddingStore embeddingStore;
    private final DocumentSplitter documentSplitter;

    @Transactional
    public PdfResponse uploadPdf(String userEmail, MultipartFile file) {
        validatePdfFile(file);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String storedFilename = UUID.randomUUID() + ".pdf";
        Path uploadPath = Paths.get(appProperties.getUploadDir());
        Path destination = uploadPath.resolve(storedFilename);

        try {
            Files.createDirectories(uploadPath);
            file.transferTo(destination);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to store uploaded file");
        }

        PdfDocument document = PdfDocument.builder()
                .user(user)
                .originalFilename(file.getOriginalFilename())
                .storedFilename(storedFilename)
                .fileSizeBytes(file.getSize())
                .status(PdfStatus.PROCESSING)
                .build();

        PdfDocument savedDocument = pdfDocumentRepository.save(document);

        try {
            processAndEmbedPdf(savedDocument, destination);
            savedDocument.setStatus(PdfStatus.READY);
        } catch (Exception ex) {
            log.error("Failed to process PDF {}", savedDocument.getId(), ex);
            savedDocument.setStatus(PdfStatus.FAILED);
        }

        return DtoMapper.toPdfResponse(pdfDocumentRepository.save(savedDocument));
    }

    @Transactional(readOnly = true)
    public List<PdfResponse> getUserPdfs(String userEmail) {
        User user = getUser(userEmail);
        return pdfDocumentRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(DtoMapper::toPdfResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PdfResponse getPdf(String userEmail, Long pdfId) {
        User user = getUser(userEmail);
        PdfDocument document = pdfDocumentRepository.findByIdAndUser(pdfId, user)
                .orElseThrow(() -> new ResourceNotFoundException("PDF not found"));
        return DtoMapper.toPdfResponse(document);
    }

    @Transactional
    public void deletePdf(String userEmail, Long pdfId) {
        User user = getUser(userEmail);
        PdfDocument document = pdfDocumentRepository.findByIdAndUser(pdfId, user)
                .orElseThrow(() -> new ResourceNotFoundException("PDF not found"));

        Path filePath = Paths.get(appProperties.getUploadDir()).resolve(document.getStoredFilename());
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.warn("Could not delete file for PDF {}", pdfId, ex);
        }

        pdfDocumentRepository.delete(document);
    }

    public PdfDocument getPdfEntity(User user, Long pdfId) {
        return pdfDocumentRepository.findByIdAndUser(pdfId, user)
                .orElseThrow(() -> new ResourceNotFoundException("PDF not found"));
    }

    private void processAndEmbedPdf(PdfDocument pdfDocument, Path filePath) throws IOException {
        // NOTE: DocumentParser.parse() takes an InputStream, not a File --
        // there is no parse(File) overload. FileSystemDocumentLoader opens
        // and closes that stream for us; same fix family as the Metadata
        // put()->add() and ChatService/LangChainConfig API-version issues.
        ApachePdfBoxDocumentParser parser = new ApachePdfBoxDocumentParser();
        Document document = FileSystemDocumentLoader.loadDocument(filePath, parser);

        List<TextSegment> segments = documentSplitter.split(document);
        int chunkIndex = 0;
        for (TextSegment segment : segments) {
            // NOTE: langchain4j 0.25.0's Metadata class has no put() method --
            // the mutating method at this version is add(key, value).
            // (put()/getString() etc. are from later API generations, same
            // family of mismatches as the ChatService/LangChainConfig fixes.)
            segment.metadata().add("userId", pdfDocument.getUser().getId().toString());
            segment.metadata().add("pdfId", pdfDocument.getId().toString());
            segment.metadata().add("chunkId", pdfDocument.getId() + "-" + chunkIndex++);
            segment.metadata().add("filename", pdfDocument.getOriginalFilename());

            var embedding = embeddingModel.embed(segment).content();
            embeddingStore.add(embedding, segment);
        }
    }

    private void validatePdfFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("PDF file is required");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF files are supported");
        }
    }

    private User getUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}