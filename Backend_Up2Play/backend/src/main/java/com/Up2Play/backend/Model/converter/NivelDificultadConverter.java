package com.Up2Play.backend.Model.converter;

import com.Up2Play.backend.Model.enums.NivelDificultad;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class NivelDificultadConverter  implements AttributeConverter<NivelDificultad, String> {
    @Override
    public String convertToDatabaseColumn(NivelDificultad estado) {
        return (estado != null) ? estado.getValorBD() : null;
    }

    @Override
    public NivelDificultad convertToEntityAttribute(String dbData) {
        return (dbData != null) ? NivelDificultad.fromValue(dbData) : null;
    }
    
}
