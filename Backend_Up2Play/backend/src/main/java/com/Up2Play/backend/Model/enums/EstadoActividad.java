package com.Up2Play.backend.Model.enums;

//enumerado estado de actividad
public enum EstadoActividad {
    
    /*Los enumerados, por convención, van en mayúsculas y sin espacios. Para asociar el valor
     * con la base de datos lo hacemos mediante un atributo dentro del enum.
     */
    COMPLETADA("Completada"),
    EN_CURSO("En curso"),
    PENDIENTE("Pendiente"),
    CANCELADA("Cancelada");

    // iniciar atributo que va dentro del enum
    private final String valorBD;

    //Constructor del enumerado
    EstadoActividad(String valorBD) {
        this.valorBD = valorBD;
    }

    //Getter
    public String getValorBD() {
        return valorBD;
    }

    /* Método que recibe el texto desde el front o la base de datos y lo compara con todos los valores del enumerado
     * hasya que coincide con en el recibido por parámetro. Si lo encuentra devuelve el enum, si no, lanza un error indicando
     * que el valor no es válido. 
    */
    public static EstadoActividad fromValue(String value) {
        for (EstadoActividad estado : EstadoActividad.values()) {
            if (estado.valorBD.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Valor no válido: " + value);
    }
}



