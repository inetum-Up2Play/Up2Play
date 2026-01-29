package com.Up2Play.backend.Exception;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = Excepciones.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidarPalabrasProhibidas {
    String message() default "El texto contiene palabras prohibidas.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
