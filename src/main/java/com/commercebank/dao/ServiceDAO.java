package com.commercebank.dao;

import com.commercebank.mapper.ServiceMapper;
import com.commercebank.model.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ServiceDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final ServiceMapper serviceMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    ServiceDAO(final JdbcTemplate jdbcTemplate, final ServiceMapper serviceMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.serviceMapper = serviceMapper;
    }

    public List<Service> list(){
        // Run the SQL query on the database to select all services and return a List of Service objects
        return this.jdbcTemplate.query("SELECT * FROM service", serviceMapper);
    }
}
