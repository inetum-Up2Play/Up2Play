package com.Up2Play.backend.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(unique = true, nullable = false)
    private Long id;

    @NotBlank
    @Email
    private String email;
    private String contraseña;
    private String rol;
    private String nombre_usuario;

    public Usuario(Long id, String email, String contraseña, String rol, String nombre_usuario) {
        this.id = id;
        this.email = email;
        this.contraseña = contraseña;
        this.rol = rol;
        this.nombre_usuario = nombre_usuario;
    }

    public Usuario(String email, String contraseña, String rol, String nombre_usuario) {
        this.email = email;
        this.contraseña = contraseña;
        this.rol = rol;
        this.nombre_usuario = nombre_usuario;
    }

    public Usuario() {
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

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getNombre_usuario() {
        return nombre_usuario;
    }

    public void setNombre_usuario(String nombre_usuario) {
        this.nombre_usuario = nombre_usuario;
    }

}
