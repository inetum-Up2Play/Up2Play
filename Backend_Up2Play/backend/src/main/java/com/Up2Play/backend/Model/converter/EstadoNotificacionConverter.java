package com.Up2Play.backend.Model.converter;

import com.Up2Play.backend.Model.enums.EstadoNotificacion;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoNotificacionConverter implements AttributeConverter<EstadoNotificacion, String> {

    @Override
    public String convertToDatabaseColumn(EstadoNotificacion estado) {
        return (estado != null) ? estado.getValorBD() : null;
    }

    @Override
    public EstadoNotificacion convertToEntityAttribute(String dbData) {
        return (dbData != null) ? EstadoNotificacion.fromValue(dbData) : null;
    }
}