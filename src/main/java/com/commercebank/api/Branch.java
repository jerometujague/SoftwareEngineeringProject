package com.commercebank.api;

// Basic object with getters and setters that matches the database row
public class Branch {
    private int id;
    private String address;

    public Branch(int id, String address) {
        this.id = id;
        this.address = address;
    }

    public int getId() {
        return id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
