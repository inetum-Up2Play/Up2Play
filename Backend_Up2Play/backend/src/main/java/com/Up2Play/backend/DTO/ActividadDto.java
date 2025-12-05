package com.Up2Play.backend.DTO;

import com.Up2Play.backend.Exception.ValidarPalabrasProhibidas;

public class ActividadDto {
    @ValidarPalabrasProhibidas
    private String nombre;
    @ValidarPalabrasProhibidas
    private String descripcion;
    private String fecha;
    @ValidarPalabrasProhibidas
    private String ubicacion;
    private String deporte;
    private String nivel;
    private String estado;
    private String numPersTotales;
    private String precio;

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

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getNumPersTotales() {
        return numPersTotales;
    }

    public void setNumPersTotales(String numPersTotales) {
        this.numPersTotales = numPersTotales;
    }

    public String getPrecio() {
        return precio;
    }

    public void setPrecio(String precio) {
        this.precio = precio;
    }

    public String getDeporte() {
        return deporte;
    }

    public void setDeporte(String deporte) {
        this.deporte = deporte;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

}