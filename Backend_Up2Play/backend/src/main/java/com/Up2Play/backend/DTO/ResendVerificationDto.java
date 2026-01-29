package com.Up2Play.backend.DTO;

public class ResendVerificationDto {

    private String email;

    public ResendVerificationDto(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
