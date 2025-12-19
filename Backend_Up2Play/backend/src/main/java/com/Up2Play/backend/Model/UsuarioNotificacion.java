package com.Up2Play.backend.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "USUARIO_NOTIFICACION")
public class UsuarioNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NOTIFICACION")
    private Notificacion notificacion;

    @Column(name = "LEIDO")
    private boolean leido = false;

    public UsuarioNotificacion() {
    }

    public UsuarioNotificacion(Long id, Usuario usuario, Notificacion notificacion, boolean leido) {
        this.id = id;
        this.usuario = usuario;
        this.notificacion = notificacion;
        this.leido = leido;
    }

    public UsuarioNotificacion(Usuario usuario, Notificacion notificacion, boolean leido) {
        this.usuario = usuario;
        this.notificacion = notificacion;
        this.leido = leido;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Notificacion getNotificacion() {
        return notificacion;
    }

    public void setNotificacion(Notificacion notificacion) {
        this.notificacion = notificacion;
    }

    public boolean isLeido() {
        return leido;
    }

    public void setLeido(boolean leido) {
        this.leido = leido;
    }

}
