package com.commercebank.dao;

import com.commercebank.mapper.UnavailableMapper;
import com.commercebank.model.Unavailable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UnavailableDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final UnavailableMapper unavailableMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    UnavailableDAO(final JdbcTemplate jdbcTemplate, final UnavailableMapper unavailableMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.unavailableMapper = unavailableMapper;
    }

    public List<Unavailable> list(){
        // Run the SQL query on the database to select all unavailables and return a List of Unavailable objects
        return this.jdbcTemplate.query("SELECT * FROM unavailable", unavailableMapper);
    }
}
