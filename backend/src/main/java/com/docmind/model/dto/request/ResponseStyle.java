package com.docmind.model.dto.request;

/**
 * Controls how thorough the assistant's answer should be, and where it's
 * allowed to draw information from.
 *
 * CONCISE           - short, strictly-grounded answer, straight from the document excerpts.
 * DETAILED          - a fuller, structured, Claude-style explanation: still grounded in the
 *                     document as the primary source, but allowed to elaborate, add examples,
 *                     and use general knowledge to clarify -- as long as it never contradicts
 *                     the document.
 * GENERAL_KNOWLEDGE - answers using the LLM's own trained knowledge, not limited to the
 *                     document at all. Triggered by phrases like "search on internet" /
 *                     "search on web". Note: this is NOT a live internet search -- Ollama
 *                     has no real-time web access here -- it's the model's pretrained
 *                     knowledge, and the answer says so explicitly.
 */
public enum ResponseStyle {
    CONCISE,
    DETAILED,
    GENERAL_KNOWLEDGE
}
