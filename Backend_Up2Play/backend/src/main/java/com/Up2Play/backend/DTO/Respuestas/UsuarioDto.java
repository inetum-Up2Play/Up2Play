package com.Up2Play.backend.DTO.Respuestas;

public class UsuarioDto {
    private Long id;
    private String email;
    private String nombreUsuario;
    private String rol;

    
    public UsuarioDto() {
    }


    public UsuarioDto(Long id, String email, String nombreUsuario, String rol) {
        this.id = id;
        this.email = email;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public String getNombreUsuario() {
        return nombreUsuario;
    }


    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }


    public String getRol() {
        return rol;
    }


    public void setRol(String rol) {
        this.rol = rol;
    }

    

    
}
