package com.Up2Play.backend.Model.enums;

public enum NivelDificultad {

    INICIADO("Iniciado"),
    PRINCIPIANTE("Principiante"),
    INTERMEDIO("Intermedio"),
    AVANZADO("Avanzado"),
    EXPERTO("Experto");

    private final String valorBD;

    NivelDificultad(String valorBD) {
        this.valorBD = valorBD;
    }

    public String getValorBD() {
        return valorBD;
    }

    public static NivelDificultad fromValue(String value) {
        for (NivelDificultad estado : NivelDificultad.values()) {
            if (estado.valorBD.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Valor no válido: " + value);
    }

}
