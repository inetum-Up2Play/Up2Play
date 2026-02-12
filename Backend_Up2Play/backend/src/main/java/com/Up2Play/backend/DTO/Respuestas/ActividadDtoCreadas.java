package com.Up2Play.backend.DTO.Respuestas;

public record ActividadDtoCreadas(
        Long id,
        String nombre,
        String descripcion,
        String fecha,
        String ubicacion,
        String deporte,
        String nivel,
        int numPersInscritas,
        int numPersTotales,
        String estado,
        double precio,
        Long usuarioCreadorId,
        String usuarioCreadorEmail) {
}
