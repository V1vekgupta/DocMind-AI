package com.docmind.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for the optional "web search" chat mode (the "+" icon in the
 * frontend). Supports either Tavily or Serper as the underlying search
 * provider -- pick one via `provider` and only fill in that provider's key.
 */
@Configuration
@ConfigurationProperties(prefix = "app.websearch")
@Getter
@Setter
public class WebSearchProperties {

    /** "tavily" or "serper". Defaults to tavily if unset/unrecognized. */
    private String provider = "tavily";

    private String tavilyApiKey;
    private String serperApiKey;

    private int maxResults = 5;
}
