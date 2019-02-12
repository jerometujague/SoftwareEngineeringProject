package com.commercebank.mapper;

import com.commercebank.model.AppointmentTime;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class AppointmentTimeMapper implements RowMapper<AppointmentTime> {
    @Override
    public AppointmentTime mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new branch object that is mapped to the SQL Result rs
        return new AppointmentTime(
                rs.getInt("id"),
                rs.getTime("time"));
    }
}
