package com.docmind.util;

import com.docmind.model.dto.response.ConversationResponse;
import com.docmind.model.dto.response.ConversationSummaryResponse;
import com.docmind.model.dto.response.MessageResponse;
import com.docmind.model.dto.response.PdfResponse;
import com.docmind.model.dto.response.UserResponse;
import com.docmind.model.entity.Conversation;
import com.docmind.model.entity.Message;
import com.docmind.model.entity.PdfDocument;
import com.docmind.model.entity.User;

import java.util.List;

public final class DtoMapper {

    private DtoMapper() {
    }

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static PdfResponse toPdfResponse(PdfDocument document) {
        return PdfResponse.builder()
                .id(document.getId())
                .originalFilename(document.getOriginalFilename())
                .fileSizeBytes(document.getFileSizeBytes())
                .pageCount(document.getPageCount())
                .status(document.getStatus())
                .createdAt(document.getCreatedAt())
                .build();
    }

    public static MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .role(message.getRole())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }

    public static ConversationResponse toConversationResponse(Conversation conversation) {
        List<MessageResponse> messages = conversation.getMessages().stream()
                .map(DtoMapper::toMessageResponse)
                .toList();

        return ConversationResponse.builder()
                .id(conversation.getId())
                .pdfId(conversation.getPdfDocument().getId())
                .pdfFilename(conversation.getPdfDocument().getOriginalFilename())
                .title(conversation.getTitle())
                .messages(messages)
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }

    public static ConversationSummaryResponse toConversationSummaryResponse(Conversation conversation) {
        return ConversationSummaryResponse.builder()
                .id(conversation.getId())
                .pdfId(conversation.getPdfDocument().getId())
                .pdfFilename(conversation.getPdfDocument().getOriginalFilename())
                .title(conversation.getTitle())
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }
}
