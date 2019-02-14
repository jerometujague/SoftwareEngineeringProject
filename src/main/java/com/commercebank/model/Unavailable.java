package com.commercebank.model;

import org.apache.tomcat.jni.Local;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

// Basic object with getters and setters that match the database rows
public class Unavailable {
    private int id;
    private LocalDate date;
    private LocalTime time;
    private Integer branchId;
    private Integer managerId;
    private Integer serviceId;
    private Integer dayOfWeek;

    public Unavailable(int id, LocalDate date, LocalTime time, Integer branchId, Integer managerId, Integer serviceId, Integer dayOfWeek) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.branchId = branchId;
        this.managerId = managerId;
        this.serviceId = serviceId;
        this.dayOfWeek = dayOfWeek;
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

    public Integer getBranchId() {
        return branchId;
    }

    public void setBranchId(Integer branchId) {
        this.branchId = branchId;
    }

    public Integer getManagerId() { return managerId; }

    public void setManagerId(Integer managerId) { this.managerId = managerId; }

    public Integer getServiceId() { return serviceId; }

    public void setServiceId(Integer serviceId) { this.serviceId = serviceId; }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
}
