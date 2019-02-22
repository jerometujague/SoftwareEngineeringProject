package com.commercebank.dao;

import com.commercebank.model.Appointment;
import com.commercebank.mapper.AppointmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AppointmentDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final AppointmentMapper appointmentMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    AppointmentDAO(final JdbcTemplate jdbcTemplate, final AppointmentMapper appointmentMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.appointmentMapper = appointmentMapper;
    }

    public List<Appointment> list(){
        // Run the SQL query on the database to select all appointments and return a List of Appointment objects
        return this.jdbcTemplate.query("SELECT * FROM appointment", appointmentMapper);
    }

    public void insert(Appointment appointment){
        this.jdbcTemplate.update("INSERT INTO appointment (calendar_id, time, branch_id, manager_id, customer_id, service_id) VALUES (?, ?, ?, ?, ?, ?)",
                appointment.getCalendarId(),
                appointment.getTime(),
                appointment.getBranchId(),
                appointment.getManagerId(),
                appointment.getCustomerId(),
                appointment.getServiceId());
    }
}
