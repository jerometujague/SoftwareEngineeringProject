package com.commercebank.mapper;

import com.commercebank.model.Skills;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class SkillsMapper implements RowMapper<Skills> {
    @Override
    public Skills mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new branch object that is mapped to the SQL Result rs
        return new Skills(
                rs.getInt("manager_id"),
                rs.getInt("service_id"));
    }
}
