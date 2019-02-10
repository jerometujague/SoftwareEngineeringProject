package com.commercebank.dao;

import com.commercebank.api.Branch;
import com.commercebank.mapper.BranchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/branch") // Map any HTTP requests at this url to this class
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

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    public List<Branch> list(){
        // Run the SQL query on the database to select all branches and return a List of Branch objects
        return this.jdbcTemplate.query("SELECT * FROM branch", branchMapper);
    }
}
