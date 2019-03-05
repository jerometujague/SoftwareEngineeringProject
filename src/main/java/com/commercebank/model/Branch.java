package com.commercebank.model;

// Basic object with getters and setters that matches the database row
public class Branch {
    private int id;
    private String streetAddress;
    private String city;
    private String state;
    private int zipCode;
    private String name;
    private boolean hasService;
    private int appointmentCount;

    public Branch(int id, String streetAddress, String city, String state, int zipCode, String name) {
        this.id = id;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.name = name;
        this.hasService = false;
        this.appointmentCount = 0;
    }

    public int getId() {
        return id;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getZipCode() {
        return zipCode;
    }

    public void setZipCode(int zipCode) {
        this.zipCode = zipCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isHasService() {
        return hasService;
    }

    public void setHasService(boolean hasService) {
        this.hasService = hasService;
    }

    public int getAppointmentCount() {
        return appointmentCount;
    }

    public void setAppointmentCount(int appointmentCount) {
        this.appointmentCount = appointmentCount;
    }

    @Override
    public String toString() {
        return "Branch{" +
                "id=" + id +
                ", streetAddress='" + streetAddress + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", zipCode=" + zipCode +
                ", name='" + name + '\'' +
                ", hasService=" + hasService +
                ", appointmentCount=" + appointmentCount +
                '}';
    }
}
