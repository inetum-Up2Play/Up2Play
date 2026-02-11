
package com.Up2Play.backend.Model.enums;

public enum SexoAElegir {
    MASCULINO("Masculino"),
    FEMENINO("Femenino"),
    OTRO("Otro");

    private final String valorBD;

    SexoAElegir(String valorBD) {
        this.valorBD = valorBD;
    }

    public String getValorBD() {
        return valorBD;
    }

    public static SexoAElegir fromValue(String value) {
        if (value == null)
            return null;
        for (SexoAElegir estado : values()) {
            if (estado.valorBD.equalsIgnoreCase(value.trim())) {
                return estado;
            }
        }
        return switch (value.trim().toLowerCase()) {
            case "masculino", "m" -> MASCULINO;
            case "femenino", "f" -> FEMENINO;
            case "otro", "otros", "o" -> OTRO;
            default -> throw new IllegalArgumentException("Sexo no válido: " + value);
        };
    }
}
