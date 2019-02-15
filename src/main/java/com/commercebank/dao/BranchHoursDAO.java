package com.commercebank.dao;

import com.commercebank.mapper.BranchHoursMapper;
import com.commercebank.model.BranchHours;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BranchHoursDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final BranchHoursMapper branchHoursMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    BranchHoursDAO(final JdbcTemplate jdbcTemplate, final BranchHoursMapper branchHoursMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.branchHoursMapper = branchHoursMapper;
    }

    public List<BranchHours> list(){
        // Run the SQL query on the database to select all branch hours and return a List of BranchHours objects
        return this.jdbcTemplate.query("SELECT * FROM branch_hours", branchHoursMapper);
    }
}
