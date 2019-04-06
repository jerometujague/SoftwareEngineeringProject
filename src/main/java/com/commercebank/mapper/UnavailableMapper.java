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
        // Create a new unavailable object that is mapped to the SQL Result rs
        return new Unavailable(
                rs.getInt("id"),
                rs.getInt("calendar_id"),
                rs.getTime("time").toLocalTime(),
                rs.getInt("refer_id"));
    }
}
