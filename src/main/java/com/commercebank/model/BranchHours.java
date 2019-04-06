package com.commercebank.model;

import java.time.LocalTime;

// Basic object with getters and setters that matches the database row
public class BranchHours {
    private int id;
    private LocalTime openTime;
    private LocalTime closeTime;
    private int branchId;
    private int dayOfWeek;

    public BranchHours(int id, LocalTime openTime, LocalTime closeTime, int branchId, int dayOfWeek) {
        this.id = id;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.branchId = branchId;
        this.dayOfWeek = dayOfWeek;
    }

    // Default constructor used when a post request is made
    public BranchHours() { }

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

    public int getBranchId() {
        return branchId;
    }

    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }

    public int getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(int dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
}
