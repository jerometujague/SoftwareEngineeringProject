package com.commercebank.model;

// Basic object with getters and setters that matches the database row
public class Service {
    private int id;
    private String service;

    public Service(int id, String service) {
        this.id = id;
        this.service = service;
    }

    public int getId() {
        return id;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }
}
