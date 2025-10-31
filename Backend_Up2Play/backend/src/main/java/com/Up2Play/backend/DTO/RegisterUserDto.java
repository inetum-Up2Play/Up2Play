package com.Up2Play.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

// DTO para datos de registro de nuevo usuario: email, contraseña y nombre de usuario.
public class RegisterUserDto {
    
    private String email;
    
    @JsonProperty("password")
    private String password;
    
    @JsonProperty("nombre_usuario")
    private String nombre_usuario;

    //Getters y Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContraseña() {
        return password;
    }

    public void setContraseña(String password) {
        this.password = password;
    }

    public String getNombre_usuario() {
        return nombre_usuario;
    }

    public void setNombre_usuario(String nombre_usuario) {
        this.nombre_usuario = nombre_usuario;
    }

}
