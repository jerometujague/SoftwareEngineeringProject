package com.commercebank.controller;

import com.commercebank.dao.*;
import com.commercebank.mail.MailSender;
import com.commercebank.model.*;
import com.commercebank.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
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
    private final ServiceDAO serviceDAO;

    @Autowired // Use dependency injection to get the dependencies
    public AppointmentController(AppointmentDAO appointmentDAO, CustomerDAO customerDAO,
                                 CalendarDAO calendarDAO, BranchDAO branchDAO, SkillDAO skillDAO,
                                 ManagerDAO managerDAO, ServiceDAO serviceDAO, MailSender smtp) {
        this.appointmentDAO = appointmentDAO;
        this.mailSender = smtp;
        this.customerDAO = customerDAO;
        this.calendarDAO = calendarDAO;
        this.branchDAO = branchDAO;
        this.managerDAO = managerDAO;
        this.skillDAO = skillDAO;
        this.serviceDAO = serviceDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Appointment> getAppointments(){
        return appointmentDAO.list();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void scheduleAppointment(@RequestBody Appointment appointment) throws MessagingException, IOException {

        // find available manager with appropriate skill for this appointment
        LocalTime time = appointment.getTime();

        // change time to standard 12-hour am/pm
        String apptTime = DateUtil.hourToHumanString(time.getHour());

        // get list of available managers
        List<Manager> availableManagers = managerDAO.list(appointment.getBranchId(), appointment.getServiceId(),
                appointment.getCalendarId(), appointment.getTime());

        //choose 1st available manager & assign to this appointment
        Manager chooseManager = availableManagers.get(0);
        appointment.setManagerId(chooseManager.getId());

        // add this appointment to the database
        appointmentDAO.insert(appointment);

        // get appointment date, time, branch, manager, & service info
        List<Calendar> calendars = calendarDAO.list();
        Calendar calendar = calendars.get(appointment.getCalendarId() - 1);
        LocalDate date = calendar.getDate();
        String day = DateUtil.ordinal(date.getDayOfMonth());
        String upperMonth = String.valueOf(date.getMonth());
        String month = upperMonth.substring(0,1) + upperMonth.substring(1).toLowerCase();
        int year = date.getYear();
        String upperDayOfWeek = String.valueOf(date.getDayOfWeek());
        String dayOfWeek = upperDayOfWeek.substring(0,1)+ upperDayOfWeek.substring(1).toLowerCase();

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

        List<Service> services = serviceDAO.list();
        Service apptService = services.get(appointment.getServiceId() - 1);
        String service = apptService.getService();

        // get customer info
        List<Customer> customers = customerDAO.list();
        Customer customer = customers.get(appointment.getCustomerId() - 1);
        String customerEmail = customer.getEmail();
        String customerName = customer.getFirstName() + " " + customer.getLastName();

        // create the text to display in the email
        String messageBody = "Dear " + customerName + ",<br><br>" + "Your appointment regarding " +
                service + " is scheduled for " + dayOfWeek + ", " + month + " " + day + ", " + year +
                " at " + apptTime + ".<br>" +
                "You will be meeting with " + managerName + " at " + branchName + ".<br>" +
                "The address is " + branchAddress + ".<br><br>" +
                "If you have questions, or need to reschedule, please contact " + managerName +
                " at " + managerPhone + " or " + managerEmail;

        // create the .ics file (calendar invite) to send as an attachment
        File apptfile = new File("appointmentInvite.ics");
        if (!apptfile.exists()){
            apptfile.createNewFile();
        }
        PrintWriter pw = new PrintWriter(apptfile); // will overwrite existing file info
        //get timestamp
        String timeStamp = DateUtil.getTimeStamp();

        // convert appointment date & time to required format
        StringBuilder strDate = new StringBuilder(date.toString());
        strDate.deleteCharAt(4); strDate.deleteCharAt(6);
        String dateStart = strDate.toString();

       // change times to UTC for calendar invite
        int startHourUTC = (time.getHour() + 5)%24; // currently UTC = CDT + 5 hours
        int endHourUTC = (startHourUTC + 1)%24;
        // todo: Add logic to switch date to next day if UTC time past 2400

        // add leading zero to hour if less than 10
        String leadingZeroStart = "";
        String leadingZeroEnd = "";
        if (startHourUTC < 10) {leadingZeroStart = "0";}
        if (endHourUTC < 10) {leadingZeroEnd = "0";}
        String dateTimeStart = dateStart + "T" + leadingZeroStart + startHourUTC + "000000Z";
        String dateTimeEnd = dateStart + "T" + leadingZeroEnd + endHourUTC + "000000Z";

        // put appointment info into .ics file
        pw.println("BEGIN:VCALENDAR");
        pw.println("VERSION: 2.0");
        pw.println("PRODID:-//SE3910//Project//EN");
        pw.println("BEGIN:VEVENT");
        pw.println("UID:" + timeStamp + "SE1234@google.com");
        pw.println("DTSTART:" + dateTimeStart);
        pw.println("DTEND:" + dateTimeEnd);
        pw.println("DTSTAMP:" + timeStamp);
        pw.println("ORGANIZER;CN=" + managerName + ":mailto:" + managerEmail);
        pw.println("SUMMARY:Commerce Bank Appointment");
        pw.println("END:VEVENT");
        pw.println("END:VCALENDAR");

        pw.close();

        // send email
        mailSender.send(customerEmail, managerEmail, "Banking Appointment", messageBody, "appointmentInvite.ics");
       }

}
