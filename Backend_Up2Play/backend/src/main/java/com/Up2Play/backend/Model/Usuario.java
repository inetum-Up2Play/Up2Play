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
import jakarta.persistence.CascadeType;
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

@Entity
@Table(name = "USUARIO")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    private String password;
    private String rol;
    @Column(name = "nombre_usuario", unique = true)
    private String nombreUsuario;

    @Column(name = "ENABLED", nullable = false)
    private boolean enabled;

    @Column(name = "VERIFICATION_CODE")
    private String verificationCode;

    @Column(name = "VERIFICATION_EXPIRES_AT")
    private LocalDateTime verificationCodeExpiresAt;

    @OneToMany(mappedBy = "usuarioCreador", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Actividad> actividadesCreadas = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "USUARIO_ACTIVIDAD", joinColumns = @JoinColumn(name = "id_usuario", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "id_actividad", referencedColumnName = "id"))
    private Set<Actividad> actividadesUnidas = new HashSet<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UsuarioNotificacion> usuarioNotificaciones = new HashSet<>();

    private String stripeAccountId;

    @Column(name = "PAGOS_HABILITADOS", nullable = false)
    private Boolean pagosHabilitados = false;

    @OneToOne(mappedBy = "usuario")
    private Perfil perfil;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    Set<Pago> pagos = new HashSet<>();

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
            Set<Actividad> actividadesCreadas, Set<Actividad> actividadesUnidas,
            Set<UsuarioNotificacion> usuarioNotificaciones,
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
        this.usuarioNotificaciones = usuarioNotificaciones;
        this.perfil = perfil;
    }

    public Usuario(Long id, @NotBlank @Email String email, String password, String rol, String nombreUsuario,
            boolean enabled, String verificationCode, LocalDateTime verificationCodeExpiresAt,
            Set<Actividad> actividadesCreadas, Set<Actividad> actividadesUnidas,
            Set<UsuarioNotificacion> usuarioNotificaciones,
            Perfil perfil, Set<Pago> pagos) {
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
        this.usuarioNotificaciones = usuarioNotificaciones;
        this.perfil = perfil;
        this.pagos = pagos;
    }

    public Usuario(Long id, @NotBlank @Email String email, String password, String rol, String nombreUsuario,
            boolean enabled, String verificationCode, LocalDateTime verificationCodeExpiresAt,
            Set<Actividad> actividadesCreadas, Set<Actividad> actividadesUnidas,
            Set<UsuarioNotificacion> usuarioNotificaciones, String stripeAccountId, Perfil perfil) {
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
        this.usuarioNotificaciones = usuarioNotificaciones;
        this.stripeAccountId = stripeAccountId;
        this.perfil = perfil;
    }

    public Usuario(Long id, @NotBlank @Email String email, String password, String rol, String nombreUsuario,
            boolean enabled, String verificationCode, LocalDateTime verificationCodeExpiresAt,
            Set<Actividad> actividadesCreadas, Set<Actividad> actividadesUnidas,
            Set<UsuarioNotificacion> usuarioNotificaciones, String stripeAccountId, Boolean pagosHabilitados,
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
        this.usuarioNotificaciones = usuarioNotificaciones;
        this.stripeAccountId = stripeAccountId;
        this.pagosHabilitados = pagosHabilitados;
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String getPassword() {
        return password;
    }

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

    public Set<UsuarioNotificacion> getUsuarioNotificaciones() {
        return usuarioNotificaciones;
    }

    public void setUsuarioNotificaciones(Set<UsuarioNotificacion> usuarioNotificaciones) {
        this.usuarioNotificaciones = usuarioNotificaciones;
    }

    public String getStripeAccountId() {
        return stripeAccountId;
    }

    public void setStripeAccountId(String stripeAccountId) {
        this.stripeAccountId = stripeAccountId;
    }

    public Boolean getPagosHabilitados() {
        return pagosHabilitados;
    }

    public void setPagosHabilitados(Boolean pagosHabilitados) {
        this.pagosHabilitados = pagosHabilitados;
    }

    public Set<Pago> getPagos() {
        return pagos;
    }

    public void setPagos(Set<Pago> pagos) {
        this.pagos = pagos;

    }
}
