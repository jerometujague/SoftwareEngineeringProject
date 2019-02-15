package com.commercebank.model;

import java.time.LocalDate;
import java.time.LocalTime;

// Basic object with getters and setters that match the database rows
public class Unavailable {
    private int id;
    private LocalDate date;
    private LocalTime time;

    public Unavailable(int id, LocalDate date, LocalTime time) {
        this.id = id;
        this.date = date;
        this.time = time;
    }

    public int getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }
}
