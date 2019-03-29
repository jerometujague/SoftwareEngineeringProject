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
import org.springframework.web.bind.annotation.PathVariable;


import javax.mail.MessagingException;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalTime;
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
    private final MailSender mailSender;
    private final CustomerDAO customerDAO;
    private final CalendarDAO calendarDAO;
    private final BranchDAO branchDAO;
    private final ManagerDAO managerDAO;
    private final SkillDAO skillDAO;
    private final ServiceDAO serviceDAO;
    private final UnavailableDAO unavailableDAO;

    @Autowired // Use dependency injection to get the dependencies
    public AppointmentController(AppointmentDAO appointmentDAO, CustomerDAO customerDAO,
                                 CalendarDAO calendarDAO, BranchDAO branchDAO, SkillDAO skillDAO,
                                 ManagerDAO managerDAO, ServiceDAO serviceDAO, MailSender smtp,
                                 UnavailableDAO unavailableDAO) {
        this.appointmentDAO = appointmentDAO;
        this.mailSender = smtp;
        this.customerDAO = customerDAO;
        this.calendarDAO = calendarDAO;
        this.branchDAO = branchDAO;
        this.managerDAO = managerDAO;
        this.skillDAO = skillDAO;
        this.serviceDAO = serviceDAO;
        this.unavailableDAO = unavailableDAO;
    }

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    List<Appointment> getAppointments(){
        return appointmentDAO.list();
    }

    @RequestMapping(value = "/delete/{id}/", method = RequestMethod.DELETE)
    void deleteAppointment(@PathVariable("id") int id){
        appointmentDAO.delete(id);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    void scheduleAppointment(@RequestBody Appointment appointment) throws MessagingException, IOException, Exception {

        LocalTime time = appointment.getTime();

        // change time to standard 12-hour am/pm
        String apptTime = DateUtil.hourToHumanString(time.getHour());

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

        // get appointment date, time, branch, manager, & service info
        List<Calendar> calendars = calendarDAO.list();
        Calendar calendar = calendars.get(appointment.getCalendarId() - 1);
        LocalDate date = calendar.getDate();
        String day = DateUtil.ordinal(date.getDayOfMonth());
        String upperMonth = String.valueOf(date.getMonth());
        String month = upperMonth.substring(0, 1) + upperMonth.substring(1).toLowerCase();
        int year = date.getYear();
        String upperDayOfWeek = String.valueOf(date.getDayOfWeek());
        String dayOfWeek = upperDayOfWeek.substring(0, 1) + upperDayOfWeek.substring(1).toLowerCase();

        List<Branch> branches = branchDAO.list();
        Optional<Branch> possibleBranch = branches.parallelStream()
                .filter(b -> b.getId() == appointment.getBranchId())
                .findFirst();

        if(!possibleBranch.isPresent()){
            throw new Exception("Branch not found");
        }

        Branch branch = possibleBranch.get();

        String branchName = branch.getName();
        String branchAddress = branch.getStreetAddress() + ", " + branch.getCity() + ", "
                + branch.getState() + " " + branch.getZipCode();

        String managerName = apptManager.getFirstName() + " " + apptManager.getLastName();
        String managerEmail = apptManager.getEmail();
        String managerPhone = apptManager.getPhoneNumber();

        String note = appointment.getNote();

        List<Service> services = serviceDAO.list();

        String service = "";

        int numServiceIds = appointment.getServiceIds().length;
        for(int i = 0; i < numServiceIds; i++){
            Service apptService = services.get(appointment.getServiceIds()[i] - 1);

            if(i == 0){
                service = apptService.getService();
            } else if (i == numServiceIds - 1 && numServiceIds == 2) {
                service = service + " and " + apptService.getService();
            } else if (i == numServiceIds - 1) {
                service = service + ", and " + apptService.getService();
            } else {
                service = service + ", " + apptService.getService();
            }
        }

        // get customer info
        List<Customer> customers = customerDAO.list();

        Optional<Customer> possibleCustomer = customers.parallelStream()
                .filter(c -> c.getId() == appointment.getCustomerId())
                .findFirst();

        if(!possibleCustomer.isPresent()){
            throw new Exception("Customer not found");
        }

        Customer customer = possibleCustomer.get();

        String customerEmail = customer.getEmail();
        String customerName = customer.getFirstName() + " " + customer.getLastName();

        // create the text to display in the email
        String messageBody = "Dear " + customerName + ",<br><br>" + "Your appointment regarding " +
                service + " is scheduled for " + dayOfWeek + ", " + month + " " + day + ", " + year +
                " at " + apptTime + ".<br>" +
                "You will be meeting with " + managerName + " at " + branchName + ".<br>" +
                "The address is " + branchAddress + ".<br><br>";

        if(!note.isEmpty()){
            messageBody += "You entered the following custom note: " + note + "<br><br>";
        }

        messageBody += "If you have questions, or need to reschedule, please contact " + managerName +
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
        strDate.deleteCharAt(4);
        strDate.deleteCharAt(6);
        String dateStart = strDate.toString();

        // change times to UTC for calendar invite
        int startHourUTC = (time.getHour() + 5) % 24; // currently UTC = CDT + 5 hours
        int endHourUTC = (startHourUTC + 1) % 24;
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
