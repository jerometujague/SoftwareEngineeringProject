package com.commercebank.mapper;

import com.commercebank.api.Branch;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BranchMapper implements RowMapper<Branch> {
    @Override
    public Branch mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Branch(
                rs.getInt("id"),
                rs.getString("address"));
    }
}
