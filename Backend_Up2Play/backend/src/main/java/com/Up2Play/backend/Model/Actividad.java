package com.Up2Play.backend.Model;


import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.Up2Play.backend.Exception.ErroresActividad.LimiteCaracteres;
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
import jakarta.validation.constraints.Size;

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
    
    private LocalDateTime fecha;
    private String ubicacion;
    private String deporte;

    @Convert(converter = NivelDificultadConverter.class)
    private NivelDificultad nivel;
    private int numPersInscritas;
    private int numPersTotales;
    
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

    

    public Actividad(String nombre, String descripcion, LocalDateTime fecha, String ubicacion, String deporte,
            NivelDificultad nivel, int numPersInscritas, int numPersTotales, EstadoActividad estado, double precio,
            Usuario usuarioCreador, Set<Usuario> usuarios) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.ubicacion = ubicacion;
        this.deporte = deporte;
        this.nivel = nivel;
        this.numPersInscritas = numPersInscritas;
        this.numPersTotales = numPersTotales;
        this.estado = estado;
        this.precio = precio;
        this.usuarioCreador = usuarioCreador;
        this.usuarios = usuarios;
    }



    public Actividad(Long id, String nombre, String descripcion, LocalDateTime fecha, String ubicacion, String deporte,
            NivelDificultad nivel, int numPersInscritas, int numPersTotales, EstadoActividad estado, double precio,
            Usuario usuarioCreador, Set<Usuario> usuarios) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.ubicacion = ubicacion;
        this.deporte = deporte;
        this.nivel = nivel;
        this.numPersInscritas = numPersInscritas;
        this.numPersTotales = numPersTotales;
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

    @Size(max = 64)
    public void setNombre(String nombre) {

        if (nombre != null && nombre.length() > 64) {
            throw new LimiteCaracteres("El nombre no puede tener más de 64 caracteres.");
        }else{
            
            this.nombre = nombre;

        }
        
    }

    public String getDescripcion() {
        return descripcion;
    }
 
    @Size(max = 500)
    public void setDescripcion(String descripcion) {

        if (descripcion != null && descripcion.length() > 500) {
            throw new LimiteCaracteres("La descripción no puede tener más de 500 caracteres.");
        }else{

            this.descripcion = descripcion;

        }
        
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
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

    public int getNumPersInscritas() {
        return numPersInscritas;
    }

    public void setNumPersInscritas(int numPersInscritas) {
        this.numPersInscritas = numPersInscritas;
    }

    public int getNumPersTotales() {
        return numPersTotales;
    }

    public void setNumPersTotales(int numPersTotales) {
        this.numPersTotales = numPersTotales;
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
