package com.docmind.model.dto.response;

import com.docmind.model.entity.PdfStatus;
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
public class PdfResponse {

    private Long id;
    private String originalFilename;
    private long fileSizeBytes;
    private Integer pageCount;
    private PdfStatus status;
    private Instant createdAt;
}
