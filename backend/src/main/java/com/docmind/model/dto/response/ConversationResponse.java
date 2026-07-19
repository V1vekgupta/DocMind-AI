package com.docmind.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {

    private Long id;
    private Long pdfId;
    private String pdfFilename;
    private String title;
    private List<MessageResponse> messages;
    private Instant createdAt;
    private Instant updatedAt;
}
