package com.Up2Play.backend.DTO;

import java.time.Instant;

public record ErrorResponseDto( 
    /* record se utilitzan en DTOs de solo lectura, no hay que modificar variables. Se usa en lugar de "class" para ahorrar código y hacerlos más seguros
    es un archivo inmtutable.*/
 
    String error,
    String message,
    int status,
    String path,
    Instant timestamp //variable mas acutalizada de tiempo (antigo Date)
) {}
