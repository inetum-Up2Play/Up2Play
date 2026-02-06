package com.Up2Play.backend.Model.enums;

public enum EstadoNotificacion {

    INSCRITO("Inscrito"),
    PAGADO("Pagado"),
    PAGO_RECIBIDO("Pago Recibido"),
    REEMBOLSADO("Reembolsado"),
    PAGO_FALLIDO("Pago Fallido"),
    ACTUALIZADO("Actualizado"),
    DESAPUNTADO("Desapuntado"),
    CANCELADA("Cancelada"),
    CREADA("Creada"),
    EDITADA("Editada");

    private final String valorBD;

    EstadoNotificacion(String valorBD) {
        this.valorBD = valorBD;
    }

    public String getValorBD() {
        return valorBD;
    }

    public static EstadoNotificacion fromValue(String value) {
        for (EstadoNotificacion estado : EstadoNotificacion.values()) {
            if (estado.valorBD.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Valor no válido: " + value);
    }

}
