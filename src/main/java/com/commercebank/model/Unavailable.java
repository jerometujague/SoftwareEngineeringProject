package com.commercebank.model;

// Basic object with getters and setters that matches the database row
public class Unavailable {
    private int id;
    private int dateId;
    private int timeId;
    private int branchId;
    private int managerId;
    private int serviceId;

    public Unavailable(int id, int dateId, int timeId, int branchId, int managerId, int serviceId) {
        this.id = id;
        this.dateId = dateId;
        this.timeId = timeId;
        this.branchId = branchId;
        this.managerId = managerId;
        this.serviceId = serviceId;
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

    public int getTimeId() {
        return timeId;
    }

    public void setTimeId(int timeId) {
        this.timeId = timeId;
    }

    public int getBranchId() {
        return branchId;
    }

    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }

    public int getManagerId() { return managerId; }

    public void setManagerId(int managerId) { this.managerId = managerId; }

    public int getServiceId() { return serviceId; }

    public void setServiceId(int serviceId) { this.serviceId = serviceId; }
}
