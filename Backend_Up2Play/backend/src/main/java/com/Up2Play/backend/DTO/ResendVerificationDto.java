package com.Up2Play.backend.DTO;

public class ResendVerificationDto {

    private String email;

    //Contructor
    public ResendVerificationDto(String email) {
        this.email = email;
    }

    //Getters y Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
