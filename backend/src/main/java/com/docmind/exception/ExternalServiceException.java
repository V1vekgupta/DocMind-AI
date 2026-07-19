package com.docmind.exception;

/**
 * Thrown when a call to an external service (e.g. a web search provider) fails.
 * Mapped to HTTP 503 by {@link GlobalExceptionHandler}.
 */
public class ExternalServiceException extends RuntimeException {
    public ExternalServiceException(String message) {
        super(message);
    }

    public ExternalServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
