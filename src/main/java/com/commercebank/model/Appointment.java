package com.commercebank.model;

import org.apache.tomcat.jni.Local;

import java.time.LocalTime;

// Basic object with getters and setters that matches the database row
public class Appointment {
    private int id;
    private int dateId;
    private LocalTime timeId;
    private int branchId;
    private int managerId;
    private int customerId;

    public Appointment(int id, int dateId, LocalTime timeId, int branchId, int managerId, int customerId) {
        this.id = id;
        this.dateId = dateId;
        this.timeId = timeId;
        this.branchId = branchId;
        this.managerId = managerId;
        this.customerId = customerId;
    }

    public int getId() {
        return id;
    }

    public int getDateId() {
        return dateId;
    }

    public void setDateId(int dateId) {
        this.dateId = dateId;
    }

    public LocalTime getTimeId() {
        return timeId;
    }

    public void setTimeId(LocalTime timeId) {
        this.timeId = timeId;
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
}
