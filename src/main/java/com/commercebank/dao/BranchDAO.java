package com.commercebank.dao;

import com.commercebank.api.Branch;
import com.commercebank.mapper.BranchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/branch") // Map any HTTP requests at this url to this class
public class BranchDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;

    @Autowired // This tells Spring to use the DataSource Bean we created in the configuration class
    public BranchDAO(final DataSource dataSource){
        // Set up the jdbcTemplate with the dataSource
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    public List<Branch> list(){
        // Run the SQL query on the database to select all branches and return a List of Branch objects
        return this.jdbcTemplate.query("SELECT * FROM branches", new BranchMapper());
    }
}
