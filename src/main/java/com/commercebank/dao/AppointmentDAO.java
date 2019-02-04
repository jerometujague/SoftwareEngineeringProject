package com.commercebank.dao;

import com.commercebank.api.Appointment;
import com.commercebank.mapper.AppointmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/appointment") // Map any HTTP requests at this url to this class
public class AppointmentDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;

    @Autowired // This tells Spring to use the DataSource Bean we created in the configuration class
    public AppointmentDAO(final DataSource dataSource){
        // Set up the jdbcTemplate with the dataSource
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    public List<Appointment> list(){
        // Run the SQL query on the database to select all appointments and return a List of Appointment objects
        return this.jdbcTemplate.query("SELECT * FROM appointments", new AppointmentMapper());
    }
}
