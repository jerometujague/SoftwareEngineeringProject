package com.commercebank.mail;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;


public class SmtpMailSender implements MailSender{

    private JavaMailSender javaMailSender;

    public SmtpMailSender(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void send(String to, String cc, String subject, String body) throws MessagingException {

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;

        helper = new MimeMessageHelper(message, true);  //true indicates multipart message
        helper.setSubject(subject);
        helper.setTo(to);
        helper.setText(body, true);     //true indicates html
        helper.setFrom("UCM SE3910 Project <seclassproject@gmail.com>");
        helper.setCc(cc);

        // continue using helper for more functionalities like adding attachments, etc.

        javaMailSender.send(message);
    }

}
