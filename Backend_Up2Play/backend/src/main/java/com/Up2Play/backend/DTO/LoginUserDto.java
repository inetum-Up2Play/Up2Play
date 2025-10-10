package com.Up2Play.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para datos de login de usuario: email y contraseña.
 * Utilizado en endpoints de autenticación para recibir credenciales desde el
 * frontend.
 * 
 * @JsonProperty mapea "contraseña" para compatibilidad con JSON (ej. en
 *               español).
 */
public class LoginUserDto {
    /**
     * Email del usuario para login.
     */
    private String email;
    /**
     * Contraseña del usuario para login.
     * Mapeado como "contraseña" en JSON para legibilidad en requests.
     */
    @JsonProperty("password")
    private String password;

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
    public String getPassword() {
        return password;
    }

    /**
     * Setter para contraseña.
     * 
     * @param contraseña Contraseña a establecer.
     */
    public void setPassword(String password) {
        this.password = password;
    }

}
