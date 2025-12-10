package com.Up2Play.backend.DTO;


//DTO para guardar la nueva contraseña
 
public class CambiarPasswordDto {
    
    private String oldPassword;
    private String newPassword;

    public CambiarPasswordDto() {
    }

    public CambiarPasswordDto(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
    
    
   
