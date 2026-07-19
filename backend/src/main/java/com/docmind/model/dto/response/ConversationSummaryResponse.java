package com.docmind.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationSummaryResponse {

    private Long id;
    private Long pdfId;
    private String pdfFilename;
    private String title;
    private Instant updatedAt;
}
