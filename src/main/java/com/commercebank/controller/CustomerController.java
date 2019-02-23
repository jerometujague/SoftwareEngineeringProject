package com.commercebank.controller;

import com.commercebank.dao.CustomerDAO;
import com.commercebank.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    // Dependencies
    private final CustomerDAO customerDAO;

    @Autowired
    public CustomerController(CustomerDAO customerDAO) {
        this.customerDAO = customerDAO;
    }

    @RequestMapping(method = RequestMethod.GET)
        // This method will be called when there is a GET request made to this url
    List<Customer> getCustomers() { return customerDAO.list(); }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void addCustomer(@RequestBody Customer customer) {
        customerDAO.insert(customer);
    }
}
