package com.commercebank.dao;

import com.commercebank.mapper.CustomerMapper;
import com.commercebank.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomerDAO {
    // The JdbcTemplate is the class that interfaces with the database
    private final JdbcTemplate jdbcTemplate;
    private final CustomerMapper customerMapper;

    @Autowired // This tells Spring to use the JdbcTemplate Bean we created in the configuration class
    CustomerDAO(final JdbcTemplate jdbcTemplate, final CustomerMapper customerMapper){
        // Set up the dependencies from Spring
        this.jdbcTemplate = jdbcTemplate;
        this.customerMapper = customerMapper;
    }

    public List<Customer> list(){
        // Run the SQL query on the database to select all customers and return a List of Customer objects
        return this.jdbcTemplate.query("SELECT * FROM customer", customerMapper);
    }

    public void add(Customer customer){
        this.jdbcTemplate.update("INSERT INTO customers (f_name, l_name, email. phone_number) VALUES (?, ?, ?, ?)",
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPhoneNumber());
    }
}
