package com.commercebank.controller;

import com.commercebank.mail.MailSender;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;

@RestController
public class MailController {

    private MailSender mailSender;

    public MailController(MailSender smtp) {

        this.mailSender = smtp;
    }


    @RequestMapping("/mail")
    public String mail() throws MessagingException {

        mailSender.send("dbruce@ucmo.edu", "A test mail", "Body of the test mail");
        return "Mail sent";
    }
}
