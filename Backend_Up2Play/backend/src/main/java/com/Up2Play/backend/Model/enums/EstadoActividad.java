package com.Up2Play.backend.Model.enums;

public enum EstadoActividad {

    COMPLETADA("Completada"),
    EN_CURSO("En curso"),
    PENDIENTE("Pendiente"),
    CANCELADA("Cancelada");

    private final String valorBD;

    EstadoActividad(String valorBD) {
        this.valorBD = valorBD;
    }

    public String getValorBD() {
        return valorBD;
    }

    public static EstadoActividad fromValue(String value) {
        for (EstadoActividad estado : EstadoActividad.values()) {
            if (estado.valorBD.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Valor no válido: " + value);
    }
}