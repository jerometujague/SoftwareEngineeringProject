package com.commercebank.mapper;

import com.commercebank.model.Branch;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class BranchMapper implements RowMapper<Branch> {
    @Override
    public Branch mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new branch object that is mapped to the SQL Result rs
        return new Branch(
                rs.getInt("id"),
                rs.getString("street_address"),
                rs.getString("city"),
                rs.getString("state"),
                rs.getInt("zip"));
    }
}
