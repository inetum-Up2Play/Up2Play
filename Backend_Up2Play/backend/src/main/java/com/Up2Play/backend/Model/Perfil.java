package com.Up2Play.backend.Model;

import java.time.LocalDate;

import com.Up2Play.backend.Model.converter.SexoAElegirConverter;
import com.Up2Play.backend.Model.enums.SexoAElegir;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PERFIL")
public class Perfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private String nombre;
    private String apellido;
    private String telefono;


    @Convert(converter = SexoAElegirConverter.class)
    @Column(name = "sexo", nullable = false)
    private SexoAElegir sexo;

    private LocalDate fechaNacimiento;
    private String idiomas;
    private String email;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "IMAGEN_PERFIL", nullable = true)
    private int imagenPerfil;

    public Perfil() {
    }

    public Perfil(Long id, String nombre, String apellido, String telefono, SexoAElegir sexo, LocalDate fechaNacimiento,
            String idiomas, String email, Usuario usuario, int imagenPerfil) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.sexo = sexo;
        this.fechaNacimiento = fechaNacimiento;
        this.idiomas = idiomas;
        this.email = email;
        this.usuario = usuario;
        this.imagenPerfil = imagenPerfil;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
