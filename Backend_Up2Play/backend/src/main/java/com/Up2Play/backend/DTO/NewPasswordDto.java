package com.Up2Play.backend.DTO;


//DTO para guardar la nueva contraseña
 
public class NewPasswordDto {
    
    private String email;

    private String password;
    
    
    // Constructores 
    public NewPasswordDto() {
    }
    public NewPasswordDto(String password , String email) {
        this.password = password;
        this.email = email;
    }

    // Getters y setters
    
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
