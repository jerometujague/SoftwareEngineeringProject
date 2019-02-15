package com.commercebank.model;

import org.apache.tomcat.jni.Local;

import java.time.LocalTime;

// Basic object with getters and setters that matches the database row
public class BranchHours {
    private int id;
    private LocalTime openTime;
    private LocalTime closeTime;
    private Integer branchId;
    private Integer dayOfWeek;

    public BranchHours(int id, LocalTime openTime, LocalTime closeTime, Integer branchId, Integer dayOfWeek) {
        this.id = id;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.branchId = branchId;
        this.dayOfWeek = dayOfWeek;
    }

    public int getId() {
        return id;
    }

    public LocalTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalTime openTime) {
        this.openTime = openTime;
    }

    public LocalTime getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(LocalTime closeTime) {
        this.closeTime = closeTime;
    }

    public Integer getBranchId() {
        return branchId;
    }

    public void setBranchId(Integer branchId) {
        this.branchId = branchId;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
}
