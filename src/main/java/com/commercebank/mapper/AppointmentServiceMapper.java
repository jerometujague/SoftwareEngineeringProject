package com.commercebank.mapper;

import com.commercebank.model.AppointmentService;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class AppointmentServiceMapper implements RowMapper<AppointmentService> {
    @Override
    public AppointmentService mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new AppointmentService(
                rs.getInt("service_id"),
                rs.getInt("appointment_id"));
    }
}
