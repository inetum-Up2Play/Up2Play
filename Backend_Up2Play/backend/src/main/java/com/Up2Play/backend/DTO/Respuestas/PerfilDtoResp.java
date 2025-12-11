package com.Up2Play.backend.DTO.Respuestas;

import java.time.LocalDate;
import com.Up2Play.backend.Model.enums.SexoAElegir;

public record PerfilDtoResp(
        Long id,
        String nombre,
        String apellido,
        String telefono,
        SexoAElegir sexo,
        LocalDate fechaNacimiento,
        String idiomas, // ajusta a List<String> si corresponde
        String email,
        int imagenPerfil // ajusta el tipo si corresponde
) {
}
