package com.Up2Play.backend.DTO;

public class VerifyEmailDto {

    private String email;
    private String verificationCode;
    private String token;

    public VerifyEmailDto(String email, String verificationCode, String token) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

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
