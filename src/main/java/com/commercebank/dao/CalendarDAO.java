package com.commercebank.dao;

import com.commercebank.mapper.CalendarMapper;
import com.commercebank.model.Calendar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CalendarDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final CalendarMapper calendarMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    CalendarDAO(final JdbcTemplate jdbcTemplate, final CalendarMapper calendarMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.calendarMapper = calendarMapper;
    }

    public List<Calendar> list(){
        // Run the SQL query on the database to select all calendars and return a List of Calendar objects
        return this.jdbcTemplate.query("SELECT * FROM calendar", calendarMapper);
    }
}
