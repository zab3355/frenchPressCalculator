package com.frenchpress.api.preferences;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UnitsConverter implements AttributeConverter<Units, String> {

    @Override
    public String convertToDatabaseColumn(Units attribute) {
        return attribute == null ? null : attribute.getWireValue();
    }

    @Override
    public Units convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Units.fromWireValue(dbData);
    }
}
