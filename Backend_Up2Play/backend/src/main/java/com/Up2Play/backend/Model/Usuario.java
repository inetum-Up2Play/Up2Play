package com.Up2Play.backend.Model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

//Entidad Usuario que representa un usuario en la base de datos.

@Entity
@Table(name = "USUARIO")
public class Usuario implements UserDetails {

    // Campos principales de identificación y autenticación
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // autogenera el ID
    @Column(unique = true, nullable = false) // único y no nulo
    private Long id;

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

    @OneToMany(mappedBy = "usuarioCreador")
    Set<Actividad> actividadesCreadas = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "USUARIO_ACTIVIDAD", joinColumns = @JoinColumn(name = "id_usuario", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "id_actividad", referencedColumnName = "id"))
    private Set<Actividad> actividadesUnidas = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "USUARIO_NOTIFICACION")
    private Set<Notificacion> notificaciones = new HashSet<>();

    @OneToOne(mappedBy = "usuario")
    private Perfil perfil;

    public Perfil getPerfil() {
        return perfil;
    }

    public void setPerfil(Perfil perfil) {
        this.perfil = perfil;
    }

    // Constructores
    public Usuario(Long id, String email, String password, String rol, String nombreUsuario) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.nombreUsuario = nombreUsuario;
    }

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

    public Usuario(Long id, @NotBlank @Email String email, String password, String rol, String nombreUsuario,
            boolean enabled, String verificationCode, LocalDateTime verificationCodeExpiresAt,
            Set<Actividad> actividadesCreadas, Set<Actividad> actividadesUnidas, Perfil perfil) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.nombreUsuario = nombreUsuario;
        this.enabled = enabled;
        this.verificationCode = verificationCode;
        this.verificationCodeExpiresAt = verificationCodeExpiresAt;
        this.actividadesCreadas = actividadesCreadas;
        this.actividadesUnidas = actividadesUnidas;
        this.perfil = perfil;
    }

    public Usuario(String email, String password, String rol, String nombreUsuario) {
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.nombreUsuario = nombreUsuario;
    }

    public Usuario(Long id, @NotBlank @Email String email, String password, String rol, String nombreUsuario,
            boolean enabled, String verificationCode, LocalDateTime verificationCodeExpiresAt,
            Set<Actividad> actividadesCreadas, Set<Actividad> actividadesUnidas, Set<Notificacion> notificaciones,
            Perfil perfil) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.nombreUsuario = nombreUsuario;
        this.enabled = enabled;
        this.verificationCode = verificationCode;
        this.verificationCodeExpiresAt = verificationCodeExpiresAt;
        this.actividadesCreadas = actividadesCreadas;
        this.actividadesUnidas = actividadesUnidas;
        this.notificaciones = notificaciones;
        this.perfil = perfil;
    }

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

    // Devuelve los permisos o roles del usuario
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    // Verifica si la cuenta no ha expirado. Siempre true por defecto.
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // Verifica si la cuenta no está bloqueada. Siempre true por defecto.
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Verifica si las credenciales no han expirado. Siempre true por defecto.
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Verifica si el usuario está habilitado.
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    // Retorna la password para autenticación.
    @Override
    public String getPassword() {
        return password;
    }

    // Retorna el nombre de usuario (usa email).
    @Override
    public String getUsername() {
        return email;
    }

    public Set<Actividad> getActividadesCreadas() {
        return actividadesCreadas;
    }

    public void setActividadesCreadas(Set<Actividad> actividadesCreadas) {
        this.actividadesCreadas = actividadesCreadas;
    }

    public Set<Actividad> getActividadesUnidas() {
        return actividadesUnidas;
    }

    public void setActividadesUnidas(Set<Actividad> actividadesUnidas) {
        this.actividadesUnidas = actividadesUnidas;
    }

    public Set<Notificacion> getNotificaciones() {
        return notificaciones;
    }

    public void setNotificaciones(Set<Notificacion> notificaciones) {
        this.notificaciones = notificaciones;
    }

}
