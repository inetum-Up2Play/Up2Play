package com.Up2Play.backend.Config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * Configuración para el envío de emails usando Spring Mail con SMTP de Gmail.
 * Define un bean para JavaMailSender que utiliza credenciales desde properties.
 */
@Configuration
public class EmailConfiguration {

    /**
     * Usuario (email) para autenticación SMTP, inyectado desde
     * application.properties.
     */
    @Value("${spring.mail.username}")
    private String emailUsername;

    /**
     * Contraseña para autenticación SMTP, inyectado desde application.properties.
     * Nota: Para Gmail, usa una contraseña de app si 2FA está activado.
     */
    @Value("${spring.mail.password}")
    private String emailPassword;

    /**
     * Bean para JavaMailSender: configura conexión SMTP a Gmail con TLS y
     * autenticación.
     * Utiliza puerto 587 para envío seguro de emails (ej. notificaciones, resets de
     * contraseña).
     * 
     * @return Instancia configurada de JavaMailSenderImpl.
     */
    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername(emailUsername);
        mailSender.setPassword(emailPassword);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        return mailSender;
    }
}
