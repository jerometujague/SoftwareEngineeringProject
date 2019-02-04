package com.commercebank.mapper;

import com.commercebank.api.Appointment;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;


public class AppointmentMapper implements RowMapper<Appointment> {
    @Override
    public Appointment mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new appointment object that is mapped to the SQL Result rs
        return new Appointment(
                rs.getInt("id"),
                rs.getInt("date_id"),
                rs.getInt("time_id"),
                rs.getInt("branch_id"),
                rs.getInt("manager_id"),
                rs.getInt("customer_id"));
    }
}
