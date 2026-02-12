package com.Up2Play.backend.DTO;

public class NewPasswordDto {

    private String email;

    private String password;

    public NewPasswordDto() {
    }

    public NewPasswordDto(String password, String email) {
        this.password = password;
        this.email = email;
    }

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
