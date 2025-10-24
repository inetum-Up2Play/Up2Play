package com.Up2Play.backend.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Up2Play.backend.DTO.LoginUserDto;
import com.Up2Play.backend.DTO.RegisterUserDto;
import com.Up2Play.backend.DTO.VerifyUserDto;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;

/**
 * Servicio principal para gestión de usuarios: CRUD, registro, autenticación y verificación por email.
 * Integra encriptación de contraseñas, autenticación de Spring Security y envío de emails.
 * Maneja transacciones para operaciones críticas como el registro.
 */
@Service
public class UsuarioService {

    // Dependencias inyectadas
    private UsuarioRepository usuarioRepository;  // Repositorio JPA para usuarios
    private PasswordEncoder passwordEncoder;  // Encriptador de contraseñas (ej: BCrypt)
    private AuthenticationManager authenticationManager;  // Gestor de autenticación de Spring Security
    private EmailService emailService;  // Servicio para enviar emails de verificación

    /**
     * Constructor que inyecta las dependencias necesarias.
     */
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    /**
     * Obtiene todos los usuarios (para admin o debugging).
     * @return Lista de todos los usuarios.
     */
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * Guarda o actualiza un usuario en la base de datos.
     * @param usuario El usuario a guardar.
     * @return El usuario persistido.
     */
    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    /**
     * Elimina un usuario por ID.
     * @param id ID del usuario a eliminar.
     */
    public void deleteUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    /**
     * Registra un nuevo usuario con verificación por email.
     * Encripta la contraseña, genera código de verificación y envía email.
     * La cuenta se crea deshabilitada hasta verificación.
     * @param input DTO con datos de registro.
     * @return Usuario registrado (deshabilitado).
     * @throws RuntimeException Si el email ya existe.
     */
    @Transactional
    public Usuario signup(RegisterUserDto input) {
        // Verifica si el email ya está registrado
        if (usuarioRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crea y configura el nuevo usuario
        Usuario user = new Usuario();
        user.setEmail(input.getEmail());
        user.setNombre_usuario(input.getNombre_usuario());
        user.setPassword(passwordEncoder.encode(input.getContraseña()));  // Encripta contraseña
        user.setRol("USER");  // Rol por defecto
        user.setVerificationCode(generateVerificationCode());  // Código temporal
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));  // Expira en 15 min
        user.setEnabled(false);  // Deshabilitado hasta verificación

        // Guarda el usuario
        Usuario saved = usuarioRepository.save(user);

        // Envía email de verificación (no falla la transacción si email falla)
        try {
            sendVerificationEmail(saved);
        } catch (Exception e) {
            // Continúa sin romper el registro
        }

        return saved;
    }

    /**
     * Autentica un usuario durante login.
     * Verifica existencia, habilitación y credenciales via Spring Security.
     * @param input DTO con email y contraseña.
     * @return Usuario autenticado.
     * @throws RuntimeException Si no encontrado, no verificado o credenciales inválidas.
     */
    public Usuario authenticate(LoginUserDto input) {
        // Busca usuario por email
        Usuario user = usuarioRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verifica si está habilitado
        if (!user.isEnabled()) {
            throw new RuntimeException("Usuario no verificado");
        }

        // Autentica credenciales (lanza excepción si inválidas)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));

        return user;
    }

    /**
     * Verifica el código de verificación para habilitar la cuenta.
     * @param input DTO con email y código.
     * @throws RuntimeException Si no encontrado, expirado o código incorrecto.
     */
    public void verifyUser(VerifyUserDto input) {
        Optional<Usuario> optionalUser = usuarioRepository.findByEmail(input.getEmail());

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();

            // Verifica expiración
            if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Codigo de verificacion expirado");
            }

            // Verifica código
            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                // Habilita cuenta y limpia código
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);
                usuarioRepository.save(user);
            } else {
                throw new RuntimeException("Codigo de verificacion incorrecto");
            }
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    /**
     * Reenvía el código de verificación a un email no verificado.
     * Genera nuevo código con expiración extendida (1 hora).
     * @param email Email del usuario.
     * @throws RuntimeException Si no encontrado o ya verificado.
     */
    public void resendVerificationCode(String email) {
        Optional<Usuario> optionalUser = usuarioRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();

            if (user.isEnabled()) {
                throw new RuntimeException("La cuenta esta verificada");
            }

            // Genera nuevo código y actualiza expiración
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(user);
            usuarioRepository.save(user);
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    /**
     * Envía el email de verificación al usuario.
     * Usa plantilla simple con código y expiración.
     * @param user Usuario con código y datos.
     */
    public void sendVerificationEmail(Usuario user) {
        String subject = "Verificacion de Cuenta";
        String code = user.getVerificationCode();

        // Plantilla de email con código y expiración
        String body = """
                Hola %s,

                Tu código de verificación es: %s
                Este código expira a las %s.

                Si no fuiste tú, ignora este mensaje.
                """.formatted(
                user.getNombre_usuario() != null ? user.getNombre_usuario() : "usuario",
                code,
                user.getVerificationCodeExpiresAt());

        emailService.enviarCorreo(user.getEmail(), subject, body);
    }

    /**
     * Genera un código de verificación aleatorio de 6 dígitos.
     * @return Código como string.
     */
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;  // 100000 a 999999
        return String.valueOf(code);
    }
}
