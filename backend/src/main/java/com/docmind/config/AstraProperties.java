package com.docmind.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.astra")
@Getter
@Setter
public class AstraProperties {

    private String token;
    private String databaseId;
    private String region;
    private String keyspace;
    private String table;
    private int dimension;
}
