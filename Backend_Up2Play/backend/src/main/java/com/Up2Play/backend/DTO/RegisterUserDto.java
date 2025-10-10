package com.Up2Play.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para datos de registro de nuevo usuario: email, contraseña y nombre de
 * usuario.
 * Utilizado en endpoints de registro para recibir datos desde el frontend.
 * 
 * @JsonProperty mapea campos para compatibilidad con JSON (ej. en español).
 */
public class RegisterUserDto {
    /**
     * Email del usuario para registro.
     */
    private String email;
    /**
     * Contraseña del usuario para registro.
     * Mapeado como "contraseña" en JSON para legibilidad en requests.
     */
    @JsonProperty("password")
    private String password;
    /**
     * Nombre de usuario para registro.
     * Mapeado como "nombre_usuario" en JSON.
     */
    @JsonProperty("nombre_usuario")
    private String nombre_usuario;

    /**
     * Getter para email.
     * 
     * @return Email del usuario.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Setter para email.
     * 
     * @param email Email a establecer.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Getter para contraseña.
     * 
     * @return Contraseña del usuario.
     */
    public String getContraseña() {
        return password;
    }

    /**
     * Setter para contraseña.
     * 
     * @param contraseña Contraseña a establecer.
     */
    public void setContraseña(String password) {
        this.password = password;
    }

    /**
     * Getter para nombre de usuario.
     * 
     * @return Nombre de usuario.
     */
    public String getNombre_usuario() {
        return nombre_usuario;
    }

    /**
     * Setter para nombre de usuario.
     * 
     * @param nombre_usuario Nombre a establecer.
     */
    public void setNombre_usuario(String nombre_usuario) {
        this.nombre_usuario = nombre_usuario;
    }

}
