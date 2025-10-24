package com.Up2Play.backend.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Up2Play.backend.DTO.LoginUserDto;
import com.Up2Play.backend.DTO.RegisterUserDto;
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
    /**
     * Servicio para generar y manejar tokens JWT.
     */
    private final JwtService jwtService;
    /**
     * Servicio para operaciones de usuarios (registro, autenticación,
     * verificación).
     */
    private final UsuarioService usuarioService;

    private final VerificationTokenService verificationTokenService;

    /**
     * Constructor que inyecta servicios de JWT y usuarios.
     * 
     * @param jwtService     Servicio JWT.
     * @param usuarioService Servicio de usuarios.
     */
    public AuthenticationController(JwtService jwtService, UsuarioService usuarioService,
            VerificationTokenService verificationTokenService) {
        this.jwtService = jwtService;
        this.usuarioService = usuarioService;
        this.verificationTokenService = verificationTokenService;
    }

    /**
     * Endpoint para registrar un nuevo usuario.
     * Recibe DTO con datos de registro, crea el usuario y retorna respuesta sin
     * exponer contraseña.
     * 
     * @param registerUser Dto Datos del usuario a registrar.
     * @return ResponseEntity con DTO de usuario registrado (status 201).
     */
    @PostMapping("/signup") // ← corregido
    public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto) {
        Usuario registrado = usuarioService.signup(registerUserDto); // ← corregido
        // Mapea a un DTO de respuesta para no exponer contraseña
        var response = new UsuarioResponseDto(
                registrado.getId(),
                registrado.getEmail(),
                registrado.getNombre_usuario(),
                registrado.isEnabled());
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/registrado")
    public String usuarioRegistrado() {

        return "http://localhost:4200";
    }

    /**
     * Endpoint para autenticar usuario (login).
     * Valida credenciales, genera token JWT y retorna respuesta con token y tiempo
     * de expiración.
     * 
     * @param loginUser Dto Datos de login (email y contraseña).
     * @return ResponseEntity con LoginResponse (token JWT).
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        Usuario usuario = usuarioService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(usuario);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    /**
     * Endpoint para verificar cuenta de usuario con código.
     * Procesa verificación y habilita la cuenta.
     * 
     * @param verifyUser Dto DTO con email y código de verificación.
     * @return ResponseEntity con mensaje de éxito.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        usuarioService.verifyUser(verifyUserDto);
        return ResponseEntity.ok(Map.of("message", "Cuenta verificada"));
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

    /**
     * Endpoint para reenviar código de verificación por email.
     * 
     * @param email Email del usuario.
     * @return ResponseEntity con mensaje de éxito.
     * @throws MessagingException
     */
    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) throws MessagingException {
        usuarioService.resendVerificationCode(email);
        return ResponseEntity.ok("Se ha vuelto a enviar el código");
    }

    /**
     * Record DTO simple para respuesta de registro: evita exponer datos sensibles
     * como contraseña.
     * 
     * @param id            ID del usuario.
     * @param email         Email del usuario.
     * @param nombreUsuario Nombre de usuario.
     * @param enabled       Estado de habilitación.
     */
    public record UsuarioResponseDto(Long id, String email, String nombreUsuario, boolean enabled) {
    }
}
