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
        return this.jdbcTemplate.query("SELECT id, calendar_id, time, NULL AS refer_id FROM unavailable", unavailableMapper);
    }

    public List<Unavailable> listBranches(){
        // Run the SQL query on the database to select unavailables that have matching branches
        return this.jdbcTemplate.query(
            "SELECT id, calendar_id, time, branch_id AS refer_id " +
                "FROM branch_unavailable " +
                "JOIN unavailable " +
                "ON branch_unavailable.unavailable_id = unavailable.id", unavailableMapper);

    }

    public List<Unavailable> listManagers(){
        // Run the SQL query on the database to select unavailables that have matching managers
        return this.jdbcTemplate.query(
            "SELECT id, calendar_id, time, manager_id AS refer_id " +
                "FROM manager_unavailable " +
                "JOIN unavailable " +
                "ON manager_unavailable.unavailable_id = unavailable.id", unavailableMapper);
    }
}
