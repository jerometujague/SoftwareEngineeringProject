package com.commercebank.mapper;

import com.commercebank.api.Manager;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ManagerMapper implements RowMapper<Manager> {
    @Override
    public Manager mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Manager(
                rs.getInt("id"),
                rs.getString("firstName"),
                rs.getString("lastName"),
                rs.getString("email"),
                rs.getInt("branchId"));
    }
}
