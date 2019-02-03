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

@RestController
@RequestMapping(value = "/api/appointment")
public class AppointmentDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AppointmentDAO(final DataSource dataSource){
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public List<Appointment> list(){
        return this.jdbcTemplate.query("SELECT * FROM appointments", new AppointmentMapper());
    }
}
