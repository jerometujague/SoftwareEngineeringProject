package com.commercebank.model;

// Basic object with getters and setters
public class AppointmentSlot {
    private int calendarId;
    private String day;
    private int date;
    private String month;
    private int time;
    private boolean taken;

    public AppointmentSlot(int calendarId, String day, int date, String month, int time, boolean taken) {
        this.calendarId = calendarId;
        this.day = day;
        this.date = date;
        this.month = month;
        this.time = time;
        this.taken = taken;
    }

    public int getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(int calendarId) {
        this.calendarId = calendarId;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) { this.day = day; }

    public int getDate() {
        return date;
    }

    public void setDate(int date) {
        this.date = date;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) { this.month = month; }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public Boolean getTaken() {return taken; }

    public void setTaken(Boolean taken) {this.taken = taken; }
}
