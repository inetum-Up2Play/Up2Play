
package com.Up2Play.backend.Model.enums;

public enum SexoAElegir {
    MASCULINO("Masculino"),
    FEMENINO("Femenino"),
    OTROS("Otro");

    private final String valorBD;

    SexoAElegir(String valorBD) {
        this.valorBD = valorBD;
    }

    public String getValorBD() {
        return valorBD;
    }

    public static SexoAElegir fromValue(String value) {
        if (value == null) return null;
        for (SexoAElegir estado : values()) {
            if (estado.valorBD.equalsIgnoreCase(value.trim())) {
                return estado;
            }
        }
        // Normalizaciones comunes para no romper aunque llegue "OTRO" o "MASCULINO"
        return switch (value.trim().toLowerCase()) {
            case "masculino", "m" -> MASCULINO;
            case "femenino", "f" -> FEMENINO;
            case "otro", "otros", "o" -> OTROS;
            default -> throw new IllegalArgumentException("Sexo no válido: " + value);
        };
    }
}
