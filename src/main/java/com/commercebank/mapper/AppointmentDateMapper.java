package com.commercebank.mapper;

import com.commercebank.model.AppointmentDate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class AppointmentDateMapper implements RowMapper<AppointmentDate> {
    @Override
    public AppointmentDate mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new branch object that is mapped to the SQL Result rs
        return new AppointmentDate(
                rs.getInt("id"),
                rs.getDate("date"));
    }
}
