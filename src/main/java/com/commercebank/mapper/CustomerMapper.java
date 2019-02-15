package com.commercebank.mapper;

import com.commercebank.model.Customer;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class CustomerMapper implements RowMapper<Customer> {
    @Override
    public Customer mapRow(ResultSet rs, int rowNum) throws SQLException {
        // Create a new customer object that is mapped to the SQL Result rs
        return new Customer(
                rs.getInt("id"),
                rs.getString("f_name"),
                rs.getString("l_name"),
                rs.getString("phone_num"),
                rs.getString("email"));
    }
}
