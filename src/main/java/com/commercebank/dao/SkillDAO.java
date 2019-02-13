package com.commercebank.dao;

import com.commercebank.mapper.SkillMapper;
import com.commercebank.model.Skill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SkillDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final SkillMapper skillMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    SkillDAO(final JdbcTemplate jdbcTemplate, final SkillMapper skillMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.skillMapper = skillMapper;
    }

    public List<Skill> list(){
        // Run the SQL query on the database to select all skills and return a List of Skill objects
        return this.jdbcTemplate.query("SELECT * FROM skills", skillMapper);
    }
}
