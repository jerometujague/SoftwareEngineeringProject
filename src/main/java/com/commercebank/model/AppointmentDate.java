package com.commercebank.model;


import java.sql.Date;

// Basic object with getters and setters that matches the database row
public class AppointmentDate {
    private int id;
    private Date date;

    public AppointmentDate(int id, Date date) {
        this.id = id;
        this.date = date;
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
}
