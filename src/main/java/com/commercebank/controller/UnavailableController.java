package com.commercebank.controller;

import com.commercebank.dao.UnavailableDAO;
import com.commercebank.model.Unavailable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    //@RequestMapping(value = "/add", method = RequestMethod.POST) // called when there is a POST request
    //String post(){ return "something was posted";}

    @RequestMapping(value = "/branch/add", method = RequestMethod.POST)
    void addBranchUnavailable(@RequestBody Unavailable unavailable) {
        unavailableDAO.insertBranchUnavailable(unavailable);
    }

    @RequestMapping(value = "/manager/add", method = RequestMethod.POST)
    void addManagerUnavailable(@RequestBody Unavailable unavailable) {
        unavailableDAO.insertManagerUnavailable(unavailable);
    }

    @RequestMapping(value = "/branch/delete/{id}/", method = RequestMethod.DELETE)
    void deleteBranchUnavailable(@PathVariable("id") int id){
        unavailableDAO.deleteBranchUnavailable(id);
    }

    @RequestMapping(value = "/manager/delete/{id}/", method = RequestMethod.DELETE)
    void deleteManagerUnavailable(@PathVariable("id") int id){
        unavailableDAO.deleteManagerUnavailable(id);
    }
}
