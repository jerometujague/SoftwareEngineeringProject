package com.commercebank.model;

import java.sql.Time;

// Basic object with getters and setters that matches the database row
public class AppointmentTime {
    private int id;
    private Time time;

    public AppointmentTime(int id, Time time) {
        this.id = id;
        this.time = time;
    }

    public int getId() {
        return id;
    }

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
    }
}
