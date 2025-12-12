package com.Up2Play.backend.Model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.Up2Play.backend.Model.enums.EstadoNotificacion;
import com.Up2Play.backend.Model.converter.EstadoNotificacionConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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
    private LocalDate fecha;

    @Column(name = "LEIDO")
    private boolean leido;

    @Convert(converter = EstadoNotificacionConverter.class)
    private EstadoNotificacion estadoNotificacion;

    @ManyToOne
    @JoinColumn(name = "ID_ACTIVIDAD", nullable = false)
    private Actividad id_actividad;

    @ManyToMany(mappedBy = "notificaciones")
    private Set<Usuario> usuarios = new HashSet<>();

    public Notificacion(Long id, @Size(max = 64) String titulo, @Size(max = 500) String descripcion, LocalDate fecha,
            boolean leido, EstadoNotificacion estadoNotificacion, Actividad id_actividad,
            Set<Usuario> usuarios) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.leido = leido;
        this.estadoNotificacion = estadoNotificacion;
        this.id_actividad = id_actividad;
        this.usuarios = usuarios;
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

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public boolean isLeido() {
        return leido;
    }

    public void setLeido(boolean leido) {
        this.leido = leido;
    }

    public EstadoNotificacion getEstadoNotificacion() {
        return estadoNotificacion;
    }

    public void setEstadoNotificacion(EstadoNotificacion estadoNotificacion) {
        this.estadoNotificacion = estadoNotificacion;
    }

    public Actividad getId_actividad() {
        return id_actividad;
    }

    public void setId_actividad(Actividad id_actividad) {
        this.id_actividad = id_actividad;
    }

    public Set<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        this.usuarios = usuarios;
    }

}
