package com.commercebank.mapper;

import com.commercebank.model.Service;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class ServiceMapper implements RowMapper<Service> {
    @Override
    public Service mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new service object that is mapped to the SQL Result rs
        return new Service(
                rs.getInt("id"),
                rs.getString("service"));

    }
}
