package com.commercebank.controller;

import com.commercebank.dao.*;
import com.commercebank.mail.MailSender;
import com.commercebank.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/appointments") // Map any HTTP requests at this url to this class
public class AppointmentController {

    // Dependencies
    private final AppointmentDAO appointmentDAO;
    private final MailSender mailSender;
    private final CustomerDAO customerDAO;
    private final CalendarDAO calendarDAO;
    private final BranchDAO branchDAO;
    private final ManagerDAO managerDAO;
    private final SkillDAO skillDAO;

    @Autowired // Use dependency injection to get the dependencies
    public AppointmentController(AppointmentDAO appointmentDAO, CustomerDAO customerDAO,
                                 CalendarDAO calendarDAO, BranchDAO branchDAO, SkillDAO skillDAO,
                                 ManagerDAO managerDAO, MailSender smtp) {
        this.appointmentDAO = appointmentDAO;
        this.mailSender = smtp;
        this.customerDAO = customerDAO;
        this.calendarDAO = calendarDAO;
        this.branchDAO = branchDAO;
        this.managerDAO = managerDAO;
        this.skillDAO = skillDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Appointment> getAppointments(){
        return appointmentDAO.list();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void scheduleAppointment(@RequestBody Appointment appointment) throws MessagingException {

        // find available manager with appropriate skill for this appointment
        int branchID = appointment.getBranchId();
        int serviceID = appointment.getServiceId();
        int calendarID = appointment.getCalendarId();
        LocalTime time = appointment.getTime();

        List<Manager> availableManagers = managerDAO.list(appointment.getBranchId(), appointment.getServiceId(),
                appointment.getCalendarId(), appointment.getTime());
        Manager chooseManager = availableManagers.get(0);
        // Todo: what if there are no available managers?

        appointment.setManagerId(chooseManager.getId());

        // add this appointment to the database
        appointmentDAO.insert(appointment);

        // get customer ID for the just-scheduled appointment
        int customerID = appointment.getCustomerId();

        // get appointment date, time, branch, & manager info
        List<Calendar> calendars = calendarDAO.list();
        Calendar calendar = calendars.get(appointment.getCalendarId() - 1);
        LocalDate date = calendar.getDate();

        List<Branch> branches = branchDAO.list();
        Branch branch = branches.get(appointment.getBranchId() - 1);
        String branchName = branch.getName();
        String branchAddress = branch.getStreetAddress() + ", " + branch.getCity() + ", "
                + branch.getState() + " " + branch.getZipCode();

        List<Manager> managers = managerDAO.list();
        Manager apptManager = managers.get(appointment.getManagerId() - 1);
        String managerName = apptManager.getFirstName() + " " + apptManager.getLastName();
        String managerEmail = apptManager.getEmail();
        String managerPhone = apptManager.getPhoneNumber();

        // get customer info
        List<Customer> customers = customerDAO.list();
        Customer customer = customers.get(appointment.getCustomerId() - 1);
        String customerEmail = customer.getEmail();
        String customerName = customer.getFirstName() + " " + customer.getLastName();

        String messageBody = "Dear " + customerName + ",<br><br>" + "Your appointment is scheduled for " + date + " at " + time + ".<br>" +
                "You will be meeting with " + managerName + " at " + branchName + ".<br>" +
                "The address is " + branchAddress + ".<br><br>" +
                "If you have questions, or need to reschedule, please contact " + managerName +
                " at " + managerPhone + " or " + managerEmail;

        mailSender.send(customerEmail, managerEmail, "Banking Appointment", messageBody);
       }

}
