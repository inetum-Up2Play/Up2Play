package com.Up2Play.backend.Config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

//Configuración de envío de correos electrónicos usando el servicio de Gmail.
@Configuration
public class EmailConfiguration {

    //Email que se usará para enviar los correo, inyectado de archivo application.properties
    @Value("${spring.mail.username}")
    private String emailUsername;

    //Contraseña para envisr correos, inyectado de archivo application.properties 
    @Value("${spring.mail.password}")
    private String emailPassword;

    // Función que crea y configura el sistema de envío de correos. Usa el servidor SMTP de Gmail.
    @Bean
    public JavaMailSender javaMailSender() {

        //Configuración del servidor del correo de Gmail
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        //Indica cuenta de Gmail para enviar correos
        mailSender.setUsername(emailUsername);
        mailSender.setPassword(emailPassword);

        //Opciones adicionales
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        return mailSender;
    }
}
