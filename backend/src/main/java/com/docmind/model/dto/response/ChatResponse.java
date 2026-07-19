package com.docmind.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {

    private Long conversationId;
    private String answer;
    private MessageResponse userMessage;
    private MessageResponse assistantMessage;
}
