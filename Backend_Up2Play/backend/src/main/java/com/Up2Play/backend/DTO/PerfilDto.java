package com.Up2Play.backend.DTO;

import java.time.LocalDate;

import com.Up2Play.backend.Exception.ValidarPalabrasProhibidas;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.enums.SexoAElegir;

public class PerfilDto {

    private Long id;
    @ValidarPalabrasProhibidas
    private String nombre;
    @ValidarPalabrasProhibidas
    private String apellido;
    private String telefono;
    private SexoAElegir sexo;
    private LocalDate fechaNacimiento;
    @ValidarPalabrasProhibidas
    private String idiomas;
    private String email;
    private Usuario usuario;
    private int imagenPerfil;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public SexoAElegir getSexo() {
        return sexo;
    }

    public void setSexo(SexoAElegir sexo) {
        this.sexo = sexo;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getIdiomas() {
        return idiomas;
    }

    public void setIdiomas(String idiomas) {
        this.idiomas = idiomas;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public int getImagenPerfil() {
        return imagenPerfil;
    }

    public void setImagenPerfil(int imagenPerfil) {
        this.imagenPerfil = imagenPerfil;
    }

}
