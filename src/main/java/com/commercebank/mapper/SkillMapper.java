package com.commercebank.mapper;

import com.commercebank.model.Skill;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class SkillMapper implements RowMapper<Skill> {
    @Override
    public Skill mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new skill object that is mapped to the SQL Result rs
        return new Skill(
                rs.getInt("manager_id"),
                rs.getInt("service_id"));
    }
}
