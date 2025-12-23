package com.Up2Play.backend.Model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.Up2Play.backend.Model.enums.EstadoNotificacion;
import com.Up2Play.backend.Model.converter.EstadoNotificacionConverter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "NOTIFICACION")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Size(max = 64) // ajusta a 255 si la columna es 255
    @Column(name = "TITULO", length = 64)
    private String titulo;

    @Size(max = 500)
    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Column(name = "FECHA")
    private LocalDateTime fecha;

    @Convert(converter = EstadoNotificacionConverter.class)
    private EstadoNotificacion estadoNotificacion;

    @ManyToOne
    @JoinColumn(name = "ID_ACTIVIDAD", nullable = true)
    private Actividad actividad;

    @OneToMany(mappedBy = "notificacion", cascade = CascadeType.ALL,
           orphanRemoval = true)
    private Set<UsuarioNotificacion> usuarioNotificaciones = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "ID_USUARIO_GENERADOR", nullable = false)
    private Usuario usuarioCreador;

    public Notificacion(Long id, @Size(max = 64) String titulo, @Size(max = 500) String descripcion,
            LocalDateTime fecha,
            EstadoNotificacion estadoNotificacion, Actividad actividad, Set<UsuarioNotificacion> usuarioNotificaciones,
            Usuario usuarioCreador) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.estadoNotificacion = estadoNotificacion;
        this.actividad = actividad;
        this.usuarioNotificaciones = usuarioNotificaciones;
        this.usuarioCreador = usuarioCreador;
    }

    public Notificacion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public EstadoNotificacion getEstadoNotificacion() {
        return estadoNotificacion;
    }

    public void setEstadoNotificacion(EstadoNotificacion estadoNotificacion) {
        this.estadoNotificacion = estadoNotificacion;
    }

    public Actividad getActividad() {
        return actividad;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
    }

    public Usuario getUsuarioCreador() {
        return usuarioCreador;
    }

    public void setUsuarioCreador(Usuario usuarioCreador) {
        this.usuarioCreador = usuarioCreador;
    }

    public Set<UsuarioNotificacion> getUsuarioNotificaciones() {
        return usuarioNotificaciones;
    }

    public void setUsuarioNotificaciones(Set<UsuarioNotificacion> usuarioNotificaciones) {
        this.usuarioNotificaciones = usuarioNotificaciones;
    }
}
