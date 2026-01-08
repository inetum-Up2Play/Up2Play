package com.Up2Play.backend.DTO.Respuestas;

import java.time.LocalDateTime;

public record PagoDtoResp(
    Long id,
    LocalDateTime fecha,
    double total,
    Long usuario,
    Long actividadId,
    String nombreActividad
 ) {}
