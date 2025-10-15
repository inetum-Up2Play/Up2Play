package com.Up2Play.backend.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Servicio para enviar correos electrónicos simples usando Spring Mail.
 * Utiliza JavaMailSender para el envío asíncrono o síncrono de mensajes.
 */
@Service
public class EmailService {

    // Dependencia inyectada para el envío de emails
    private final JavaMailSender emailSender;

    /**
     * Constructor que inyecta el JavaMailSender configurado (ej: via application.properties).
     */
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    /**
     * Envía un correo electrónico simple al destinatario especificado.
     * @param to Email del destinatario.
     * @param subject Asunto del correo.
     * @param body Contenido del mensaje.
     */
    public void enviarCorreo(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("up2play1@gmail.com");  // Remitente fijo (configurable via properties)
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        emailSender.send(message);  // Envía el mensaje
    }
}
