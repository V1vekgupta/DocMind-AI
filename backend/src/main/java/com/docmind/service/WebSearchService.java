package com.docmind.service;

import com.docmind.config.WebSearchProperties;
import com.docmind.exception.ExternalServiceException;
import com.docmind.exception.WebSearchNotConfiguredException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Performs a live web search via a configured provider (Tavily or Serper) and
 * returns normalized results. Uses the JDK's built-in HttpClient so no new
 * Maven dependency is required.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WebSearchService {

    private final WebSearchProperties properties;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public List<WebSearchResult> search(String query) {
        String provider = properties.getProvider() == null
                ? "tavily"
                : properties.getProvider().trim().toLowerCase();

        try {
            return switch (provider) {
                case "serper" -> searchSerper(query);
                default -> searchTavily(query);
            };
        } catch (ExternalServiceException ex) {
            throw ex; // already a clean, user-facing message
        } catch (Exception ex) {
            log.error("Web search failed (provider={})", provider, ex);
            throw new ExternalServiceException("Web search is currently unavailable. Please try again later.");
        }
    }

    private List<WebSearchResult> searchTavily(String query) throws Exception {
        String apiKey = properties.getTavilyApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            throw new WebSearchNotConfiguredException("No Tavily API key configured.");
        }

        String requestBody = objectMapper.writeValueAsString(Map.of(
                "api_key", apiKey,
                "query", query,
                "search_depth", "basic",
                "max_results", properties.getMaxResults(),
                "include_answer", false
        ));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.tavily.com/search"))
                .timeout(Duration.ofSeconds(15))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            log.error("Tavily search failed with status {}: {}", response.statusCode(), response.body());
            throw new ExternalServiceException("Web search provider returned an error.");
        }

        JsonNode root = objectMapper.readTree(response.body());
        JsonNode results = root.path("results");
        List<WebSearchResult> parsed = new ArrayList<>();
        if (results.isArray()) {
            for (JsonNode node : results) {
                parsed.add(new WebSearchResult(
                        node.path("title").asText(""),
                        node.path("url").asText(""),
                        node.path("content").asText("")
                ));
            }
        }
        return parsed;
    }

    private List<WebSearchResult> searchSerper(String query) throws Exception {
        String apiKey = properties.getSerperApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            throw new WebSearchNotConfiguredException("No Serper API key configured.");
        }

        String requestBody = objectMapper.writeValueAsString(Map.of("q", query));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://google.serper.dev/search"))
                .timeout(Duration.ofSeconds(15))
                .header("Content-Type", "application/json")
                .header("X-API-KEY", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            log.error("Serper search failed with status {}: {}", response.statusCode(), response.body());
            throw new ExternalServiceException("Web search provider returned an error.");
        }

        JsonNode root = objectMapper.readTree(response.body());
        JsonNode organic = root.path("organic");
        List<WebSearchResult> parsed = new ArrayList<>();
        int limit = properties.getMaxResults();
        if (organic.isArray()) {
            int count = 0;
            for (JsonNode node : organic) {
                if (count >= limit) {
                    break;
                }
                parsed.add(new WebSearchResult(
                        node.path("title").asText(""),
                        node.path("link").asText(""),
                        node.path("snippet").asText("")
                ));
                count++;
            }
        }
        return parsed;
    }
}
