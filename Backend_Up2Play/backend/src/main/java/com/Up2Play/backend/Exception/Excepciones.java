package com.Up2Play.backend.Exception;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class Excepciones implements ConstraintValidator<ValidarPalabrasProhibidas, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) return true;

        String textoNormalizado = value.toLowerCase();
        return PalabrasProhibidas.PALABRAS_PROHIBIDAS.stream()
                .noneMatch(textoNormalizado::contains);
    }
}
