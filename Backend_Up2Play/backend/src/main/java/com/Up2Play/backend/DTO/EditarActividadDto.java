package com.Up2Play.backend.DTO;

public class EditarActividadDto {

    private String nombre;
    private String descripcion;
    private String fecha;
    private String hora;
    private String ubicacion;
    private String deporte;
    private String nivel;
    private String num_pers_totales;
    private String precio; //editar precio? que pasa con las personas que ya se ha apuntado?

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
    public String getHora() {
        return hora;
    }
    public void setHora(String hora) {
        this.hora = hora;
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
    public String getNum_pers_totales() {
        return num_pers_totales;
    }
    public void setNum_pers_totales(String num_pers_totales) {
        this.num_pers_totales = num_pers_totales;
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
   

    

    

}
