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
import com.Up2Play.backend.DTO.VerifyEmailDto;
import com.Up2Play.backend.DTO.VerifyUserDto;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;

import jakarta.mail.MessagingException;

/**
 * Servicio principal para gestión de usuarios: CRUD, registro, autenticación y
 * verificación por email.
 * Integra encriptación de contraseñas, autenticación de Spring Security y envío
 * de emails.
 * Maneja transacciones para operaciones críticas como el registro.
 */
@Service
public class UsuarioService {

    // Dependencias inyectadas
    private UsuarioRepository usuarioRepository; // Repositorio JPA para usuarios
    private PasswordEncoder passwordEncoder; // Encriptador de contraseñas (ej: BCrypt)
    private AuthenticationManager authenticationManager; // Gestor de autenticación de Spring Security
    private EmailService emailService; // Servicio para enviar emails de verificación
    private VerificationTokenService verificationTokenService;

    /**
     * Constructor que inyecta las dependencias necesarias.
     */
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, EmailService emailService,
            VerificationTokenService verificationTokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.verificationTokenService = verificationTokenService;
    }

    /**
     * Obtiene todos los usuarios (para admin o debugging).
     * 
     * @return Lista de todos los usuarios.
     */
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * Guarda o actualiza un usuario en la base de datos.
     * 
     * @param usuario El usuario a guardar.
     * @return El usuario persistido.
     */
    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    /**
     * Elimina un usuario por ID.
     * 
     * @param id ID del usuario a eliminar.
     */
    public void deleteUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    /**
     * Registra un nuevo usuario con verificación por email.
     * Encripta la contraseña, genera código de verificación y envía email.
     * La cuenta se crea deshabilitada hasta verificación.
     * 
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
        user.setPassword(passwordEncoder.encode(input.getContraseña())); // Encripta contraseña
        user.setRol("USER"); // Rol por defecto
        user.setVerificationCode(generateVerificationCode()); // Código temporal
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15)); // Expira en 15 min
        user.setEnabled(false); // Deshabilitado hasta verificación

        // Guarda el usuario
        Usuario saved = usuarioRepository.save(user);

        // Envía email de verificación (no falla la transacción si email falla)
        try {
            sendVerificationEmail(saved);
        } catch (Exception e) {
            // TODO: Loggear error (ej: logger.warn("Fallo en envío de email", e))
            // Continúa sin romper el registro
        }

        return saved;
    }

    public void verifyEmail(VerifyEmailDto input) throws MessagingException {

        Optional<Usuario> optional = usuarioRepository.findByEmail(input.getEmail());

        if (optional.isPresent()) {

            Usuario user = optional.get();

            if (user.getEmail().equals(input.getEmail())) {

                user.setVerificationCode(generateVerificationCode());
                user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
                sendVerificationForgetPassword(user);
                usuarioRepository.save(user);

            } else {
                throw new RuntimeException("El email no coincide");
            }
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }

    }

    /**
     * Autentica un usuario durante login.
     * Verifica existencia, habilitación y credenciales via Spring Security.
     * 
     * @param input DTO con email y contraseña.
     * @return Usuario autenticado.
     * @throws RuntimeException Si no encontrado, no verificado o credenciales
     *                          inválidas.
     */
    public Usuario login(LoginUserDto input) {
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
     * 
     * @param input DTO con email y código.
     * @throws RuntimeException Si no encontrado, expirado o código incorrecto.
     */

    public void verifyUser(VerifyUserDto input) {
        Usuario user;

        // Si viene token, validamos por token
        if (input.getToken() != null && !input.getToken().isEmpty()) {
            user = verificationTokenService.validateToken(input.getToken());
        }
        // Si no hay token, validamos por email
        else if (input.getEmail() != null && !input.getEmail().isEmpty()) {
            user = usuarioRepository.findByEmail(input.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        } else {
            throw new RuntimeException("Debe proporcionar token o email");
        }

        // Verifica expiración del código
        if (user.getVerificationCodeExpiresAt() == null ||
                user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código de verificación expirado");
        }

        // Verifica código
        if (!user.getVerificationCode().equals(input.getVerificationCode())) {
            throw new RuntimeException("Código de verificación incorrecto");
        }

        // Habilita cuenta y limpia datos
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        usuarioRepository.save(user);
    }

    /**
     * Reenvía el código de verificación a un email no verificado.
     * Genera nuevo código con expiración extendida (1 hora).
     * 
     * @param email Email del usuario.
     * @throws MessagingException
     * @throws RuntimeException   Si no encontrado o ya verificado.
     */
    public void resendVerificationCode(String email) throws MessagingException {
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

        public void resendVerificationCodeForgetPsswd(String email) throws MessagingException {
        Optional<Usuario> optionalUser = usuarioRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();

            if (user.isEnabled()) {
                throw new RuntimeException("La cuenta esta verificada");
            }

            // Genera nuevo código y actualiza expiración
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationForgetPassword(user);
            usuarioRepository.save(user);
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }


    /**
     * Envía el email de verificación al usuario.
     * Usa plantilla simple con código y expiración.
     * 
     * @param user Usuario con código y datos.
     * @throws MessagingException
     */
    public void sendVerificationEmail(Usuario user) throws MessagingException {
        String subject = "Verificacion de Cuenta";
        String code = user.getVerificationCode();
        String token = verificationTokenService.createToken(user).getToken();

        String body = """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verificación de Cuenta</title>
                </head>
                <body style="margin: auto; padding: 0; background-color: #ffffffff; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #f7f7f7; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                        <tr>
                            <td style="padding: 30px;">
                                <h2 style="color: #4a4a4a; font-size: 24px; margin-bottom: 10px;">🔐 Verificación de Cuenta</h2>
                                <p style="font-size: 16px; color: #333333;">Hola <strong style="color: #555555;">%s</strong>,</p>
                                <p style="font-size: 15px; color: #555555;">Gracias por registrarte en <strong>UP2Play</strong>. Para completar tu registro, utiliza el siguiente código de verificación:</p><p style="font-size: 13px; color: #999999; margin-top: 30px;">Si no fuiste tú, puedes ignorar este mensaje de forma segura.</p>
                                <div style="margin: 20px 0; padding: 15px; background-color: #B1DF75; opacity: 0.7; border-left: 5px solid #3D6C3F; border-radius: 10px; text-align: center; font-size: 28px; font-weight: bold; color: #152614; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                                    %s
                                </div>
                                <p style="font-size: 14px; color: #777777;">Este código expira a las <strong>%s</strong>.</p>

                                <p style="font-size: 13px; color: #999999; margin-top: 30px;"><u>En caso de problemas con la pagina de verificación pulsa el boton para redirigirte a la pagina de verificar</u></p>


                                <a href="http://localhost:4200/auth/verification?token=%s"
                                style="display: inline-block; background-color: #152614; color: #f7f7f7; text-decoration: none; border-radius: 5px; padding: 10px 10px 10px 10px; width: 100%%; text-align: center; font-weight: bold; font-family: 'Segoe UI', Roboto, Arial, sans-serif; margin: auto;">
                                    Verificar Cuenta
                                </a>

                                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;">
                                <p style="font-size: 12px; color: #cccccc; text-align: center;">Este correo fue generado automáticamente. Por favor, no respondas.</p>
                                <p style="font-size: 12px; color: #cccccc; text-align: center;">© 2025 UP2Play. Todos los derechos reservados.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """
                .formatted(
                        user.getNombre_usuario() != null ? user.getNombre_usuario() : "usuario",
                        code,
                        user.getVerificationCodeExpiresAt(),
                        token);

        emailService.enviarCorreo(user.getEmail(), subject, body);
    }

    public void sendVerificationForgetPassword(Usuario user) throws MessagingException {
        String subject = "Verificacion de Email";
        String code = user.getVerificationCode();
        String token = verificationTokenService.createToken(user).getToken();

        String body = """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verificación de Cuenta</title>
                </head>
                <body style="margin: auto; padding: 0; background-color: #ffffffff; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #f7f7f7; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                        <tr>
                            <td style="padding: 30px;">
                                <h2 style="color: #4a4a4a; font-size: 24px; margin-bottom: 10px;">📥 Verificación de Email</h2>
                                <p style="font-size: 16px; color: #333333;">Hola <strong style="color: #555555;">%s</strong>,</p>
                                <p style="font-size: 15px; color: #555555;">Hemos recibido una solicitud para restablecer tu contraseña en nuestra aplicacion UP2Play. Usa el siguiente código para verificar tu identidad:</p><p style="font-size: 13px; color: #999999; margin-top: 30px;">Si no fuiste tú, puedes ignorar este mensaje de forma segura.</p>
                                <div style="margin: 20px 0; padding: 15px; background-color: #B1DF75; opacity: 0.7; border-left: 5px solid #3D6C3F; border-radius: 10px; text-align: center; font-size: 28px; font-weight: bold; color: #152614; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                                    %s
                                </div>
                                <p style="font-size: 14px; color: #777777;">Este código expira a las <strong>%s</strong>.</p>

                                <p style="font-size: 13px; color: #999999; margin-top: 30px;"><u>Si tienes problemas, también puedes hacer clic en el siguiente botón para continuar con la verificación</u></p>


                                <a href="http://localhost:4200/auth/verification?token=%s"
                                style="display: inline-block; background-color: #152614; color: #f7f7f7; text-decoration: none; border-radius: 5px; padding: 10px 10px 10px 10px; width: 100%%; text-align: center; font-weight: bold; font-family: 'Segoe UI', Roboto, Arial, sans-serif; margin: auto;">
                                    Verificar Identidad
                                </a>

                                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;">
                                <p style="font-size: 12px; color: #cccccc; text-align: center;">Este correo fue generado automáticamente. Por favor, no respondas.</p>
                                <p style="font-size: 12px; color: #cccccc; text-align: center;">© 2025 UP2Play. Todos los derechos reservados.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """
                .formatted(
                        user.getNombre_usuario() != null ? user.getNombre_usuario() : "usuario",
                        code,
                        user.getVerificationCodeExpiresAt(),
                        token);

        emailService.enviarCorreo(user.getEmail(), subject, body);
    }

    /**
     * Genera un código de verificación aleatorio de 6 dígitos.
     * 
     * @return Código como string.
     */
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000; // 100000 a 999999
        return String.valueOf(code);
    }
}
