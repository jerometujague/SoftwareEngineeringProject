package com.commercebank.api;

import org.junit.Test;

import static org.junit.Assert.*;

public class BranchTest {

    Branch someBranch = new Branch(3,"123 Main St.");

    @Test
    public void testGetID() {
        assertEquals(3, someBranch.getId());
    }
}