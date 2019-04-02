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

    public void insert(BranchHours branchHours){
        this.jdbcTemplate.update("INSERT INTO branch_hours (open_time, close_time, branch_id, day_of_week) VALUES (?, ?, ?, ?)",
                branchHours.getOpenTime(),
                branchHours.getCloseTime(),
                branchHours.getBranchId(),
                branchHours.getDayOfWeek());
    }

    public void change(BranchHours branchHours){
        String sql = "update branch_hours set open_time=?, close_time=? where branch_id=? and day_of_week=?";
        this.jdbcTemplate.update(sql, branchHours.getOpenTime(), branchHours.getCloseTime(),
                branchHours.getBranchId(), branchHours.getDayOfWeek());
    }
}
