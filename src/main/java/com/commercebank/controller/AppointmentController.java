package com.commercebank.controller;

import com.commercebank.dao.*;
import com.commercebank.mail.MailContent;
import com.commercebank.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;


import javax.mail.MessagingException;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Stream;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/appointments") // Map any HTTP requests at this url to this class
public class AppointmentController {

    // Dependencies
    private final AppointmentDAO appointmentDAO;
    private final ManagerDAO managerDAO;
    private final SkillDAO skillDAO;
    private final UnavailableDAO unavailableDAO;
    private final MailContent mailContent;

    @Autowired // Use dependency injection to get the dependencies
    public AppointmentController(AppointmentDAO appointmentDAO,
                                 SkillDAO skillDAO,
                                 ManagerDAO managerDAO,
                                 UnavailableDAO unavailableDAO, MailContent mailContent) {
        this.appointmentDAO = appointmentDAO;
        this.managerDAO = managerDAO;
        this.skillDAO = skillDAO;
        this.unavailableDAO = unavailableDAO;
        this.mailContent = mailContent;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Appointment> getAppointments(){
        return appointmentDAO.list();
    }

    @RequestMapping(value = "/delete/{id}/", method = RequestMethod.DELETE)
    void deleteAppointment(@PathVariable("id") int id){
        appointmentDAO.delete(id);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    void updateAppointment(@RequestBody Appointment appointment){
        appointmentDAO.update(appointment);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void scheduleAppointment(@RequestBody Appointment appointment) throws MessagingException, IOException, Exception {

        // get list of available managers
        List<Manager> managers = managerDAO.list();
        List<Unavailable> managerUnavailables = unavailableDAO.listManagers();
        List<Skill> skills = skillDAO.list();

        // This is the same as in AppointmentSlotController class
        Supplier<Stream<Manager>> availableManagers = () -> managers.parallelStream()
                .filter(m -> m.getBranchId() == appointment.getBranchId() // They must be at this branch
                        && (managerUnavailables // There can't be an unavailable for that time
                        .parallelStream()
                        .noneMatch(u -> u.getReferId() == m.getId()
                                && u.getTime().getHour() == appointment.getTime().getHour()
                                && u.getCalendarId() == appointment.getCalendarId()))
                        && Arrays.stream(appointment.getServiceIds()) // They must have all of the serviceIds
                        .allMatch(service -> skills.parallelStream()
                                .anyMatch(skill -> skill.getServiceId() == service
                                        && skill.getManagerId() == m.getId())));

        //choose 1st available manager & assign to this appointment
        Optional<Manager> chooseManager = availableManagers.get().findFirst();
        Manager apptManager = chooseManager.get();
        appointment.setManagerId(apptManager.getId());

        // add this appointment to the database
        appointmentDAO.insert(appointment);

        if(!appointment.isEmailConsent()){
            return;
        }

        // send email to customer
        mailContent.AppointmentEmail(appointment, apptManager);

    }
}
