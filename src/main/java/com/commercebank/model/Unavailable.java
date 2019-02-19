package com.commercebank.model;

import java.time.LocalTime;

// Basic object with getters and setters that match the database rows
// ReferId is either a branchId or a managerId, depending on which function is called
public class Unavailable {
    private int id;
    private int calendarId;
    private LocalTime time;
    private int referId;

    public Unavailable(int id, int calendarId, LocalTime time, int referId) {
        this.id = id;
        this.calendarId = calendarId;
        this.time = time;
        this.referId = referId;
    }

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

    public int getReferId() {
        return referId;
    }

    public void setReferId(int referId) {
        this.referId = referId;
    }
}
