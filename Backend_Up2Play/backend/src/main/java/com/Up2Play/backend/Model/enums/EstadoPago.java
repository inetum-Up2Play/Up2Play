package com.Up2Play.backend.Model.enums;

public enum EstadoPago {

    COMPLETADO("Completado"),
    FALLIDO("Fallido");

    private final String valorBD;

    EstadoPago (String valorBD){
        this.valorBD = valorBD;
    }

    public String getValorBD() {
        return valorBD;
    }

    public static EstadoPago fromValue(String value) {
        for (EstadoPago estado : EstadoPago.values()) {
            if (estado.valorBD.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Valor no válido: " + value);
    }
    
}
