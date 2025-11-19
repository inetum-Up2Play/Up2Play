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

    public static class UsuarioYaApuntadoException extends RuntimeException {
        public UsuarioYaApuntadoException(String message) {
            super(message);
        }
    }

    public static class UsuarioNoApuntadoException extends RuntimeException {
        public UsuarioNoApuntadoException(String message) {
            super(message);
        }
    }

    public static class MaximosParticipantes extends RuntimeException {
        public MaximosParticipantes(String message) {
            super(message);
        }
    }

    public static class UsuarioCreador extends RuntimeException {
        public UsuarioCreador(String message) {
            super(message);
        }
    }

}
