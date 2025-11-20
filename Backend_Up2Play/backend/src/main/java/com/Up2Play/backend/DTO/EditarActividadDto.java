package com.Up2Play.backend.DTO;

public class EditarActividadDto {

    private String nombre;
    private String descripcion;
    private String fecha;
    private String ubicacion;
    private String deporte;
    private String nivel;
    private String numPersTotales;

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
    public String getnumPersTotales() {
        return numPersTotales;
    }
    public void setnumPersTotales(String numPersTotales) {
        this.numPersTotales = numPersTotales;
    }
   
    public String getDeporte() {
        return deporte;
    }
    public void setDeporte(String deporte) {
        this.deporte = deporte;
    }
   

    

    

}
