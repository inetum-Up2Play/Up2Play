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

import com.Up2Play.backend.DTO.CambiarPasswordDto;
import com.Up2Play.backend.DTO.LoginUserDto;
import com.Up2Play.backend.DTO.NewPasswordDto;
import com.Up2Play.backend.DTO.RegisterUserDto;
import com.Up2Play.backend.DTO.VerifyEmailDto;
import com.Up2Play.backend.DTO.VerifyUserDto;
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
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Perfil;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.enums.EstadoNotificacion;
import com.Up2Play.backend.Repository.ActividadRepository;
import com.Up2Play.backend.Repository.NotificacionRepository;
import com.Up2Play.backend.Repository.PerfilRepository;
import com.Up2Play.backend.Repository.UsuarioNotificacionRepository;
import com.Up2Play.backend.Repository.UsuarioRepository;

import jakarta.mail.MessagingException;

// Servicio principal para gestión de usuarios: CRUD, registro, verificación mediante JWT, inicio de sesión y cambio de contraseña.

@Service
public class UsuarioService {

    // Dependencias inyectadas
    private UsuarioRepository usuarioRepository; // Repositorio JPA para usuarios
    private PasswordEncoder passwordEncoder; // Encriptador de contraseñas (ej: BCrypt)
    private AuthenticationManager authenticationManager; // Gestor de autenticación de Spring Security
    private EmailService emailService; // Servicio para enviar emails de verificación
    private LoginAttemptService loginAttemptService; // servicio para limitar intentos en inicio de sesión
    private VerificationTokenService verificationTokenService;
    private PerfilService perfilService;
    private PerfilRepository perfilRepository;
    private ActividadService actividadService;
    private ActividadRepository actividadRepository;
    private NotificacionService notificacionService;
    private final NotificacionRepository notificacionRepository;
    private final UsuarioNotificacionRepository usuarioNotificacionRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, EmailService emailService,
            LoginAttemptService loginAttemptService, VerificationTokenService verificationTokenService,
            PerfilService perfilService, PerfilRepository perfilRepository, ActividadService actividadService,
            ActividadRepository actividadRepository, NotificacionService notificacionService,
            NotificacionRepository notificacionRepository,
            UsuarioNotificacionRepository usuarioNotificacionRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.loginAttemptService = loginAttemptService;
        this.verificationTokenService = verificationTokenService;
        this.perfilService = perfilService;
        this.perfilRepository = perfilRepository;
        this.actividadService = actividadService;
        this.actividadRepository = actividadRepository;
        this.notificacionService = notificacionService;
        this.notificacionRepository = notificacionRepository;
        this.usuarioNotificacionRepository = usuarioNotificacionRepository;
    }

    // Obtiene todos los usuarios en una lista
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Guarda o actualiza un usuario en la base de datos.
    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Elimina un usuario por ID.
    @Transactional
    public void deleteUsuario(Long id) throws MessagingException {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // eliminar usuario de las actividades en las que esta inscrito
        List<Actividad> actividades = actividadRepository.findAll();
        
        for (Actividad act : actividades) {
            if (!act.getUsuarioCreador().equals(usuario)) {

                act.getUsuarios().removeIf(u -> u.getId().equals(id));
                act.setNumPersInscritas(act.getNumPersInscritas() - 1);
                actividadRepository.save(act);

            } else {
                actividadService.deleteActividad(act.getId(), usuario.getId());
            }

        }

        if (usuario.getPerfil() != null) {
            Perfil perfil = usuario.getPerfil();
            usuario.setPerfil(null); // rompe la relación en el grafo
            perfilRepository.delete(perfil); // borra el perfil existente (managed)
        }

        usuarioRepository.deleteToken(usuario.getId());
        usuarioRepository.delete(usuario);

    }

    /**
     * Registra un nuevo usuario con verificación por email.
     * Encripta la contraseña, genera código de verificación y envía email.
     * La cuenta se crea deshabilitada hasta verificación.
     **/
    @Transactional
    public Usuario signup(RegisterUserDto input) {
        // Verifica si el email ya está registrado
        if (usuarioRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new CorreoRegistradoException("El email ya está registrado");
        }

        // Verifica si nombre de usuario ya está registrado
        if (usuarioRepository.findByNombreUsuario(input.getNombre_usuario()).isPresent()) {
            throw new NombreUsuarioRegistradoException("El nombre de usuario ya está registrado");
        }

        // Crea y configura el nuevo usuario
        Usuario user = new Usuario();
        user.setEmail(input.getEmail());

        user.setNombreUsuario(input.getNombre_usuario());
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

        }

        return saved;
    }

    // Verifica el código de verificación para habilitar la cuenta.
    public void verifyUser(VerifyUserDto input) {
        Usuario user;

        // Si viene token, validamos por token
        if (input.getToken() != null && !input.getToken().isEmpty()) {
            user = verificationTokenService.validateToken(input.getToken());
        }
        // Si no hay token, validamos por email
        else if (input.getEmail() != null && !input.getEmail().isEmpty()) {
            user = usuarioRepository.findByEmail(input.getEmail())
                    .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        } else {
            throw new TokenCorreoFaltanteException("Debe proporcionar token o email");
        }

        // Verifica expiración del código
        if (user.getVerificationCodeExpiresAt() == null ||
                user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CodigoExpiradoException("Código de verificación expirado");
        }

        // Verifica código
        if (!user.getVerificationCode().equals(input.getVerificationCode())) {
            throw new CodigoIncorrectoException("Código de verificación incorrecto");
        }

        // Habilita cuenta y limpia datos
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        perfilService.crearPerfil(user);
        usuarioRepository.save(user);

        try {
            mailRegistro(user);
        } catch (Exception e) {

        }

    }

    // Autentica un usuario durante login.
    public Usuario login(LoginUserDto input) {
        // Busca usuario por email
        Usuario user = usuarioRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // Verifica si está habilitado
        if (!user.isEnabled()) {
            throw new UsuarioNoVerificadoException("Usuario no verificado");
        }

        // verificar si el usuario esta bloqueado
        if (loginAttemptService.isBlocked(input.getEmail())) {
            throw new UsuarioBloqueadoLoginException("Demasiados intentos fallidos, tu cuenta ha sido bloqueada "
                    + LoginAttemptService.getMaxAttempts() + " min. Inténtalo de nuevo más tarde.");
        }

        // Autentica credenciales
        try { // intenta autentificar, si lo consigue borra la cache de intentos de inicio de
              // sesion y devuelve el usuario
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));

            loginAttemptService.loginSucceeded(input.getEmail());

            return user;

            // si no lo consigue, añade un intento de inicio de sesión
        } catch (Exception e) {
            loginAttemptService.loginFailed(input.getEmail());
            throw new CredencialesErroneasException("Credenciales erróneas");
        }
    }

    // Envía el email de verificación al usuario. Usa plantilla simple con código y
    // expiración.
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
                        user.getNombreUsuario() != null ? user.getNombreUsuario() : "usuario",
                        code,
                        user.getVerificationCodeExpiresAt(),
                        token);

        emailService.enviarCorreo(user.getEmail(), subject, body);
    }

    // Reenviar código de verificación
    public void resendVerificationCode(String email) throws MessagingException {
        Optional<Usuario> optionalUser = usuarioRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();

            if (user.isEnabled()) {
                throw new CuentaYaVerificadaException("La cuenta ya está verificada");
            }

            // Genera nuevo código y actualiza expiración
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(user);
            usuarioRepository.save(user);
        } else {
            throw new UsuarioNoEncontradoException("Usuario no encontrado");
        }
    }

    // Genera un código de verificación aleatorio de 6 dígitos.
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000; // 100000 a 999999
        return String.valueOf(code);
    }

    // ---------------FUNCIÓN RECUPERAR CONTRASEÑA---------------

    /*
     * Verifica el email para el restablecimiento de la contraseña y utiliza método
     * "sendVerificationForgetPassword" de abajo para enviar el código ese correo
     */
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
                throw new CorreoNoCoincideException("El email no coincide");
            }
        } else {
            throw new UsuarioNoEncontradoException("Usuario no encontrado");
        }

    }

    // Envia el código de verificación para recuperar la contraseña
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


                                <a href="http://localhost:4200/auth/verification-password?token=%s"
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
                        user.getNombreUsuario() != null ? user.getNombreUsuario() : "usuario",
                        code,
                        user.getVerificationCodeExpiresAt(),
                        token);

        emailService.enviarCorreo(user.getEmail(), subject, body);
    }

    // Envia el código de verificación para recuperar la contraseña
    public void mailRegistro(Usuario user) throws MessagingException {
        String subject = "Registro en UP2Play";

        String body = """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Registro en UP2Play</title>
                </head>
                <body style="margin: auto; padding: 0; background-color: #ffffffff; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #f7f7f7; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                        <tr>
                            <td style="padding: 30px;">
                                <h2 style="color: #4a4a4a; font-size: 24px; margin-bottom: 10px;">😁 Te has registrado</h2>
                                <p style="font-size: 16px; color: #333333;">Hola <strong style="color: #555555;">%s</strong>,¡Bienvenidx a <strong style="color: #555555;">UP2Play</strong>!</p>
                                <p style="font-size: 15px; color: #555555;">Ya formas parte de nuestra comunidad, donde podrás crear tus propios planes o unirte a los que más te interesen. Explora, conecta y empieza a disfrutar del deporte con otros apasionados como tú.</p><p style="font-size: 13px; color: #999999; margin-top: 30px;">Si no fuiste tú, contacta con el servicio de soporte de nuestra aplicación.</p>

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
                        user.getNombreUsuario() != null ? user.getNombreUsuario() : "usuario");

        emailService.enviarCorreo(user.getEmail(), subject, body);
    }

    // Reenvia el código de verificación para recuperar la contraseña
    public void resendVerificationCodeForgetPsswd(String email) throws MessagingException {
        Optional<Usuario> optionalUser = usuarioRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();

            if (!user.isEnabled()) {
                throw new UsuarioNoVerificadoException("La cuenta no está verificada");
            }

            // Genera nuevo código y actualiza expiración
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationForgetPassword(user);
            usuarioRepository.save(user);
        } else {
            throw new UsuarioNoEncontradoException("Usuario no encontrado");
        }
    }

    // Verificar código para cambiar contraseña
    public void verifyCodeNewPassword(VerifyEmailDto input) {
        Usuario user;

        // Validar por token, si es que se ha rellenado el campo
        if (input.getToken() != null && !input.getToken().isEmpty()) {
            user = verificationTokenService.validateToken(input.getToken()); // devuleve el usuario asociado a ese token
        }
        // Si no hay token, validamos por email
        else if (input.getEmail() != null && !input.getEmail().isEmpty()) {
            user = usuarioRepository.findByEmail(input.getEmail())
                    .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        } else {
            throw new TokenCorreoFaltanteException("Debe proporcionar el token");
        }

        // Verificar expiración del código
        if (user.getVerificationCodeExpiresAt() == null ||
                user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CodigoExpiradoException("Código de verificación expirado");
        }

        // Verificar que el código es correcto
        if (!user.getVerificationCode().equals(input.getVerificationCode())) {
            throw new CodigoIncorrectoException("Código de verificación incorrecto");
        }

        // Limpia código
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        usuarioRepository.save(user);
    }

    // Guardar nueva constraseña en la base de datos
    public void saveNewPassword(NewPasswordDto input) {

        Optional<Usuario> optional = usuarioRepository.findByEmail(input.getEmail());

        if (optional.isPresent()) {

            Usuario user = optional.get();

            if (user.getEmail().equals(input.getEmail())) {
                user.setPassword(passwordEncoder.encode(input.getPassword()));
                usuarioRepository.save(user);
                // Enviar notificacion
                notificacionService.crearNotificacionPerfil(
                        "Tu constraseña se ha cambiado correctamente.",
                        "Tu contraseña se ha cambiado correctamente. Si no has realizado este cambio, contacta con nuestro equipo de soporte de inmediato para proteger tu cuenta.",
                        LocalDateTime.now(),
                        EstadoNotificacion.fromValue("ACTUALIZADO"),
                        null,
                        user);

            }

        }

    }

    // Cambiar contraseña desde el perfil
    public void cambiarPasswordPerfil(Long usuarioId, CambiarPasswordDto input) throws MessagingException {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // Verificar contraseña antigua
        if (!passwordEncoder.matches(input.getOldPassword(), usuario.getPassword())) {
            throw new CredencialesErroneasException("Contraseña incorrecta");
        }

        // Guardar la nueva contraseña encriptada
        usuario.setPassword(passwordEncoder.encode(input.getNewPassword()));
        notificacionService.cambioDeContraseña(usuario);
        usuarioRepository.save(usuario);

        // Enviar notificacion

        notificacionService.crearNotificacionPerfil(
                "Tu constraseña se ha cambiado correctamente.",
                "Tu contraseña se ha cambiado correctamente. Si no has realizado este cambio, contacta con nuestro equipo de soporte de inmediato para proteger tu cuenta.",
                LocalDateTime.now(),
                EstadoNotificacion.fromValue("ACTUALIZADO"),
                null,
                usuario);

    }

}
