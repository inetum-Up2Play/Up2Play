package com.Up2Play.backend.Model.converter;

import com.Up2Play.backend.Model.enums.EstadoPago;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoPagoConverter implements AttributeConverter<EstadoPago, String> {

    @Override
    public String convertToDatabaseColumn(EstadoPago estado) {
        return estado != null ? estado.getValorBD() : null;
    }

    @Override
    public EstadoPago convertToEntityAttribute(String valor) {
        return valor != null ? EstadoPago.fromValue(valor) : null;
    }
}
