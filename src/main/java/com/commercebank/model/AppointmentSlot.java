package com.commercebank.model;

// Basic object with getters and setters
public class AppointmentSlot {
    private int calendarId;
    private String day;
    private String date;
    private String month;
    private String time;
    private boolean taken;

    public AppointmentSlot(int calendarId, String day, String date, String month, String time, boolean taken) {
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) { this.month = month; }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Boolean getTaken() {return taken; }

    public void setTaken(Boolean taken) {this.taken = taken; }

    @Override
    public String toString() {
        return "AppointmentSlot{" +
                "day='" + day + '\'' +
                ", date='" + date + '\'' +
                ", month='" + month + '\'' +
                ", time='" + time + '\'' +
                ", taken=" + taken +
                '}';
    }
}
