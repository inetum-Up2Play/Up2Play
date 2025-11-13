package com.Up2Play.backend.Model.converter;

import com.Up2Play.backend.Model.enums.EstadoActividad;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;


/* Sirve para convertir automáticamente entre un tipo Java (EstadoActividad)
 * y un tipo en la BD (String).
*/ 

@Converter(autoApply = true)
public class EstadoActividadConverter implements AttributeConverter<EstadoActividad, String> {
    
    /* 
     * Este método se ejecuta cuando JPA necesita guardar el valor en la base de datos.
     * Convierte el enum EstadoActividad en el texto que debe ir en la columna (por ejemplo, "En curso").
    */
    @Override
    public String convertToDatabaseColumn(EstadoActividad estado) {
        return (estado != null) ? estado.getValorBD() : null;
    }

    @Override
    public EstadoActividad convertToEntityAttribute(String dbData) {
        return (dbData != null) ? EstadoActividad.fromValue(dbData) : null;
    }
}