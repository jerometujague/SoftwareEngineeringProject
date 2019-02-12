package com.commercebank.controller;

import com.commercebank.dao.AppointmentDAO;
import com.commercebank.model.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/appointments") // Map any HTTP requests at this url to this class
public class AppointmentController {

    // Dependencies
    private final AppointmentDAO appointmentDAO;

    @Autowired // Use dependency injection to get the dependencies
    public AppointmentController(AppointmentDAO appointmentDAO) {
        this.appointmentDAO = appointmentDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Appointment> getAppointments(){
        return appointmentDAO.list();
    }
}
