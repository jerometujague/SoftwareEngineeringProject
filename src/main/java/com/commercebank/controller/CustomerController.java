package com.commercebank.controller;

import com.commercebank.dao.CustomerDAO;
import com.commercebank.model.Customer;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    // Dependencies
    private final CustomerDAO customerDAO;

    public CustomerController(CustomerDAO customerDAO) {
        this.customerDAO = customerDAO;
    }

    @RequestMapping("/add")
    public void addCustomer(Customer customer){
        customerDAO.add(customer);
    }
}
