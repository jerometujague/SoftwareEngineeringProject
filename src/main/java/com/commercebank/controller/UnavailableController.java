package com.commercebank.controller;

import com.commercebank.dao.UnavailableDAO;
import com.commercebank.model.Unavailable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/unavailables") // Map any HTTP requests at this url to this class
public class UnavailableController {
    // Dependencies
    private final UnavailableDAO unavailableDAO;

    @Autowired // Use dependency injection to get the dependencies
    public UnavailableController(UnavailableDAO unavailableDAO) {
        this.unavailableDAO = unavailableDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Unavailable> getUnavailables(){
        return unavailableDAO.list();
    }

    // Note: still need to figure out how to do this...
    @RequestMapping(value = "/add", method = RequestMethod.POST) // called when there is a POST request
    String post(){ return "something was posted";}

}
