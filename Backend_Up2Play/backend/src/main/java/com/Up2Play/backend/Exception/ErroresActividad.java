package com.Up2Play.backend.Exception;

public class ErroresActividad {

    public static class FechaYHora extends RuntimeException {
        public FechaYHora(String message) {
            super(message);
        }
    }

    public static class ActividadNoEncontrada extends RuntimeException {
        public ActividadNoEncontrada(String message) {
            super(message);
        }
    }

}
