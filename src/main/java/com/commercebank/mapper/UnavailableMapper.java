package com.commercebank.mapper;

import com.commercebank.model.Unavailable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class UnavailableMapper implements RowMapper<Unavailable> {
    @Override
    public Unavailable mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new unavailable object that is mapped to the SQL Result rs
        return new Unavailable(
                rs.getInt("id"),
                rs.getDate("date_").toLocalDate(),
                rs.getTime("time").toLocalTime(),
                (Integer)rs.getObject("branch_id"),
                (Integer)rs.getObject("manager_id"),
                (Integer)rs.getObject("day_name"));
    }
}
