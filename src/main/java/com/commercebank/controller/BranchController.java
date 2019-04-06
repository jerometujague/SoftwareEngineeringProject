package com.commercebank.controller;

import com.commercebank.dao.BranchDAO;
import com.commercebank.dao.ManagerDAO;
import com.commercebank.dao.SkillDAO;
import com.commercebank.model.Branch;
import com.commercebank.model.Manager;
import com.commercebank.model.Skill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

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

    @RequestMapping(method = RequestMethod.POST)
    public List<Branch> getBranches(@RequestBody int[] serviceIds){
        List<Branch> branches =  branchDAO.list();

        // Set hasService to true for branches that have the service
        for(Branch b : branches){
            if(hasService(b.getId(), serviceIds)){
                b.setAppointmentCount(((int)appointmentSlotController.getAppointmentSlots(b.getId(), serviceIds)
                        .parallelStream()
                        .filter(s -> !s.getTaken())
                        .count()));
                b.setHasService(true);
            }
        }

        return branches;
    }

    public boolean hasService(int branchId, int[] serviceIds){
        List<Skill> skills = skillDAO.list();
        List<Manager> managers = managerDAO.list();

        // Check if there is a skill for every service
        // Check if manager who has the skill works at this branch
        return managers.stream()
                .anyMatch(m -> m.getBranchId() == branchId
                        && Arrays.stream(serviceIds)
                        .allMatch(service -> skills.stream()
                                .anyMatch(skill -> skill.getServiceId() == service
                                        && skill.getManagerId() == m.getId())));
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void addBranch(@RequestBody Branch branch){
        branchDAO.insert(branch);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    void updateBranch(@RequestBody Branch branch) {
        branchDAO.update(branch);
    }

    @RequestMapping(value = "/delete/{id}/", method = RequestMethod.DELETE)
    void deleteBranch(@PathVariable("id") int id){
        branchDAO.delete(id);
    }
}
