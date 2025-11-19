package com.Up2Play.backend.Model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

import com.Up2Play.backend.Model.converter.EstadoActividadConverter;
import com.Up2Play.backend.Model.converter.NivelDificultadConverter;
import com.Up2Play.backend.Model.enums.EstadoActividad;
import com.Up2Play.backend.Model.enums.NivelDificultad;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name= "ACTIVIDAD")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(unique = true, nullable = false) 
    private Long id;

    private String nombre;
    
    @Lob
    @Column(name = "DESCRIPCION", columnDefinition = "CLOB")
    private String descripcion;
    
    private LocalDate fecha;
    private LocalTime hora;
    private String ubicacion;
    private String deporte;

    @Convert(converter = NivelDificultadConverter.class)
    private NivelDificultad nivel;
    private int num_pers_inscritas;
    private int num_pers_totales;
    
    @Convert(converter = EstadoActividadConverter.class)
    private EstadoActividad estado;
    private double precio;
    
    @ManyToOne
    @JoinColumn(name="id_usuario_creador", nullable = false)
    private Usuario usuarioCreador; //usuario creador de actividad

    
    @ManyToMany(mappedBy = "actividadesUnidas")
    private Set<Usuario> usuarios = new HashSet<>();

    

    public Actividad() {
    }

    

    public Actividad(String nombre, String descripcion, LocalDate fecha, LocalTime hora, String ubicacion, String deporte,
            NivelDificultad nivel, int num_pers_inscritas, int num_pers_totales, EstadoActividad estado, double precio,
            Usuario usuarioCreador, Set<Usuario> usuarios) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.hora = hora;
        this.ubicacion = ubicacion;
        this.deporte = deporte;
        this.nivel = nivel;
        this.num_pers_inscritas = num_pers_inscritas;
        this.num_pers_totales = num_pers_totales;
        this.estado = estado;
        this.precio = precio;
        this.usuarioCreador = usuarioCreador;
        this.usuarios = usuarios;
    }



    public Actividad(Long id, String nombre, String descripcion, LocalDate fecha, LocalTime hora, String ubicacion, String deporte,
            NivelDificultad nivel, int num_pers_inscritas, int num_pers_totales, EstadoActividad estado, double precio,
            Usuario usuarioCreador, Set<Usuario> usuarios) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.hora = hora;
        this.ubicacion = ubicacion;
        this.deporte = deporte;
        this.nivel = nivel;
        this.num_pers_inscritas = num_pers_inscritas;
        this.num_pers_totales = num_pers_totales;
        this.estado = estado;
        this.precio = precio;
        this.usuarioCreador = usuarioCreador;
        this.usuarios = usuarios;
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

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    
    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public NivelDificultad getNivel() {
        return nivel;
    }

    public void setNivel(NivelDificultad nivel) {
        this.nivel = nivel;
    }

    public int getNum_pers_inscritas() {
        return num_pers_inscritas;
    }

    public void setNum_pers_inscritas(int num_pers_inscritas) {
        this.num_pers_inscritas = num_pers_inscritas;
    }

    public int getNum_pers_totales() {
        return num_pers_totales;
    }

    public void setNum_pers_totales(int num_pers_totales) {
        this.num_pers_totales = num_pers_totales;
    }

    public EstadoActividad getEstado() {
        return estado;
    }

    public void setEstado(EstadoActividad estado) {
        this.estado = estado;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public Usuario getUsuarioCreador() {
        return usuarioCreador;
    }

    public void setUsuarioCreador(Usuario usuarioCreador) {
        this.usuarioCreador = usuarioCreador;
    }

    public Set<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        this.usuarios = usuarios;
    }



    public String getDeporte() {
        return deporte;
    }



    public void setDeporte(String deporte) {
        this.deporte = deporte;
    }

    
    

}
