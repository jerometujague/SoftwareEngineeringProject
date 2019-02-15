package com.commercebank.mapper;

import com.commercebank.model.Calendar;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class CalendarMapper implements RowMapper<Calendar> {
    @Override
    public Calendar mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new calendar object that is mapped to the SQL Result rs
        return new Calendar(
                rs.getInt("calendar_id"),
                rs.getDate("calendar_Date").toLocalDate(),
                rs.getBoolean("Is_Holiday"));
    }
}
