package com.commercebank;

import com.commercebank.controller.AppointmentSlotController;
import com.commercebank.dao.*;
import com.commercebank.model.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AppointmentSlotControllerTests {

    private BranchHoursDAO branchHoursDAO;
    private UnavailableDAO unavailableDAO;
    private AppointmentDAO appointmentDAO;
    private SkillDAO skillDAO;
    private ManagerDAO managerDAO;

    @Autowired
    private CalendarDAO calendarDAO;

    @Autowired
    private ServiceDAO serviceDAO;

    private AppointmentSlotController appointmentSlotController;

    private List<BranchHours> branchHours = new ArrayList<>();
    private List<Unavailable> managerUnavailables = new ArrayList<>();
    private List<Unavailable> branchUnavailables = new ArrayList<>();
    private List<Appointment> appointments = new ArrayList<>();
    private List<Skill> skills = new ArrayList<>();
    private List<Manager> managers = new ArrayList<>();

    private int calendarId;

    @Before
    @Autowired
    public void initDataAccess() {
        this.branchHoursDAO = mock(BranchHoursDAO.class);
        this.unavailableDAO = mock(UnavailableDAO.class);
        this.appointmentDAO = mock(AppointmentDAO.class);
        this.skillDAO = mock(SkillDAO.class);
        this.managerDAO = mock(ManagerDAO.class);

        calendarId = getNextDay();

        when(unavailableDAO.listBranches()).thenReturn(branchUnavailables);
        when(unavailableDAO.listManagers()).thenReturn(managerUnavailables);
        when(appointmentDAO.list()).thenReturn(appointments);
        when(skillDAO.list()).thenReturn(skills);
        when(managerDAO.list()).thenReturn(managers);
        when(branchHoursDAO.list()).thenReturn(branchHours);

        appointmentSlotController = new AppointmentSlotController(
                branchHoursDAO,
                unavailableDAO,
                appointmentDAO,
                calendarDAO,
                serviceDAO,
                skillDAO,
                managerDAO);
    }

    @Before
    public void initTestData(){
        // Add branch hours: 9-5 on Mondays for branch 1
        branchHours.add(new BranchHours(1, LocalTime.of(9, 0), LocalTime.of(17, 0), 1, 1));

        // Add a manager at branch 1
        managers.add(new Manager(1,"John", "Doe", "1234", "email", 1));

        // Add a skill: manager 1 can do service 1
        skills.add(new Skill(1, 1));
    }

    @Test
    public void testAppointmentMakesTakenFalse(){
        boolean isTakenBefore = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .filter(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"))
                .findFirst()
                .get()
                .getTaken();

        appointments.add(new Appointment(1, calendarId, LocalTime.of(12, 0), 1, 1, 1));

        boolean isTakenAfter = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .filter(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"))
                .findFirst()
                .get()
                .getTaken();

        assertFalse(isTakenBefore);
        assertTrue(isTakenAfter);

        // Reset appointments list
        appointments.clear();
    }

    @Test
    public void testBranchUnavailableBlocksSlot(){
        boolean isUnavailableBefore = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        // Add a branch unavailable for branch 1
        branchUnavailables.add(new Unavailable(1, calendarId, LocalTime.of(12, 0), 1));

        boolean isUnavailableAfter = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        assertFalse(isUnavailableBefore);
        assertTrue(isUnavailableAfter);

        // Reset branchUnavailables list
        branchUnavailables.clear();
    }

    public int getNextDay(){
        // Get id of next day
        return calendarDAO.list()
                .stream()
                .filter(c -> c.getDate().isAfter(LocalDate.now())
                        && c.getDate().getDayOfWeek().getValue() == 1)
                .findFirst()
                .get()
                .getCalendarId();
    }
}
