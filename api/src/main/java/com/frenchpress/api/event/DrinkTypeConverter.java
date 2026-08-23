package com.frenchpress.api.event;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DrinkTypeConverter implements AttributeConverter<DrinkType, String> {

    @Override
    public String convertToDatabaseColumn(DrinkType attribute) {
        return attribute == null ? null : attribute.getWireValue();
    }

    @Override
    public DrinkType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : DrinkType.fromWireValue(dbData);
    }
}
