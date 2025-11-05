package com.Up2Play.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

// DTO para datos de login de usuario: email y contraseña.
public class LoginUserDto {
    
    private String email;

    @JsonProperty("password")
    private String password;

    //Getters i Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
