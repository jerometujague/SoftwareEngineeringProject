package com.commercebank.model;

// Basic object with getters and setters that matches the database row
public class Manager {
    private int id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private int branchId;

    public Manager(int id, String firstName, String lastName, String phoneNumber, String email, int branchId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.branchId = branchId;
    }

    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getBranchId() {
        return branchId;
    }

    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }
}
