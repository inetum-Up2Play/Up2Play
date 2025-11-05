package com.Up2Play.backend.Service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

//Servicio para enviar correos electrónicos simples usando Spring Mail.
@Service
public class EmailService {

    // Dependencia inyectada para el envío de emails
    private final JavaMailSender emailSender;

    //Constructor que inyecta el JavaMailSender configurado (ej: via application.properties).
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    //Envía un correo electrónico simple al destinatario especificado.
    public void enviarCorreo(String to, String subject, String body) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        try {
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true indica que el contenido es HTML
            emailSender.send(message);
        } catch (Exception e) {
            // Manejo de excepciones (logging, reintentos, etc.)
            e.printStackTrace();
        }
    }
}
