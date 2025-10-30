package com.Up2Play.backend.Exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.Up2Play.backend.DTO.ErrorResponseDto;
import com.Up2Play.backend.Exception.ErroresUsuario.CodigoExpiradoException;
import com.Up2Play.backend.Exception.ErroresUsuario.CodigoIncorrectoException;
import com.Up2Play.backend.Exception.ErroresUsuario.CorreoNoCoincideException;
import com.Up2Play.backend.Exception.ErroresUsuario.CorreoRegistradoException;
import com.Up2Play.backend.Exception.ErroresUsuario.CredencialesErroneasException;
import com.Up2Play.backend.Exception.ErroresUsuario.CuentaYaVerificadaException;
import com.Up2Play.backend.Exception.ErroresUsuario.NombreUsuarioRegistradoException;
import com.Up2Play.backend.Exception.ErroresUsuario.TokenCorreoFaltanteException;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioBloqueadoLoginException;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoVerificadoException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice //hace que escuche excepciones de controller y vevuelva un JSON
public class ErrorControl {

    //Mail ya registrado
    @ExceptionHandler (CorreoRegistradoException.class) //para que el metodo se ejecute automáticamente si ocurre una excepción del tipo especificado
    public ResponseEntity<ErrorResponseDto> handleCorreoRegistrado(
        CorreoRegistradoException ex, //spring recoge el error ocurrido
        HttpServletRequest request //recoge la petición http que ha hecho el usuario, en este caso un POST a /register
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "CORREO_REGISTRADO", //código de error que he decidido definir
            ex.getMessage(), // el mensaje que vendrá en la excepción
            HttpStatus.CONFLICT.value(), // código del error - ERROR 409
            request.getRequestURI(), //la URL que el usuario estaba intentando acceder
            Instant.now() //fecha y hora actual
        );
        return ResponseEntity //devuelve la respuesta http
            .status(HttpStatus.CONFLICT)  //con estado del error
            .body(body); //y el cuepo del error creado arriba
    }

    //Nombre usuario ya registrado
    @ExceptionHandler (NombreUsuarioRegistradoException.class) 
    public ResponseEntity<ErrorResponseDto> handleNombreUsuarioRegistradoException(
        NombreUsuarioRegistradoException ex, 
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "NOMBRE_USUARIO_REGISTRADO", 
            ex.getMessage(), 
            HttpStatus.CONFLICT.value(), //ERROR 409
            request.getRequestURI(), 
            Instant.now() 
        );
        return ResponseEntity
            .status(HttpStatus.CONFLICT)  
            .body(body); 
    }

    //Usuario no encontrado
    @ExceptionHandler (UsuarioNoEncontradoException.class) 
    public ResponseEntity<ErrorResponseDto> handleUsuarioNoEncontrado(
        UsuarioNoEncontradoException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "USUARIO_NO_ENCONTRADO", 
            ex.getMessage(), 
            HttpStatus.NOT_FOUND.value(), //ERROR 404
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.NOT_FOUND) 
            .body(body); 
    }

    //Usuario Bloqueado (login)
    @ExceptionHandler (UsuarioBloqueadoLoginException.class) 
    public ResponseEntity<ErrorResponseDto> handleUsuarioBloqueadoLogin(
        UsuarioBloqueadoLoginException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "USUARIO_BLOQUEADO_LOGIN", 
            ex.getMessage(), 
            HttpStatus.LOCKED.value(), //ERROR 423
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.LOCKED) 
            .body(body); 
    }

    //Usuario no verificado
    @ExceptionHandler (UsuarioNoVerificadoException.class) 
    public ResponseEntity<ErrorResponseDto> handleUsuarioNoVerificado(
        UsuarioNoVerificadoException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "USUARIO_NO_VERIFICADO", 
            ex.getMessage(), 
            HttpStatus.FORBIDDEN.value(), //ERROR 403
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.FORBIDDEN) 
            .body(body); 
    }

    //Credenciales erroneas
    @ExceptionHandler (CredencialesErroneasException.class) 
    public ResponseEntity<ErrorResponseDto> handleCredencialesErroneas(
        CredencialesErroneasException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "CREDENCIALES_ERRONEAS", 
            ex.getMessage(), 
            HttpStatus.UNAUTHORIZED.value(), //ERROR 401
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.UNAUTHORIZED) 
            .body(body); 
    }

     //Código verificación expirado
    @ExceptionHandler (CodigoExpiradoException.class) 
    public ResponseEntity<ErrorResponseDto> handleCodigoExpirado(
        CodigoExpiradoException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "CODIGO_EXPIRADO", 
            ex.getMessage(), 
            HttpStatus.GONE.value(), //ERROR 410
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.GONE) 
            .body(body); 
    }

    //Código verificación incorrecto
    @ExceptionHandler (CodigoIncorrectoException.class) 
    public ResponseEntity<ErrorResponseDto> handleCodigoIncorrecto(
        CodigoIncorrectoException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "CODIGO_INCORRECTO", 
            ex.getMessage(), 
            HttpStatus.BAD_REQUEST.value(), //ERROR 400
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.BAD_REQUEST) 
            .body(body); 
    }

    //Cuenta ya verificada
    @ExceptionHandler (CuentaYaVerificadaException.class) 
    public ResponseEntity<ErrorResponseDto> handleCuentaYaVerificada(
        CuentaYaVerificadaException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "CUENTA_YA_VERIFICADA", 
            ex.getMessage(), 
            HttpStatus.CONFLICT.value(), //ERROR 409
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.CONFLICT) 
            .body(body); 
    }

    //Correo no existente
    @ExceptionHandler (CorreoNoCoincideException.class) 
    public ResponseEntity<ErrorResponseDto> handleCorreoNoCoincide(
        CorreoNoCoincideException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "CORREO_NO_COINCIDE", 
            ex.getMessage(), 
            HttpStatus.CONFLICT.value(), //ERROR 409
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.CONFLICT) 
            .body(body); 
    }

    //Falta token o correo
    @ExceptionHandler (TokenCorreoFaltanteException.class) 
    public ResponseEntity<ErrorResponseDto> handleTokenCorreoFaltante(
        TokenCorreoFaltanteException ex,
        HttpServletRequest request
    ) {
        ErrorResponseDto body = new ErrorResponseDto(
            "FALTA_TOKEN_O_CORREO", 
            ex.getMessage(), 
            HttpStatus.BAD_REQUEST.value(), //ERROR 400
            request.getRequestURI(),
            Instant.now() 
        );
        return ResponseEntity 
            .status(HttpStatus.BAD_REQUEST) 
            .body(body); 
    }

}
