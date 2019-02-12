package com.commercebank.controller;

import com.commercebank.dao.BranchDAO;
import com.commercebank.model.Branch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/branches") // Map any HTTP requests at this url to this class
public class BranchController {
    // Dependencies
    private final BranchDAO branchDAO;

    @Autowired // Use dependency injection to get the dependencies
    public BranchController(BranchDAO branchDAO) {
        this.branchDAO = branchDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Branch> getBranches(){
        return branchDAO.list();
    }
}
