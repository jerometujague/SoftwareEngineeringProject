package com.commercebank.controller;

import com.commercebank.model.AppointmentSlot;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

// @RestController means Spring will automatically create and manager and instance of this class
@RestController // Make this class a REST controller that accept HTTP requests
@RequestMapping(value = "/api/appointment-slots") // Map any HTTP requests at this url to this class
public class AppointmentSlotController {

    AppointmentSlot apptSlot = new AppointmentSlot(5, "Monday", "20", "February", "3:00 pm", true);

    @RequestMapping(method = RequestMethod.GET) // This method will be called when there is a GET request made to this url
    String appt() { return apptSlot.toString();}
}
