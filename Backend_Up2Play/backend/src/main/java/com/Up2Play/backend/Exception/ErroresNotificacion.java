package com.Up2Play.backend.Exception;

public class ErroresNotificacion {

    public static class NotificacionNoEncontrada extends RuntimeException {
        public NotificacionNoEncontrada(String message) {
            super(message);
        }
    }

}
