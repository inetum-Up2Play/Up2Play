package com.Up2Play.backend.Model.enums;

public enum EstadoNotificacion {

    INSCRITO("Inscrito"),
    PAGADO("Pagado"),
    ACTUALIZADO("Actualizado"), //editar perfil
    DESAPUNTADO("Desapuntado"),
    CANCELADA("Cancelada"),
    CREADA("Creada"),
    EDITADA("Editada"); //editar actividad
 
    // iniciar atributo que va dentro del enum
    private final String valorBD;
 
    //Constructor del enumerado
    EstadoNotificacion(String valorBD) {
        this.valorBD = valorBD;
    }
 
    //Getter
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
