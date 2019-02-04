package com.commercebank;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration // This lets Spring know that this is a configuration class
public class CommerceBankApplicationConfig {
    // A bean is an object that is managed by Spring
    // We use them so that we don't have to create the same objects in multiple classes
    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource") // Gets the properties from the applications.properties file
    public DataSource dataSource(){
        // Builds the data source with those properties
        return DataSourceBuilder.create().build();
    }
}
