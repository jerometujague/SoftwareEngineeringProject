package com.commercebank.mail;

import com.commercebank.dao.*;
import com.commercebank.model.*;
import com.commercebank.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.File;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Component
public class MailContent {

    // Dependencies
    private final MailSender mailSender;
    private final CustomerDAO customerDAO;
    private final CalendarDAO calendarDAO;
    private final BranchDAO branchDAO;
    private final ServiceDAO serviceDAO;

    @Autowired
    public MailContent(CustomerDAO customerDAO, CalendarDAO calendarDAO, BranchDAO branchDAO,
                       ServiceDAO serviceDAO, MailSender smtp){
        this.mailSender = smtp;
        this.customerDAO = customerDAO;
        this.calendarDAO = calendarDAO;
        this.branchDAO = branchDAO;
        this.serviceDAO = serviceDAO;
    }

     public void appointmentEmail(Appointment appointment, Manager manager, String type) throws Exception {

        // get appointment date
         List<Calendar> calendars = calendarDAO.list();
        Calendar calendar = calendars.get(appointment.getCalendarId() - 1);
        LocalDate date = calendar.getDate();
        String day = DateUtil.ordinal(date.getDayOfMonth());
        String upperMonth = String.valueOf(date.getMonth());
        String month = upperMonth.substring(0, 1) + upperMonth.substring(1).toLowerCase();
        int year = date.getYear();
        String upperDayOfWeek = String.valueOf(date.getDayOfWeek());
        String dayOfWeek = upperDayOfWeek.substring(0, 1) + upperDayOfWeek.substring(1).toLowerCase();

        // get appointment time and convert to standard format
        LocalTime time = appointment.getTime();
        String apptTime = DateUtil.hourToHumanString(time.getHour());

        // get appointment branch info
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

        // get appointment manager info
        String managerName = manager.getFirstName() + " " + manager.getLastName();
        String managerEmail = manager.getEmail();
        String managerPhone = manager.getPhoneNumber();

        // get appointment note
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

        // create the text to display in email
         String messageBody;
         if (type.equals("new")) {
              messageBody = "Dear " + customerName + ",<br><br>" + "Your appointment regarding " +
                     service + " is scheduled for " + dayOfWeek + ", " + month + " " + day + ", " + year +
                     " at " + apptTime + ".<br>" +
                     "You will be meeting with " + managerName + " at " + branchName + ".<br>" +
                     "The address is " + branchAddress + ".<br><br>";

             if (!note.isEmpty()) {
                 messageBody += "You entered the following custom note: " + note + "<br><br>";
             }

             messageBody += "If you have questions, or need to reschedule, please contact " + managerName +
                     " at " + managerPhone + " or " + managerEmail;
         }
         else if (type.equals("delete")){
              messageBody = "Dear " + customerName + ",<br><br>" + "Your appointment scheduled for " +
                     dayOfWeek + ", " + month + " " + day + ", " + year +
                     " at " + apptTime + "<br>" + "was cancelled.<br><br>";
         }
         else{ // appointment update
             messageBody = "Dear " + customerName + ",<br><br>" + "Your appointment has been changed. " +
                     "Your new appointment regarding " +
                     service + " is scheduled for " + dayOfWeek + ", " + month + " " + day + ", " + year +
                     " at " + apptTime + ".<br>" +
                     "You will be meeting with " + managerName + " at " + branchName + ".<br>" +
                     "The address is " + branchAddress + ".<br><br>";

             if (note != null && !note.isEmpty()) {
                 messageBody += "You entered the following custom note: " + note + "<br><br>";
             }

             messageBody += "If you have questions, or need to reschedule, please contact " + managerName +
                     " at " + managerPhone + " or " + managerEmail;
         }

        // create the .ics file (calendar invite) to send as an attachment (only for new or update appts)
         if (type.equals("new") || type.equals("update")) {
             File apptfile = new File("appointmentInvite.ics");
             if (!apptfile.exists()) {
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
             if (startHourUTC < 10) {
                 leadingZeroStart = "0";
             }
             if (endHourUTC < 10) {
                 leadingZeroEnd = "0";
             }
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
         }
         if (type.equals("new")) {
             mailSender.send(customerEmail, managerEmail, "Banking Appointment", messageBody, "appointmentInvite.ics");
         }
         else if (type.equals("update")){
             mailSender.send(customerEmail, managerEmail, "Banking Appointment Update", messageBody, "appointmentInvite.ics");
         }
         else { // don't send attachment for deleted appt
             mailSender.send(customerEmail, managerEmail, "Cancelled Banking Appointment", messageBody);
         }
     }


}
