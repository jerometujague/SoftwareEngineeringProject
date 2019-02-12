package com.commercebank.model;

// Basic object with getters and setters that matches the database row
public class Skills {
    private int managerId;
    private int serviceId;

    public Skills(int managerId, int serviceId) {
        this.managerId = managerId;
        this.serviceId = serviceId;
    }

    public int getManagerId() {
        return managerId;
    }

    public void setManagerId(int managerId) {
        this.managerId = managerId;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

}
