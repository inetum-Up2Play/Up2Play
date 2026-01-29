package com.Up2Play.backend.DTO.Respuestas;

public class UsuarioDto {
    private Long id;
    private String email;
    private String nombreUsuario;
    private String rol;
    private String stripeAccountId;
    private boolean pagosHabilitados;

    public UsuarioDto() {
    }

    public UsuarioDto(Long id, String email, String nombreUsuario, String rol) {
        this.id = id;
        this.email = email;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
    }

    public UsuarioDto(Long id, String email, String nombreUsuario, String rol, boolean pagosHabilitados) {
        this.id = id;
        this.email = email;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
        this.pagosHabilitados = pagosHabilitados;
    }

    public UsuarioDto(Long id, String email, String nombreUsuario, String rol, String stripeAccountId) {
        this.id = id;
        this.email = email;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
        this.stripeAccountId = stripeAccountId;
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

    public String getStripeAccountId() {
        return stripeAccountId;
    }

    public void setStripeAccountId(String stripeAccountId) {
        this.stripeAccountId = stripeAccountId;
    }

    public boolean isPagosHabilitados() {
        return pagosHabilitados;
    }

    public void setPagosHabilitados(boolean pagosHabilitados) {
        this.pagosHabilitados = pagosHabilitados;
    }
}
