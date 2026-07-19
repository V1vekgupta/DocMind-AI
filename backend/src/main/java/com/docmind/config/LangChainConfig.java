package com.docmind.config;

import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.model.embedding.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.store.embedding.cassandra.AstraDbEmbeddingConfiguration;
import dev.langchain4j.store.embedding.cassandra.AstraDbEmbeddingStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LangChainConfig {

    private final AstraProperties astraProperties;
    private final OllamaProperties ollamaProperties;

    public LangChainConfig(AstraProperties astraProperties, OllamaProperties ollamaProperties) {
        this.astraProperties = astraProperties;
        this.ollamaProperties = ollamaProperties;
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        return new AllMiniLmL6V2EmbeddingModel();
    }

    @Bean
    public AstraDbEmbeddingStore astraDbEmbeddingStore() {
        return new AstraDbEmbeddingStore(
                AstraDbEmbeddingConfiguration.builder()
                        .token(astraProperties.getToken())
                        .databaseId(astraProperties.getDatabaseId())
                        .databaseRegion(astraProperties.getRegion())
                        .keyspace(astraProperties.getKeyspace())
                        .table(astraProperties.getTable())
                        .dimension(astraProperties.getDimension())
                        .build()
        );
    }

    @Bean
    public OpenAiChatModel chatModel() {
        return OpenAiChatModel.builder()
                .baseUrl(ollamaProperties.getBaseUrl().trim())
                .apiKey(ollamaProperties.getApiKey())
                .modelName(ollamaProperties.getModel())
                .temperature(0.2)
                .build();
    }

    @Bean
    public dev.langchain4j.data.document.DocumentSplitter documentSplitter() {
        return DocumentSplitters.recursive(300, 0);
    }
}
