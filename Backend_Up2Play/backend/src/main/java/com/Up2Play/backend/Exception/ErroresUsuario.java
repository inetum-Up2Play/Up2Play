package com.Up2Play.backend.Exception;

public class ErroresUsuario {

    public static class CorreoRegistradoException extends RuntimeException {
        public CorreoRegistradoException(String message){
            super(message);
        }
    }

    public static class NombreUsuarioRegistradoException extends RuntimeException {
        public NombreUsuarioRegistradoException(String message){
            super(message);
        }
    }

    public static class UsuarioNoEncontradoException extends RuntimeException {
        public UsuarioNoEncontradoException(String message){
            super(message);
        }
    }

    public static class UsuarioBloqueadoLoginException extends RuntimeException {
        public UsuarioBloqueadoLoginException(String message){
            super(message);
        }
    }

    public static class UsuarioNoVerificadoException extends RuntimeException {
        public UsuarioNoVerificadoException(String message){
            super(message);
        }
    }

    public static class CredencialesErroneasException extends RuntimeException {
        public CredencialesErroneasException(String message){
            super(message);
        }
    }

    public static class CodigoExpiradoException extends RuntimeException {
        public CodigoExpiradoException(String message){
            super(message);
        }
    }

    public static class CodigoIncorrectoException extends RuntimeException {
        public CodigoIncorrectoException(String message){
            super(message);
        }
    }

    public static class CuentaYaVerificadaException extends RuntimeException {
        public CuentaYaVerificadaException(String message){
            super(message);
        }
    }
}
