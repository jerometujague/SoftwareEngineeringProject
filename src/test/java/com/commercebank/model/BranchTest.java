package com.commercebank.model;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.*;
@RunWith(SpringRunner.class)
@SpringBootTest
                                    // This class only tests the Branch class
public class BranchTest {

                                    // Create an instance of the Branch object
    Branch someBranch = new Branch(3,"123 Main St.", "Warrensburg", "Missouri", 64093, "Best Branch");

    @Test                           // Create a test method for the getID method
    public void testGetID() {

                                    /* This test makes the assertion that the ID for someBranch
                                     * should be equal to 3. When the test is run, the test will be
                                     * passed if someBranch.getID() returns a value of 3. */
        assertEquals(3, someBranch.getId());
    }
}