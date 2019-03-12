package com.commercebank.controller;

import com.commercebank.dao.*;
import com.commercebank.model.*;
import com.commercebank.util.DateUtil;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
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

    @RequestMapping(value = "/{branchId}", method = RequestMethod.POST)
    public List<AppointmentSlot> getAppointmentSlots(@PathVariable("branchId") int branchId, @RequestBody int[] serviceIds){
        List<AppointmentSlot> appointmentSlots = new ArrayList<>();

        // Get data at the beginning to save time
        List<Calendar> calendar = calendarDAO.list();
        List<Appointment> appointments = appointmentDAO.list();
        List<Manager> managers = managerDAO.list();
        List<Skill> skills = skillDAO.list();
        List<Unavailable> managerUnavailables = unavailableDAO.listManagers();
        List<Unavailable> branchUnavailables = unavailableDAO.listBranches();
        List<BranchHours> branchHours = branchHoursDAO.list();

        // Get today's day and calendarId
        int startId = calendar
                .parallelStream()
                .filter(c -> c.getDate().isAfter(LocalDate.now()))
                .findFirst()
                .get()
                .getCalendarId();

        // Go through the calendar dates for the next two weeks
        for(int i = startId; i < startId + 14; i++){
            final int calendarId = i;

            // Get the day of week int from the current day
            int dayOfWeek = calendar.get(i - 1)
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
                // Loop from start hour to close hour
                for (int hour = hours.get().getOpenTime().getHour(); hour < hours.get().getCloseTime().getHour(); hour++) {
                    final int slotHour = hour;

                    // Check if this time slot is unavailable at this branch
                    boolean branchUnavailable = branchUnavailables
                            .parallelStream()
                            .anyMatch(u -> u.getTime().getHour() == slotHour
                                    && u.getReferId() == branchId
                                    && u.getCalendarId() == calendarId);

                    // Get all skills available at this branch at this time and day
                    Supplier<Stream<Skill>> availableSkills = () -> skills
                            .parallelStream()
                            .filter(s -> managers // A manager must have the skill
                                    .parallelStream()
                                    .anyMatch(m -> s.getManagerId() == m.getId() // Only get skills for specific branch
                                            && m.getBranchId() == branchId
                                            && (managerUnavailables // There can't be an unavailable for that time
                                            .parallelStream()
                                            .noneMatch(u -> u.getReferId() == m.getId()
                                                    && u.getTime().getHour() == slotHour
                                                    && u.getCalendarId() == calendarId))));

                    // Check if there is already an appointment scheduled and no other manager has service
                    boolean taken = appointments
                            .parallelStream()
                            .filter(a -> a.getCalendarId() == calendarId
                                    && a.getTime().getHour() == slotHour
                                    && a.getBranchId() == branchId)
                            .count() >= availableSkills.get() // The count of appointments is equal to count of managers with that service
                            .filter(s -> s.getServiceId() == serviceIds[0])
                            .count();

                    // Check if the service is unavailable
                    boolean serviceUnavailable = availableSkills.get()
                            .noneMatch(s -> s.getServiceId() == serviceIds[0]);

                    // Get day and month string names
                    String dayName = DateUtil.capitalize(DayOfWeek.of(dayOfWeek).name().toLowerCase());
                    String monthName = DateUtil.capitalize(calendar.get(i - 1).getDate().getMonth().name().toLowerCase());

                    String timeString = DateUtil.hourToHumanString(slotHour);

                    // Add the appointmentSlot if it is available
                    if (!branchUnavailable && !serviceUnavailable) {
                        appointmentSlots.add(new AppointmentSlot(i, dayName, DateUtil.ordinal(calendar.get(i - 1).getDate().getDayOfMonth()), monthName, timeString, taken));
                    }
                }
            }
        }
        
        return appointmentSlots;
    }
}
