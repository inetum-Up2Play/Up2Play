package com.Up2Play.backend.DTO;

/**
 * DTO para verificación de cuenta de usuario: email y código de verificación.
 * Utilizado en endpoints de verificación para recibir datos desde el frontend.
 */
public class VerifyUserDto {
    /**
     * Email del usuario a verificar.
     */
    private String email;
    /**
     * Código de verificación recibido por email.
     */
    private String verificationCode;

    private String token;

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
     * Getter para código de verificación.
     * 
     * @return Código de verificación.
     */
    public String getVerificationCode() {
        return verificationCode;
    }

    /**
     * Setter para código de verificación.
     * 
     * @param verificationCode Código a establecer.
     */
    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
