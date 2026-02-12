package com.Up2Play.backend.Model.converter;

import com.Up2Play.backend.Model.enums.SexoAElegir;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class SexoAElegirConverter implements AttributeConverter<SexoAElegir, String> {

    @Override
    public String convertToDatabaseColumn(SexoAElegir attribute) {
        return attribute == null ? null : attribute.getValorBD();
    }

    @Override
    public SexoAElegir convertToEntityAttribute(String dbData) {
        return dbData == null ? null : SexoAElegir.fromValue(dbData);
    }
}
