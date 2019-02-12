package com.commercebank.dao;

import com.commercebank.model.Branch;
import com.commercebank.mapper.BranchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BranchDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final BranchMapper branchMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    BranchDAO(final JdbcTemplate jdbcTemplate, final BranchMapper branchMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.branchMapper = branchMapper;
    }

    public List<Branch> list(){
        // Run the SQL query on the database to select all branches and return a List of Branch objects
        return this.jdbcTemplate.query("SELECT * FROM branch", branchMapper);
    }
}
