package com.commercebank.controller;

import com.commercebank.dao.BranchDAO;
import com.commercebank.dao.ManagerDAO;
import com.commercebank.dao.SkillDAO;
import com.commercebank.model.Branch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/branches") // Map any HTTP requests at this url to this class
public class BranchController {
    // Dependencies
    private final BranchDAO branchDAO;
    private final SkillDAO skillDAO;
    private final ManagerDAO managerDAO;
    private final AppointmentSlotController appointmentSlotController;

    @Autowired // Use dependency injection to get the dependencies
    public BranchController(BranchDAO branchDAO, SkillDAO skillDAO, ManagerDAO managerDAO, AppointmentSlotController appointmentSlotController) {
        this.branchDAO = branchDAO;
        this.skillDAO = skillDAO;
        this.managerDAO = managerDAO;
        this.appointmentSlotController = appointmentSlotController;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Branch> getBranches(){
        return branchDAO.list();
    }

    @RequestMapping(value = "/{serviceId}", method = RequestMethod.GET)
    public List<Branch> getBranches(@PathVariable("serviceId") int serviceId){
        List<Branch> branches =  branchDAO.list();

        // Set hasService to true for branches that have the service
        for(Branch b : branches){
            if(hasService(b.getId(), serviceId)){
                b.setAppointmentCount(appointmentSlotController.getAppointmentSlots(b.getId(), serviceId).size());
                b.setHasService(true);
            }
        }

        return branches;
    }

    public boolean hasService(int branchId, int serviceId){
        // Check if the skill is for this service
        // Check if manager who has the skill works at this branch
        return skillDAO.list()
                .stream()
                .anyMatch(s -> s.getServiceId() == serviceId
                        && managerDAO.list()
                        .stream()
                        .anyMatch(m -> m.getId() == s.getManagerId()
                                && m.getBranchId() == branchId));
    }
}
