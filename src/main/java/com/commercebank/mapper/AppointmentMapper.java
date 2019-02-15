package com.commercebank.mapper;

import com.commercebank.model.Appointment;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class AppointmentMapper implements RowMapper<Appointment> {
    @Override
    public Appointment mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new appointment object that is mapped to the SQL Result rs
        return new Appointment(
                rs.getInt("id"),
                rs.getInt("date_id"),
                rs.getTime("time").toLocalTime(),
                rs.getInt("branch_id"),
                rs.getInt("manager_id"),
                rs.getInt("customer_id"));
    }
}
