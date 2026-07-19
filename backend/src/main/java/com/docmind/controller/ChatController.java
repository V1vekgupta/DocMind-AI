package com.docmind.controller;

import com.docmind.model.dto.request.ChatRequest;
import com.docmind.model.dto.request.CreateConversationRequest;
import com.docmind.model.dto.response.ChatResponse;
import com.docmind.model.dto.response.ConversationResponse;
import com.docmind.model.dto.response.ConversationSummaryResponse;
import com.docmind.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/api/pdfs/{pdfId}/chat")
    public ResponseEntity<ChatResponse> askQuestion(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long pdfId,
            @Valid @RequestBody ChatRequest request
    ) {
        return ResponseEntity.ok(chatService.askQuestion(userDetails.getUsername(), pdfId, request));
    }

    @PostMapping("/api/pdfs/{pdfId}/conversations")
    public ResponseEntity<ConversationResponse> createConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long pdfId,
            @Valid @RequestBody CreateConversationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.createConversation(userDetails.getUsername(), pdfId, request));
    }

    @GetMapping("/api/conversations")
    public ResponseEntity<List<ConversationSummaryResponse>> getConversations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(chatService.getConversations(userDetails.getUsername()));
    }

    @GetMapping("/api/conversations/{conversationId}")
    public ResponseEntity<ConversationResponse> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId
    ) {
        return ResponseEntity.ok(chatService.getConversation(userDetails.getUsername(), conversationId));
    }

    @DeleteMapping("/api/conversations/{conversationId}")
    public ResponseEntity<Void> deleteConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId
    ) {
        chatService.deleteConversation(userDetails.getUsername(), conversationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "DocMind AI"));
    }
}
