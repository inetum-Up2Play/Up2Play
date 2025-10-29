package com.Up2Play.backend.Model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Entidad Usuario que representa un usuario en la base de datos.
 * Implementa UserDetails para integración con Spring Security.
 */
@Entity
@Table(name = "USUARIO")
public class Usuario implements UserDetails {

    // Campos principales de identificación y autenticación
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id; // ID único autogenerado

    @NotBlank
    @Email
    @Column(unique = true)
    private String email; // Email único y validado

    private String password; // Contraseña del usuario (debe encriptarse)
    private String rol; // Rol del usuario (ej: ADMIN, USER)
    @Column(name = "nombre_usuario", unique = true)
    private String nombreUsuario; // Nombre de usuario único

    // Campos para verificación y estado
    @Column(name = "ENABLED", nullable = false)
    private boolean enabled; // Indica si la cuenta está activa

    @Column(name = "VERIFICATION_CODE")
    private String verificationCode; // Código de verificación temporal

    @Column(name = "VERIFICATION_EXPIRES_AT")
    private LocalDateTime verificationCodeExpiresAt; // Fecha de expiración del código

    // Constructores
    /**
     * Constructor completo con todos los campos.
     */
    public Usuario(Long id, String email, String password, String rol, String nombreUsuario) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.nombreUsuario = nombreUsuario;
    }

    /**
     * Constructor con campos de verificación incluidos.
     */
    public Usuario(Long id, @NotBlank @Email String email, String password, String rol, String nombreUsuario,
            boolean enabled, String verificationCode, LocalDateTime verificationCodeExpiresAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.nombreUsuario = nombreUsuario;
        this.enabled = enabled;
        this.verificationCode = verificationCode;
        this.verificationCodeExpiresAt = verificationCodeExpiresAt;
    }

    /**
     * Constructor básico sin ID (para creación).
     */
    public Usuario(String email, String password, String rol, String nombreUsuario) {
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.nombreUsuario = nombreUsuario;
    }

    // Constructor por defecto
    public Usuario() {
    }

    // Getters y Setters principales
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

    public String getPasswordU() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getVerificationCodeExpiresAt() {
        return verificationCodeExpiresAt;
    }

    public void setVerificationCodeExpiresAt(LocalDateTime verificationCodeExpiresAt) {
        this.verificationCodeExpiresAt = verificationCodeExpiresAt;
    }

    // Implementación de UserDetails para Spring Security
    /**
     * Retorna autoridades (roles) del usuario. Actual: vacío, implementar según
     * roles.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(); // TODO: Implementar con roles reales
    }

    /**
     * Verifica si la cuenta no ha expirado. Siempre true por defecto.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Verifica si la cuenta no está bloqueada. Siempre true por defecto.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Verifica si las credenciales no han expirado. Siempre true por defecto.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Verifica si el usuario está habilitado.
     */
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * Retorna la password para autenticación.
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Retorna el nombre de usuario (usa email).
     */
    @Override
    public String getUsername() {
        return email;
    }
}
