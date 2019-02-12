package com.commercebank.mapper;

import com.commercebank.model.Unavailable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class UnavailableMapper implements RowMapper<Unavailable> {
    @Override
    public Unavailable mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new branch object that is mapped to the SQL Result rs
        return new Unavailable(
                rs.getInt("id"),
                rs.getInt("date_id"),
                rs.getInt("time_id"),
                rs.getInt("branch_id"),
                rs.getInt("manager_id"),
                rs.getInt("service_id"));
    }
}
