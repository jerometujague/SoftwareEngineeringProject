package com.commercebank.controller;

import com.commercebank.dao.CalendarDAO;
import com.commercebank.model.Calendar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/calendar")
public class CalendarController {
    // Dependencies
    private final CalendarDAO calendarDAO;

    @Autowired
    public CalendarController(CalendarDAO calendarDAO) {
        this.calendarDAO = calendarDAO;
    }

    @RequestMapping(method = RequestMethod.GET)
    List<Calendar> getCalendar() { return calendarDAO.list(); }
}
