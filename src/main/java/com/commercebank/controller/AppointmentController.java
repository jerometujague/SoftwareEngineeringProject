package com.commercebank.controller;

import com.commercebank.dao.AppointmentDAO;
import com.commercebank.dao.CustomerDAO;
import com.commercebank.mail.MailSender;
import com.commercebank.model.Appointment;
import com.commercebank.model.Customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/appointments") // Map any HTTP requests at this url to this class
public class AppointmentController {

    // Dependencies
    private final AppointmentDAO appointmentDAO;
    private MailSender mailSender;
    private CustomerDAO customerDAO;

    @Autowired // Use dependency injection to get the dependencies
    public AppointmentController(AppointmentDAO appointmentDAO, CustomerDAO customerDAO, MailSender smtp) {
        this.appointmentDAO = appointmentDAO;
        this.mailSender = smtp;
        this.customerDAO = customerDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Appointment> getAppointments(){
        return appointmentDAO.list();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void scheduleAppointment(@RequestBody Appointment appointment) throws MessagingException{
        // TODO: Select a manager that has the appropriate skill
        appointment.setManagerId(1);
        appointmentDAO.insert(appointment);

        int customerID = appointment.getCustomerId();
        String apptDetails = appointment.toString();
        String messageBody = "Your appointment is scheduled for " + apptDetails;

        // get customer email address for customerID in the just-scheduled appointment
        String customerEmail = customerDAO.getEmail(customerID);

        mailSender.send(customerEmail, "Banking Appointment", messageBody);
       }

}
