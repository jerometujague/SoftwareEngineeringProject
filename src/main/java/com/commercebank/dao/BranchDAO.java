package com.commercebank.dao;

import com.commercebank.api.Branch;
import com.commercebank.mapper.BranchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.List;

@RestController
@RequestMapping(value = "/api/branch")
public class BranchDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public BranchDAO(final DataSource dataSource){
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Branch> list(){
        return this.jdbcTemplate.query("SELECT * FROM branches", new BranchMapper());
    }
}
