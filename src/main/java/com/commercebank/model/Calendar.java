package com.commercebank.model;

import java.time.LocalDate;

// Basic object with getters and setters that matches the database row
public class Calendar {
    private int calendarId;
    private LocalDate date;
    private boolean isHoliday;

    public Calendar(int calendarId, LocalDate date, boolean isHoliday) {
        this.calendarId = calendarId;
        this.date = date;
        this.isHoliday = isHoliday;
    }

    public int getCalendarId() {
        return calendarId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isHoliday() {
        return isHoliday;
    }

    public void setHoliday(boolean holiday) {
        isHoliday = holiday;
    }
}
