package com.commercebank.api;

import java.util.Date;

public class Appointment {
    private int id;
    private Date date;
    private int branchId;
    private int managerId;
    private int customerId;

    public Appointment(int id, Date date, int branchId, int managerId, int customerId) {
        this.id = id;
        this.date = date;
        this.branchId = branchId;
        this.managerId = managerId;
        this.customerId = customerId;
    }

    public int getId() {
        return id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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
