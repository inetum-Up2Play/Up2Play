package com.Up2Play.backend.Exception;

public class ErroresPerfil {

    public static class PerfilNoEncontradoException extends RuntimeException {
        public PerfilNoEncontradoException(String message){
            super(message);
        }
    }

    public static class EditarPerfilDenegadoException extends RuntimeException {
        public EditarPerfilDenegadoException(String message){
            super(message);
        }
    }

    

}
