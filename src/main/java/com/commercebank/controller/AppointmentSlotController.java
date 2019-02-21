package com.commercebank.controller;

import com.commercebank.dao.*;
import com.commercebank.model.AppointmentSlot;
import com.commercebank.model.BranchHours;
import com.commercebank.model.Calendar;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/appointment-slots") // Map any HTTP requests at this url to this class
public class AppointmentSlotController {

    private final BranchHoursDAO branchHoursDAO;
    private final UnavailableDAO unavailableDAO;
    private final AppointmentDAO appointmentDAO;
    private final CalendarDAO calendarDAO;
    private final ServiceDAO serviceDAO;
    private final SkillDAO skillDAO;
    private final ManagerDAO managerDAO;

    public AppointmentSlotController(
            BranchHoursDAO branchHoursDAO,
            UnavailableDAO unavailableDAO,
            AppointmentDAO appointmentDAO,
            CalendarDAO calendarDAO,
            ServiceDAO serviceDAO,
            SkillDAO skillDAO,
            ManagerDAO managerDAO) {
        this.branchHoursDAO = branchHoursDAO;
        this.unavailableDAO = unavailableDAO;
        this.appointmentDAO = appointmentDAO;
        this.calendarDAO = calendarDAO;
        this.serviceDAO = serviceDAO;
        this.skillDAO = skillDAO;
        this.managerDAO = managerDAO;
    }

    @RequestMapping(value = "/{branchId}/{serviceId}", method = RequestMethod.GET)
    public List<AppointmentSlot> getAppointmentSlots(@PathVariable("branchId") int branchId, @PathVariable("serviceId") int serviceId){
        List<AppointmentSlot> appointmentSlots = new ArrayList<>();

        List<Calendar> calendar = calendarDAO.list();

        // Get today's day and calendarId
        int startId = calendar
                .stream()
                .filter(c -> c.getDate().isAfter(LocalDate.now()))
                .findFirst()
                .get()
                .getCalendarId();

        // Go through the calendar dates for the next two weeks
        for(int i = startId; i < startId + 7; i++){
            final int calendarId = i;

            // Get the day of week int from the current day
            int dayOfWeek = calendar.get(i - 1)
                    .getDate()
                    .getDayOfWeek()
                    .getValue();

            // Get the branch hours for that branch and for that day of the week
            Optional<BranchHours> hours = branchHoursDAO.list()
                    .stream()
                    .filter(h -> h.getDayOfWeek() == dayOfWeek
                            && h.getBranchId() == branchId)
                    .findFirst();

            // If the branch has hours for the day
            if(hours.isPresent()) {
                // Loop from start hour to close hour
                for (int hour = hours.get().getOpenTime().getHour(); hour < hours.get().getCloseTime().getHour(); hour++) {
                    final int slotHour = hour;

                    // Check if this time slot is unavailable at this branch
                    boolean branchUnavailable = unavailableDAO.listBranches()
                            .stream()
                            .anyMatch(u -> u.getTime().getHour() == slotHour
                                    && u.getReferId() == branchId
                                    && u.getCalendarId() == calendarId);

                    // Check if there is already an appointment scheduled
                    boolean taken = appointmentDAO.list()
                            .stream()
                            .anyMatch(a -> a.getCalendarId() == calendarId
                                    && a.getTime().getHour() == slotHour
                                    && a.getBranchId() == branchId);

                    // Check if the service is unavailable
                    boolean serviceUnavailable = skillDAO.list()
                            .stream()
                            .filter(s -> managerDAO.list()
                                    .stream()
                                    .anyMatch(m -> s.getManagerId() == m.getId() // Only get skills for specific branch
                                            && m.getBranchId() == branchId
                                            && (unavailableDAO.listManagers() // There can't be an unavailable for that time
                                            .stream()
                                            .noneMatch(u -> u.getReferId() == m.getId()
                                                    && u.getTime().getHour() == slotHour
                                                    && u.getCalendarId() == calendarId))))
                            .noneMatch(s -> s.getServiceId() == serviceId);

                    // Get day and month string names
                    String dayName = capitalize(DayOfWeek.of(dayOfWeek).name().toLowerCase());
                    String monthName = capitalize(calendar.get(i - 1).getDate().getMonth().name().toLowerCase());

                    String timeString = String.valueOf(slotHour) + ":00 AM";

                    // Check for PM time
                    if(slotHour > 12){
                        timeString = String.valueOf(slotHour - 12) + ":00 PM";
                    } else if(slotHour == 12){
                        timeString = "12:00 PM";
                    }

                    // Add the appointmentSlot if it is available
                    if (!branchUnavailable && !serviceUnavailable) {
                        appointmentSlots.add(new AppointmentSlot(i, dayName, ordinal(calendar.get(i - 1).getDate().getDayOfMonth()), monthName, timeString, taken));
                    }
                }
            }
        }

        return appointmentSlots;
    }

    public static String ordinal(int i) {
        String[] sufixes = new String[] { "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th" };
        switch (i % 100) {
            case 11:
            case 12:
            case 13:
                return i + "th";
            default:
                return i + sufixes[i % 10];
        }
    }

    public static String capitalize(String s){
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
