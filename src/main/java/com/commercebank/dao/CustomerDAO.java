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

//    public List<Customer> getEmail(int customerID){
//        return this.jdbcTemplate.query("SELECT email FROM customer WHERE customerID=?", customerMapper, customerID);
//    }

    public String getEmail(int customerID){

        String sql = "SELECT email FROM customer WHERE id=?";

        String emailAddress = (String) jdbcTemplate.queryForObject(
                sql, new Object[] { customerID }, String.class);

        return emailAddress;

    }

    public List<Customer> list(String email){
        return this.jdbcTemplate.query("SELECT * FROM customer WHERE email=?", customerMapper, email);
    }

    public void insert(Customer customer){
        this.jdbcTemplate.update("INSERT INTO customer (f_name, l_name, phone_num, email) VALUES (?, ?, ?, ?)",
                customer.getFirstName(),
                customer.getLastName(),
                customer.getPhoneNumber(),
                customer.getEmail());
    }
}
