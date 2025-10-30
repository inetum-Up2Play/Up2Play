package com.Up2Play.backend.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Up2Play.backend.DTO.LoginUserDto;
import com.Up2Play.backend.DTO.NewPasswordDto;
import com.Up2Play.backend.DTO.RegisterUserDto;
import com.Up2Play.backend.DTO.ResendVerificationDto;
import com.Up2Play.backend.DTO.VerifyEmailDto;
import com.Up2Play.backend.DTO.VerifyUserDto;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Responses.LoginResponse;
import com.Up2Play.backend.Service.JwtService;
import com.Up2Play.backend.Service.UsuarioService;
import com.Up2Play.backend.Service.VerificationTokenService;

import jakarta.mail.MessagingException;

/**
 * Controlador REST para manejar autenticación de usuarios: registro, login,
 * verificación y reenvío de códigos.
 * Utiliza servicios para procesar lógica de negocio y JWT para tokens de
 * sesión.
 */
@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    
    //Inyección servicios
    private final JwtService jwtService;
    private final UsuarioService usuarioService;
    private final VerificationTokenService verificationTokenService;

    
    //Constructor que inyecta servicios de JWT y usuarios.
    public AuthenticationController(JwtService jwtService, UsuarioService usuarioService,
            VerificationTokenService verificationTokenService) {
        this.jwtService = jwtService;
        this.usuarioService = usuarioService;
        this.verificationTokenService = verificationTokenService;
    }

    /*
     * Endpoint para registrar un nuevo usuario.
     * Recibe DTO con datos de registro, crea el usuario y retorna respuesta sin
     * exponer contraseña.
    */
    @PostMapping("/signup") 
    public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto) {
        Usuario registrado = usuarioService.signup(registerUserDto);
        // Mapea a un DTO de respuesta para no exponer contraseña
        var response = new UsuarioResponseDto(
                registrado.getId(),
                registrado.getEmail(),
                registrado.getNombreUsuario(),
                registrado.isEnabled());
        return ResponseEntity.status(201).body(response);
    }

    /*
     * Endpoint para autenticar usuario (login).
     * Valida credenciales, genera token JWT y retorna respuesta con token y tiempo de expiración.
    */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginUserDto loginUserDto) {
        Usuario usuario = usuarioService.login(loginUserDto);
        String jwtToken = jwtService.generateToken(usuario);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    /**
     * Endpoint para verificar cuenta de usuario con código.
     * Procesa verificación y habilita la cuenta.
    */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        usuarioService.verifyUser(verifyUserDto);
        return ResponseEntity.ok(Map.of("message", "Cuenta verificada"));
    }

    @PostMapping("/verifyEmail")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyEmailDto verifyEmailDto) throws MessagingException{
        usuarioService.verifyEmail(verifyEmailDto);
        return ResponseEntity.ok(Map.of("message", "Email verificado"));
    }
    
        @GetMapping("/validate-token")
    public ResponseEntity<Map<String, String>> validateToken(@RequestParam String token) {
        try {
            Usuario usuario = verificationTokenService.validateToken(token);
            return ResponseEntity.ok(Map.of("email", usuario.getEmail()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    //Endpoint para reenviar código de verificación por email.
    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestBody ResendVerificationDto resendVerificationDto) throws MessagingException {
        usuarioService.resendVerificationCode(resendVerificationDto.getEmail());
        return ResponseEntity.ok(Map.of("message","Se ha vuelto a enviar el código"));
    }

    @PostMapping("/resendEmail")
    public ResponseEntity<?> resendVerificationCodeForgetPsswd(@RequestBody ResendVerificationDto resendVerificationDto) throws MessagingException {
        usuarioService.resendVerificationCodeForgetPsswd(resendVerificationDto.getEmail());
        return ResponseEntity.ok(Map.of("message","Se ha vuelto a enviar el código"));
    }

    //Record DTO simple para respuesta de registro: evita exponer datos sensibles.
    public record UsuarioResponseDto(Long id, String email, String nombreUsuario, boolean enabled) {
    }

    //Endpoint que verifica el código de verificación para recuperar contraseña
    @PostMapping("/verifyForgetPassword")
    public ResponseEntity<?>verifyCodeNewPassword(@RequestBody VerifyEmailDto verifyEmailDto){
        usuarioService.verifyCodeNewPassword(verifyEmailDto);
        return ResponseEntity.ok(Map.of("message", "Código verificado correctamente"));
    }

    //Endpoint guardar nueva contaseña
    @PostMapping("/saveNewPassword")
    public ResponseEntity<?>saveNewPassword(@RequestBody NewPasswordDto newPasswordDto){
        usuarioService.saveNewPassword(newPasswordDto);
        return ResponseEntity.ok(Map.of("message","Contraseña guardada correctamente"));
    }
}

