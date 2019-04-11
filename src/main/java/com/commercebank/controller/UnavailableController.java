package com.commercebank.controller;

import com.commercebank.dao.UnavailableDAO;
import com.commercebank.model.Unavailable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api") // Map any HTTP requests at this url to this class
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

    @RequestMapping(value = "/branchUnavailables", method = RequestMethod.GET)
    List<Unavailable> getBranchUnavailables(){
        return unavailableDAO.listBranches();
    }

    @RequestMapping(value = "/managerUnavailables", method = RequestMethod.GET)
    List<Unavailable> getManagerUnavailables(){
        return unavailableDAO.listManagers();
    }

    @RequestMapping(value = "/unavailables/branch/add", method = RequestMethod.POST)
    void addBranchUnavailable(@RequestBody Unavailable unavailable) {
        unavailableDAO.insertBranchUnavailable(unavailable);
    }

    @RequestMapping(value = "/unavailables/manager/add", method = RequestMethod.POST)
    void addManagerUnavailable(@RequestBody Unavailable unavailable) {
        unavailableDAO.insertManagerUnavailable(unavailable);
    }

    @RequestMapping(value = "/unavailables/branch/delete/{id}/", method = RequestMethod.DELETE)
    void deleteBranchUnavailable(@PathVariable("id") int id){
        unavailableDAO.deleteBranchUnavailable(id);
    }

    @RequestMapping(value = "/unavailables/manager/delete/{id}/", method = RequestMethod.DELETE)
    void deleteManagerUnavailable(@PathVariable("id") int id){
        unavailableDAO.deleteManagerUnavailable(id);
    }

    @RequestMapping(value = "/unavailables/branch/update", method = RequestMethod.POST)
    void updateBranchUnavailable(@RequestBody Unavailable unavailable) {
        unavailableDAO.updateBranchUnavailable(unavailable);
    }

    @RequestMapping(value = "/unavailables/manager/update", method = RequestMethod.POST)
    void updateManagerUnavailable(@RequestBody Unavailable unavailable) {
        unavailableDAO.updateManagerUnavailable(unavailable);
    }
}
