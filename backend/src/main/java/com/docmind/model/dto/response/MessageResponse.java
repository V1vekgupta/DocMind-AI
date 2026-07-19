package com.docmind.model.dto.response;

import com.docmind.model.entity.MessageRole;
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
public class MessageResponse {

    private Long id;
    private MessageRole role;
    private String content;
    private Instant createdAt;
}
