package com.commercebank.controller;

import com.commercebank.dao.ManagerDAO;
import com.commercebank.model.Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/managers") // Map any HTTP requests at this url to this class
public class ManagerController {
    // Dependencies
    private final ManagerDAO managerDAO;

    @Autowired // Use dependency injection to get the dependencies
    public ManagerController(ManagerDAO managerDAO) {
        this.managerDAO = managerDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Manager> getManagers(){
        return managerDAO.list();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void addManager(@RequestBody Manager manager){
        managerDAO.insert(manager);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    void updateManager(@RequestBody Manager manager) {
        managerDAO.update(manager);
    }

    @RequestMapping(value = "/delete/{id}/", method = RequestMethod.DELETE)
    void deleteManager(@PathVariable("id") int id){
        managerDAO.delete(id);
    }

}
