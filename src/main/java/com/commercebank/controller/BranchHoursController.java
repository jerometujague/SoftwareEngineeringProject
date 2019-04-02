package com.commercebank.controller;

import com.commercebank.dao.BranchHoursDAO;
import com.commercebank.model.BranchHours;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/branchHours") // Map any HTTP requests at this url to this class
public class BranchHoursController {
    // Dependencies
    private final BranchHoursDAO branchHoursDAO;

    @Autowired // Use dependency injection to get the dependencies
    public BranchHoursController(BranchHoursDAO branchHoursDAO) {
        this.branchHoursDAO = branchHoursDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<BranchHours> getBranchHours(){
        return branchHoursDAO.list();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void addHours(@RequestBody BranchHours branchHours){
        branchHoursDAO.insert(branchHours);
    }

    @RequestMapping(value = "/change", method = RequestMethod.POST)
    void changeHours(@RequestBody BranchHours branchHours) {
        branchHoursDAO.change(branchHours);
    }
}
