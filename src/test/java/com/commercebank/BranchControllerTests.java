package com.commercebank;

import com.commercebank.controller.AppointmentSlotController;
import com.commercebank.controller.BranchController;
import com.commercebank.dao.*;
import com.commercebank.model.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BranchControllerTests {

    // Dependencies
    private SkillDAO skillDAO;
    private ManagerDAO managerDAO;

    @Autowired
    private BranchDAO branchDAO;

    @Autowired
    private AppointmentSlotController appointmentSlotController;

    private BranchController branchController;

    private List<Skill> skills = new ArrayList<>();
    private List<Manager> managers = new ArrayList<>();

    @Before
    @Autowired
    public void initDataAccess() {
        this.skillDAO = mock(SkillDAO.class);
        this.managerDAO = mock(ManagerDAO.class);

        when(skillDAO.list()).thenReturn(skills);
        when(managerDAO.list()).thenReturn(managers);

        branchController = new BranchController(branchDAO, skillDAO, managerDAO, appointmentSlotController);
    }

    @Before
    public void initTestData(){
        // Add managers at branch 1
        managers.add(new Manager(1,"John", "Doe", "1234", "email", 1));
        managers.add(new Manager(2,"John", "Doe", "1234", "email", 1));
        managers.add(new Manager(3,"John", "Doe", "1234", "email", 1));
        managers.add(new Manager(4,"John", "Doe", "1234", "email", 2));
        managers.add(new Manager(5,"John", "Doe", "1234", "email", 2));
    }

    @Test
    public void testBranchHasService(){
        // Manager 1 at branch 1 has service 1
        skills.add(new Skill(1, 1));

        // Manager 4 at branch 2 has service 2
        skills.add(new Skill(4, 2));

        boolean hasService1 = branchController.hasService(1, new int[]{1});
        boolean hasService2 = branchController.hasService(1, new int[]{2});

        assertTrue(hasService1);
        assertFalse(hasService2);

        // Clear the skills
        skills.clear();
    }

    @Test
    public void testGetBranchesWithService(){
        // Manager 1 at branch 1 has service 1
        skills.add(new Skill(1, 1));

        // Manager 4 at branch 2 has service 2
        skills.add(new Skill(4, 2));

        boolean branch1hasService1 = branchController.getBranches(new int[]{1})
                .stream()
                .filter(b -> b.getId() == 1)
                .findFirst()
                .get()
                .isHasService();

        boolean branch1hasService2 = branchController.getBranches(new int[]{2})
                .stream()
                .filter(b -> b.getId() == 1)
                .findFirst()
                .get()
                .isHasService();

        boolean branch2hasService1 = branchController.getBranches(new int[]{1})
                .stream()
                .filter(b -> b.getId() == 2)
                .findFirst()
                .get()
                .isHasService();

        boolean branch2hasService2 = branchController.getBranches(new int[]{2})
                .stream()
                .filter(b -> b.getId() == 2)
                .findFirst()
                .get()
                .isHasService();

        assertTrue(branch1hasService1);
        assertFalse(branch1hasService2);
        assertFalse(branch2hasService1);
        assertTrue(branch2hasService2);

        // Clear the skills
        skills.clear();
    }

    @Test
    public void testGetBranchesWithService_MultipleSkills(){
        // Manager 1 at branch 1 has service 1 and 2
        skills.add(new Skill(1, 1));
        skills.add(new Skill(1, 2));

        // Manager 4 at branch 2 has service 1
        skills.add(new Skill(4, 1));
        skills.add(new Skill(4, 3));

        boolean branch1hasService1and2 = branchController.getBranches(new int[]{1, 2})
                .stream()
                .filter(b -> b.getId() == 1)
                .findFirst()
                .get()
                .isHasService();

        boolean branch2hasService1and2 = branchController.getBranches(new int[]{1, 2})
                .stream()
                .filter(b -> b.getId() == 2)
                .findFirst()
                .get()
                .isHasService();

        assertTrue(branch1hasService1and2);
        assertFalse(branch2hasService1and2);

        // Clear the skills
        skills.clear();
    }

    @Test
    public void testGetBranchesWithService_MultipleSkillsSameManager(){
        // Manager 1 at branch 1 has service 1 and 2
        skills.add(new Skill(1, 1));
        skills.add(new Skill(2, 2));
        skills.add(new Skill(1, 3));
        skills.add(new Skill(1, 4));
        skills.add(new Skill(2, 4));

        boolean hasService1and3 = branchController.getBranches(new int[]{1, 3})
                .stream()
                .filter(b -> b.getId() == 1)
                .findFirst()
                .get()
                .isHasService();

        boolean hasService1and2 = branchController.getBranches(new int[]{1, 2})
                .stream()
                .filter(b -> b.getId() == 1)
                .findFirst()
                .get()
                .isHasService();

        boolean hasService2and4 = branchController.getBranches(new int[]{2, 4})
                .stream()
                .filter(b -> b.getId() == 1)
                .findFirst()
                .get()
                .isHasService();

        assertTrue(hasService1and3);
        assertFalse(hasService1and2);
        assertTrue(hasService2and4);

        // Clear the skills
        skills.clear();
    }
}
