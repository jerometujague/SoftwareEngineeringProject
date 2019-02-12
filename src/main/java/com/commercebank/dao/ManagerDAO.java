package com.commercebank.dao;

import com.commercebank.model.Manager;
import com.commercebank.mapper.ManagerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ManagerDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final ManagerMapper managerMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    ManagerDAO(final JdbcTemplate jdbcTemplate, final ManagerMapper managerMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.managerMapper = managerMapper;
    }

    public List<Manager> list(){
        // Run the SQL query on the database to select all managers and return a List of Manager objects
        return this.jdbcTemplate.query("SELECT * FROM manager", managerMapper);
    }
}
