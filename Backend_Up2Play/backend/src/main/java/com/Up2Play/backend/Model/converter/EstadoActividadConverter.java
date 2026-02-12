package com.Up2Play.backend.Model.converter;

import com.Up2Play.backend.Model.enums.EstadoActividad;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoActividadConverter implements AttributeConverter<EstadoActividad, String> {

    @Override
    public String convertToDatabaseColumn(EstadoActividad estado) {
        return (estado != null) ? estado.getValorBD() : null;
    }

    @Override
    public EstadoActividad convertToEntityAttribute(String dbData) {
        return (dbData != null) ? EstadoActividad.fromValue(dbData) : null;
    }
}