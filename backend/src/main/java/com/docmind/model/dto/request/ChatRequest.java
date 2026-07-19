package com.docmind.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class ChatRequest {

    @NotBlank(message = "Question is required")
    @Size(max = 4000, message = "Question must not exceed 4000 characters")
    private String question;

    private Long conversationId;

    /**
     * Optional. If the client doesn't send this, {@link ChatService} falls back to
     * auto-detecting intent from the question text (e.g. "explain in more detail").
     */
    private ResponseStyle responseStyle;

    /**
     * Optional. Set true when the user picks the web-search option (the "+" icon)
     * in the chat UI. If omitted, {@link ChatService} auto-detects intent from
     * phrases like "search on internet" / "search on web".
     */
    private Boolean webSearch;
}
