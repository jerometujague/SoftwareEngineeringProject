package com.commercebank.mail;
import javax.mail.MessagingException;


public interface MailSender {

    void send(String to, String cc, String subject, String body, String attach) throws MessagingException;

    void send(String to, String cc, String subject, String body) throws MessagingException;

}
