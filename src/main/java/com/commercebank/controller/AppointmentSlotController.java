package com.commercebank.controller;

import com.commercebank.dao.*;
import com.commercebank.model.*;
import com.commercebank.util.DateUtil;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Stream;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/appointment-slots") // Map any HTTP requests at this url to this class
public class AppointmentSlotController {

    private final BranchHoursDAO branchHoursDAO;
    private final UnavailableDAO unavailableDAO;
    private final AppointmentDAO appointmentDAO;
    private final CalendarDAO calendarDAO;
    private final SkillDAO skillDAO;
    private final ManagerDAO managerDAO;

    private List<Calendar> calendar;
    private List<Appointment> appointments;
    private List<Manager> managers;
    private List<Skill> skills;
    private List<Unavailable> managerUnavailables;
    private List<Unavailable> branchUnavailables;
    private List<BranchHours> branchHours;
    private LocalTime currentTime;
    private int todayCalendarId;

    public AppointmentSlotController(
            BranchHoursDAO branchHoursDAO,
            UnavailableDAO unavailableDAO,
            AppointmentDAO appointmentDAO,
            CalendarDAO calendarDAO,
            SkillDAO skillDAO,
            ManagerDAO managerDAO) {
        this.branchHoursDAO = branchHoursDAO;
        this.unavailableDAO = unavailableDAO;
        this.appointmentDAO = appointmentDAO;
        this.calendarDAO = calendarDAO;
        this.skillDAO = skillDAO;
        this.managerDAO = managerDAO;
    }

    @RequestMapping(value = "/{branchId}", method = RequestMethod.POST)
    public List<AppointmentSlot> getAppointmentSlots(@PathVariable("branchId") int branchId, @RequestBody int[] serviceIds){
        List<AppointmentSlot> appointmentSlots = new ArrayList<>();

        // Get data at the beginning to save time
        calendar = calendarDAO.list();
        appointments = appointmentDAO.list();
        managers = managerDAO.list();
        skills = skillDAO.list();
        managerUnavailables = unavailableDAO.listManagers();
        branchUnavailables = unavailableDAO.listBranches();
        branchHours = branchHoursDAO.list();

        currentTime = LocalTime.now();

        // Get today's day and calendarId
        int startId = calendar
                .parallelStream()
                .filter(c -> c.getDate().isEqual(LocalDate.now()))
                .findFirst()
                .get()
                .getCalendarId();

        todayCalendarId = startId;

        // Go through the calendar dates for the next two weeks
        for(int i = startId; i < startId + 14; i++){
            // Add all of the appointment slots for this day
            appointmentSlots.addAll(getAppointmentSlots(branchId, i, serviceIds));
        }
        
        return appointmentSlots;
    }

    @RequestMapping(value = "/{branchId}/{date}", method = RequestMethod.POST)
    public List<AppointmentSlot> getAppointmentSlots(@PathVariable("branchId") int branchId, @PathVariable("date") String date, @RequestBody int[] serviceIds){
        List<Calendar> calendar = calendarDAO.list();

        String[] dateParts = date.split("-");

        int calendarId = calendar.parallelStream()
                .filter(c -> c.getDate().isEqual(
                        LocalDate.of(
                                Integer.valueOf(dateParts[0]),
                                Integer.valueOf(dateParts[1]),
                                Integer.valueOf(dateParts[2]))))
                .findFirst()
                .get()
                .getCalendarId();

        return getAppointmentSlots(branchId, calendarId, serviceIds);
    }

    public List<AppointmentSlot> getAppointmentSlots(@PathVariable("branchId") int branchId, @PathVariable("calendarId") int calendarId, @RequestBody int[] serviceIds){
        List<AppointmentSlot> appointmentSlots = new ArrayList<>();

        // Check if the data needs to be initialized
        if(calendar == null){
            calendar = calendarDAO.list();
            appointments = appointmentDAO.list();
            managers = managerDAO.list();
            skills = skillDAO.list();
            managerUnavailables = unavailableDAO.listManagers();
            branchUnavailables = unavailableDAO.listBranches();
            branchHours = branchHoursDAO.list();

            currentTime = LocalTime.now();

            // Get today's day and calendarId
            todayCalendarId = calendar
                    .parallelStream()
                    .filter(c -> c.getDate().isEqual(LocalDate.now()))
                    .findFirst()
                    .get()
                    .getCalendarId();
        }


        // Get the day of week int from the current day
        int dayOfWeek = calendar.get(calendarId - 1)
                .getDate()
                .getDayOfWeek()
                .getValue();

        // Get the branch hours for that branch and for that day of the week
        Optional<BranchHours> hours = branchHours
                .parallelStream()
                .filter(h -> h.getDayOfWeek() == dayOfWeek
                        && h.getBranchId() == branchId)
                .findFirst();

        // If the branch has hours for the day
        if(hours.isPresent()) {
            // Check if the current time is past the close time for current day
            if((currentTime.isAfter(hours.get().getCloseTime()) && calendarId == todayCalendarId) || (calendarId < todayCalendarId)){
                return appointmentSlots;
            }

            // Loop from start hour to close hour
            for (int hour = hours.get().getOpenTime().getHour(); hour < hours.get().getCloseTime().getHour(); hour++) {
                final int slotHour = hour;

                // Check if this time slot is unavailable at this branch
                boolean branchUnavailable = branchUnavailables
                        .parallelStream()
                        .anyMatch(u -> u.getTime().getHour() == slotHour
                                && u.getReferId() == branchId
                                && u.getCalendarId() == calendarId);

                // Get all available managers at this branch that have all the needed skills for a specific time
                Supplier<Stream<Manager>> availableManagers = () -> managers.parallelStream()
                        .filter(m -> m.getBranchId() == branchId // They must be at this branch
                                && (managerUnavailables // There can't be an unavailable for that time
                                .parallelStream()
                                .noneMatch(u -> u.getReferId() == m.getId()
                                        && u.getTime().getHour() == slotHour
                                        && u.getCalendarId() == calendarId))
                                && Arrays.stream(serviceIds) // They must have all of the serviceIds
                                .allMatch(service -> skills.parallelStream()
                                        .anyMatch(skill -> skill.getServiceId() == service
                                                && skill.getManagerId() == m.getId())));

                // Check if there is already an appointment scheduled and no other manager has service
                boolean taken = appointments
                        .parallelStream()
                        .filter(a -> a.getCalendarId() == calendarId
                                && a.getTime().getHour() == slotHour
                                && a.getBranchId() == branchId)
                        .count() >= availableManagers.get() // The count of appointments is equal to count of managers with that service
                        .count();

                // Check if there is a manager able to provide service
                boolean serviceUnavailable = !availableManagers.get()
                        .findAny()
                        .isPresent();

                // Check if the time slot has already passed for the current day
                taken = taken || ((slotHour <= currentTime.getHour() + 1) && (calendarId == todayCalendarId));

                // Get day and month string names
                String dayName = DateUtil.capitalize(DayOfWeek.of(dayOfWeek).name().toLowerCase());
                String monthName = DateUtil.capitalize(calendar.get(calendarId - 1).getDate().getMonth().name().toLowerCase());

                String timeString = DateUtil.hourToHumanString(slotHour);

                // Add the appointmentSlot if it is available
                if (!branchUnavailable && !serviceUnavailable) {
                    appointmentSlots.add(new AppointmentSlot(calendarId, dayName, DateUtil.ordinal(calendar.get(calendarId - 1).getDate().getDayOfMonth()), monthName, timeString, taken));
                }
            }
        }

        return appointmentSlots;
    }
}
