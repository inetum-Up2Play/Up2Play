package com.Up2Play.backend.DTO.Respuestas;

public record NotificacionDtoResp(
    Long id,
    String titulo,
    String descripcion,
    String fecha,
    boolean leido,
    String estadoNotificacion,
    Long actividadId
) {}
