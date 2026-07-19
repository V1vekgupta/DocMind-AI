package com.docmind.service;

/**
 * A single web search result, normalized across providers (Tavily/Serper).
 */
public record WebSearchResult(String title, String url, String snippet) {
}
