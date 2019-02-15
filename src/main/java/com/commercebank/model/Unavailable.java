package com.commercebank.model;

import java.time.LocalTime;

// Basic object with getters and setters that match the database rows
public class Unavailable {
    private int id;
    private int dateId;
    private LocalTime time;

    public Unavailable(int id, int dateId, LocalTime time) {
        this.id = id;
        this.dateId = dateId;
        this.time = time;
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

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }
}
