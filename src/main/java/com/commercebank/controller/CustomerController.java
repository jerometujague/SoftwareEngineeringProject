package com.commercebank.controller;

import com.commercebank.dao.CustomerDAO;
import com.commercebank.model.Customer;
import com.fasterxml.jackson.core.JsonEncoding;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping(value = "/{email}/", method = RequestMethod.GET)
    Customer getCustomer(@PathVariable("email") String email){
        List<Customer> customers = customerDAO.list(email);

        // The the only customer if there is one
        if(customers.isEmpty()){
            return new Customer(0, null, null, null, null);
        } else {
            return customers.get(0);
        }
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void addCustomer(@RequestBody Customer customer) {
        customerDAO.insert(customer);
    }
}
