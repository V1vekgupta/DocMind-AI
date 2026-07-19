package com.docmind.exception;

/**
 * Thrown when web search is requested but no API key is configured for the
 * selected provider. {@link com.docmind.service.ChatService} catches this
 * specifically to fall back to a general-knowledge answer instead of failing
 * the request outright.
 */
public class WebSearchNotConfiguredException extends ExternalServiceException {
    public WebSearchNotConfiguredException(String message) {
        super(message);
    }
}
