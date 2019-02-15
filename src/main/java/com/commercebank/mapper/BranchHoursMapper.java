package com.commercebank.mapper;

import com.commercebank.model.BranchHours;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class BranchHoursMapper implements RowMapper<BranchHours> {
    @Override
    public BranchHours mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new BranchHours object that is mapped to the SQL Result rs
        return new BranchHours(
                rs.getInt("id"),
                rs.getTime("open_time").toLocalTime(),
                rs.getTime("close_time").toLocalTime(),
                rs.getInt("branch_id"),
                rs.getInt("day_of_week"));
    }
}
