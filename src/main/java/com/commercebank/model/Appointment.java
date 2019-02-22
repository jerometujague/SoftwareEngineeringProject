package com.commercebank.model;

import java.time.LocalTime;

// Basic object with getters and setters that matches the database row
public class Appointment {
    private int id;
    private int calendarId;
    private LocalTime time;
    private int branchId;
    private int managerId;
    private int customerId;
    private int serviceId;

    public Appointment(int id, int calendarId, LocalTime time, int branchId, int managerId, int customerId, int serviceId) {
        this.id = id;
        this.calendarId = calendarId;
        this.time = time;
        this.branchId = branchId;
        this.managerId = managerId;
        this.customerId = customerId;
        this.serviceId = serviceId;
    }

    // Default constructor used when a post request is made
    public Appointment() { }

    public int getId() {
        return id;
    }

    public int getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(int calendarId) {
        this.calendarId = calendarId;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public int getBranchId() {
        return branchId;
    }

    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }

    public int getManagerId() {
        return managerId;
    }

    public void setManagerId(int managerId) {
        this.managerId = managerId;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "id=" + id +
                ", calendarId=" + calendarId +
                ", time=" + time +
                ", branchId=" + branchId +
                ", managerId=" + managerId +
                ", customerId=" + customerId +
                ", serviceId=" + serviceId +
                '}';
    }
}
