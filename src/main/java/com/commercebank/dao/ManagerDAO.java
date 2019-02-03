package com.commercebank.dao;

import com.commercebank.api.Manager;
import com.commercebank.mapper.ManagerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.List;

@RestController
@RequestMapping(value = "/api/manager")
public class ManagerDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ManagerDAO(final DataSource dataSource){
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Manager> list(){
        return this.jdbcTemplate.query("SELECT * FROM managers", new ManagerMapper());
    }
}
