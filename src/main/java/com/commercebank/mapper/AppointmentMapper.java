package com.commercebank.mapper;

import com.commercebank.api.Appointment;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;


public class AppointmentMapper implements RowMapper<Appointment> {
    @Override
    public Appointment mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Appointment(
                rs.getInt("id"),
                rs.getDate("date"),
                rs.getInt("branch"),
                rs.getInt("managerId"),
                rs.getInt("customerId"));
    }
}
