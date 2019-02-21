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

    // Dependencies
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

        // Add managers at branch 1
        managers.add(new Manager(1,"John", "Doe", "1234", "email", 1));
        managers.add(new Manager(2,"John", "Doe", "1234", "email", 1));
        managers.add(new Manager(3,"John", "Doe", "1234", "email", 1));
        managers.add(new Manager(4,"John", "Doe", "1234", "email", 2));
        managers.add(new Manager(5,"John", "Doe", "1234", "email", 2));
    }

    @Test
    public void testBranchNotOpen(){
        skills.add(new Skill(1, 1));

        boolean closedDay = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .anyMatch(a -> a.getCalendarId() == calendarId + 1 && a.getTime().equals("12:00 PM"));

        boolean closedHour = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .anyMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("7:00 AM"));

        assertFalse(closedDay);
        assertFalse(closedHour);

        skills.clear();
    }

    @Test
    public void noManagerHasSkill(){
        boolean unavailable = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 AM"));

        assertTrue(unavailable);
    }

    @Test
    public void testAppointmentMakesTakenFalse(){
        skills.add(new Skill(1, 1));

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
        skills.clear();
    }

    @Test
    public void testBranchUnavailableBlocksSlot(){
        skills.add(new Skill(1, 1));

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
        skills.clear();
    }

    @Test
    public void testManagerUnavailableBlocksSlot_HasNeededSkill(){
        skills.add(new Skill(1, 1));

        boolean isUnavailableBefore = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        // Add a manager unavailable for manager 1
        managerUnavailables.add(new Unavailable(1, calendarId, LocalTime.of(12, 0), 1));

        boolean isUnavailableAfter = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        assertFalse(isUnavailableBefore);
        assertTrue(isUnavailableAfter);

        // Reset managerUnavailables list
        managerUnavailables.clear();
        skills.clear();
    }

    @Test
    public void testManagerUnavailableBlocksSlot_DoesNotHaveNeededSkill(){
        skills.add(new Skill(1, 1));
        skills.add(new Skill(2, 2));

        boolean isUnavailableBefore = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        // Add a manager unavailable for manager 2
        managerUnavailables.add(new Unavailable(1, calendarId, LocalTime.of(12, 0), 2));

        boolean isUnavailableAfter = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        assertFalse(isUnavailableBefore);
        assertFalse(isUnavailableAfter);

        // Reset managerUnavailables list
        managerUnavailables.clear();
        skills.clear();
    }

    @Test
    public void testManagerUnavailableBlocksSlot_AnotherManagerHasSkill(){
        skills.add(new Skill(1, 1));
        skills.add(new Skill(2, 2));
        skills.add(new Skill(3, 1));

        boolean isUnavailableBefore = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        // Add a manager unavailable for manager 2
        managerUnavailables.add(new Unavailable(1, calendarId, LocalTime.of(12, 0), 2));

        boolean isUnavailableAfter = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        assertFalse(isUnavailableBefore);
        assertFalse(isUnavailableAfter);

        // Reset managerUnavailables list
        managerUnavailables.clear();
        skills.clear();
    }

    @Test
    public void testManagerUnavailableBlocksSlot_TwoManagersAreUnavailable(){
        skills.add(new Skill(1, 1));
        skills.add(new Skill(2, 1));

        boolean isUnavailableBefore = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        // Add a manager unavailable for manager 2
        managerUnavailables.add(new Unavailable(1, calendarId, LocalTime.of(12, 0), 1));
        managerUnavailables.add(new Unavailable(1, calendarId, LocalTime.of(12, 0), 2));

        boolean isUnavailableAfter = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        assertFalse(isUnavailableBefore);
        assertTrue(isUnavailableAfter);

        // Reset managerUnavailables list
        managerUnavailables.clear();
        skills.clear();
    }

    @Test
    public void testManagerUnavailableBlocksSlot_DifferentHour(){
        skills.add(new Skill(1, 1));

        boolean isUnavailableBefore = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        // Add a manager unavailable for manager 2
        managerUnavailables.add(new Unavailable(1, calendarId, LocalTime.of(13, 0), 1));

        boolean isUnavailableAfter = appointmentSlotController.getAppointmentSlots(1, 1)
                .stream()
                .noneMatch(a -> a.getCalendarId() == calendarId && a.getTime().equals("12:00 PM"));

        assertFalse(isUnavailableBefore);
        assertFalse(isUnavailableAfter);

        // Reset managerUnavailables list
        managerUnavailables.clear();
        skills.clear();
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
