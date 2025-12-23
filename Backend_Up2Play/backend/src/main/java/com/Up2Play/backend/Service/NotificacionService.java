package com.Up2Play.backend.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Up2Play.backend.DTO.Respuestas.NotificacionDtoResp;
import com.Up2Play.backend.Exception.ErroresNotificacion.NotificacionNoEncontrada;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Notificacion;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.UsuarioNotificacion;
import com.Up2Play.backend.Model.enums.EstadoNotificacion;
import com.Up2Play.backend.Repository.NotificacionRepository;
import com.Up2Play.backend.Repository.UsuarioNotificacionRepository;
import com.Up2Play.backend.Repository.UsuarioRepository;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class NotificacionService {

    private UsuarioRepository usuarioRepository;
    private NotificacionRepository notificacionRepository;
    private UsuarioNotificacionRepository usuarioNotificacionRepository;
    private EmailService emailService;

    // CRUD

    @Transactional
    public List<NotificacionDtoResp> getNotificacionesUsuario(Long usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // Crido a usuarioNotificaciones(taula M:N) per obtenir les notificacions de
        // l'usuari
        return usuario.getUsuarioNotificaciones().stream().map(n -> new NotificacionDtoResp(

                n.getNotificacion().getId(),
                n.getNotificacion().getTitulo(),
                n.getNotificacion().getDescripcion(),
                n.getNotificacion().getFecha() != null ? n.getNotificacion().getFecha().toString()
                        : null,
                n.isLeido(),
                n.getNotificacion().getEstadoNotificacion().toString(),
                n.getNotificacion().getActividad().getId())).toList();

    }

    public NotificacionService(UsuarioRepository usuarioRepository, NotificacionRepository notificacionRepository,
            UsuarioNotificacionRepository usuarioNotificacionRepository, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.notificacionRepository = notificacionRepository;
        this.usuarioNotificacionRepository = usuarioNotificacionRepository;
        this.emailService = emailService;
    }

    @Transactional
    public List<NotificacionDtoResp> getNotificacionesUsuarioNoLeidas(Long usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // Crido a usuarioNotificaciones(taula M:N) per obtenir les notificacions de
        // l'usuari
        return usuario.getUsuarioNotificaciones().stream().filter(n -> !n.isLeido())
                .map(n -> new NotificacionDtoResp(

                        n.getNotificacion().getId(),
                        n.getNotificacion().getTitulo(),
                        n.getNotificacion().getDescripcion(),
                        n.getNotificacion().getFecha() != null
                                ? n.getNotificacion().getFecha().toString()
                                : null,
                        n.isLeido(),
                        n.getNotificacion().getEstadoNotificacion().toString(),
                        n.getNotificacion().getActividad().getId()))
                .toList();
    }

    @Transactional
    public List<NotificacionDtoResp> getNotificacionesUsuarioLeidas(Long usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // Crido a usuarioNotificaciones(taula M:N) per obtenir les notificacions de
        // l'usuari
        return usuario.getUsuarioNotificaciones().stream().filter(n -> n.isLeido())
                .map(n -> new NotificacionDtoResp(

                        n.getNotificacion().getId(),
                        n.getNotificacion().getTitulo(),
                        n.getNotificacion().getDescripcion(),
                        n.getNotificacion().getFecha() != null
                                ? n.getNotificacion().getFecha().toString()
                                : null,
                        n.isLeido(),
                        n.getNotificacion().getEstadoNotificacion().toString(),
                        n.getNotificacion().getActividad().getId()))
                .toList();
    }

    @Transactional
    public Notificacion crearNotificacion(String titulo, String descripcion, LocalDateTime fecha,
            EstadoNotificacion estadoNotificacion, Actividad actividad, Set<Usuario> usuarios,
            Usuario usuarioCreador) {

        // Creo instancia de notificacion
        Notificacion n = new Notificacion();

        n.setTitulo(titulo);
        n.setDescripcion(descripcion);
        n.setFecha(fecha);
        n.setEstadoNotificacion(estadoNotificacion);
        n.setActividad(actividad);
        n.setUsuarioCreador(usuarioCreador);

        // La guardo
        Notificacion notificacionGuardada = notificacionRepository.save(n);

        // Creo una lista de UsuarioNotificacion per cada usuario en la tabla M:N
        List<UsuarioNotificacion> enlaces = usuarios.stream()
                .map(u -> {
                    UsuarioNotificacion un = new UsuarioNotificacion();
                    un.setUsuario(u);
                    un.setNotificacion(notificacionGuardada);
                    un.setLeido(false);
                    return un;
                })
                .toList();

        // Guardo la lista en la base de datos
        usuarioNotificacionRepository.saveAll(enlaces);

        return notificacionGuardada;
    }

    @Transactional
    public Notificacion crearNotificacionPerfil(String titulo, String descripcion, LocalDateTime fecha,
            EstadoNotificacion estadoNotificacion, Actividad actividad, Usuario usuarioCreador) {

        // Creo instancia de notificacion
        Notificacion n = new Notificacion();

        n.setTitulo(titulo);
        n.setDescripcion(descripcion);
        n.setFecha(fecha);
        n.setEstadoNotificacion(estadoNotificacion);
        n.setActividad(actividad);
        n.setUsuarioCreador(usuarioCreador);

        // La guardo
        Notificacion notificacionGuardada = notificacionRepository.save(n);

        UsuarioNotificacion usuarioNotificacion = new UsuarioNotificacion(usuarioCreador, notificacionGuardada, false);

        // Guardo la lista en la base de datos
        usuarioNotificacionRepository.save(usuarioNotificacion);

        return notificacionGuardada;
    }

    @Transactional
    public Boolean LeerNotificacion(Long notificaionId, Long usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        Notificacion notificacion = notificacionRepository.findById(notificaionId)
                .orElseThrow(() -> new NotificacionNoEncontrada("Notificación no encontrada"));

        UsuarioNotificacion usuarioNotificacion = usuarioNotificacionRepository.findByUsuarioAndNotificacion(
                usuario,
                notificacion);

        usuarioNotificacion.setLeido(true);

        usuarioNotificacionRepository.save(usuarioNotificacion);

        return true;
    }

    // Envía el email de verificación al usuario. Usa plantilla simple con código y
    // expiración.
    public void cambioDeContraseña(Usuario user) throws MessagingException {
        String subject = "Cambio de contraseña";

        String body = """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cambio de contraseña</title>
                </head>
                <body style="margin: auto; padding: 0; background-color: #ffffffff; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #f7f7f7; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                        <tr>
                            <td style="padding: 30px;">
                                <h2 style="color: #4a4a4a; font-size: 24px; margin-bottom: 10px;">🔐 Se ha cambiado tu contraseña</h2>
                                <p style="font-size: 16px; color: #333333;">Hola <strong style="color: #555555;">%s</strong>,</p>
                                <p style="font-size: 15px; color: #555555;">Este es un correo de aviso, ya que se ha cambiado tu contraseña en <strong>UP2Play</strong>.</p><p style="font-size: 13px; color: #999999; margin-top: 30px;">Si no fuiste tú, contacta con el soporte de la aplicacion!.</p>
                                <a href="http://localhost:4200/"
                                style="display: inline-block; background-color: #152614; color: #f7f7f7; text-decoration: none; border-radius: 5px; padding: 10px 10px 10px 10px; width: 100%%; text-align: center; font-weight: bold; font-family: 'Segoe UI', Roboto, Arial, sans-serif; margin: auto;">
                                    Ir a UP2Play
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
                        user.getNombreUsuario() != null ? user.getNombreUsuario() : "usuario");

        emailService.enviarCorreo(user.getEmail(), subject, body);
    }

    // En NotificacionService
    public void ActividadEditada(Actividad actividad, List<String> emails) throws MessagingException {
        String subject = "Actividad editada";

        String htmlTemplate = """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Actividad editada</title>
                </head>
                <body style="margin: auto; padding: 0; background-color: #ffffffff; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #f7f7f7; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                        <tr>
                            <td style="padding: 30px;">
                                <h2 style="color: #4a4a4a; font-size: 24px; margin-bottom: 10px;">✏️ Se ha editado una actividad</h2>
                                <p style="font-size: 16px; color: #333333;">Hola <strong style="color: #555555;">%s</strong>,</p>
                                <p style="font-size: 15px; color: #555555;">
                                    Este es un correo de aviso, ya que se ha editado la actividad:
                                    <strong>%s</strong> a la que estás apuntado en <strong>UP2Play</strong>.
                                </p>
                                <p style="font-size: 13px; color: #999999; margin-top: 30px;">
                                    Si no fuiste tú, contacta con el soporte de la aplicación.
                                </p>
                                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;">
                                <a href="http://localhost:4200/"
                                   style="display: inline-block; background-color: #152614; color: #f7f7f7; text-decoration: none; border-radius: 5px; padding: 10px; width: 100%%; text-align: center; font-weight: bold;">
                                    Ir a UP2Play
                                </a>
                                <p style="font-size: 12px; color: #cccccc; text-align: center;">Este correo fue generado automáticamente. Por favor, no respondas.</p>
                                <p style="font-size: 12px; color: #cccccc; text-align: center;">© 2025 UP2Play. Todos los derechos reservados.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """;

        // Construye un mapa email → nombre a partir de la actividad
        Map<String, String> nombresPorEmail = actividad.getUsuarios().stream()
                .filter(u -> u.getEmail() != null)
                .collect(Collectors.toMap(
                        Usuario::getEmail,
                        u -> u.getNombreUsuario() != null ? u.getNombreUsuario() : "usuario"));

        for (String email : emails) {
            String nombre = nombresPorEmail.getOrDefault(email, "usuario");
            String body = String.format(htmlTemplate, nombre, actividad.getNombre());
            emailService.enviarCorreo(email, subject, body);
        }
    }

    
    // En NotificacionService
    public void ActividadEliminada(Actividad actividad, List<String> emails) throws MessagingException {
        String subject = "Actividad eliminada";

        String htmlTemplate = """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Actividad eliminada</title>
                </head>
                <body style="margin: auto; padding: 0; background-color: #ffffffff; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #f7f7f7; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                        <tr>
                            <td style="padding: 30px;">
                                <h2 style="color: #4a4a4a; font-size: 24px; margin-bottom: 10px;">🗑️ Se ha eliminado una actividad</h2>
                                <p style="font-size: 16px; color: #333333;">Hola <strong style="color: #555555;">%s</strong>,</p>
                                <p style="font-size: 15px; color: #555555;">Este es un correo de aviso, ya que se ha eliminado la actividad: <strong>%s</strong> a la que estas apuntado en <strong>UP2Play</strong>.</p><p style="font-size: 13px; color: #999999; margin-top: 30px;">Si no fuiste tú, contacta con el soporte de la aplicacion!.</p>
                                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;">
                                <a href="http://localhost:4200/"
                                style="display: inline-block; background-color: #152614; color: #f7f7f7; text-decoration: none; border-radius: 5px; padding: 10px 10px 10px 10px; width: 100%%; text-align: center; font-weight: bold; font-family: 'Segoe UI', Roboto, Arial, sans-serif; margin: auto;">
                                    Ir a UP2Play
                                </a>
                                <p style="font-size: 12px; color: #cccccc; text-align: center;">Este correo fue generado automáticamente. Por favor, no respondas.</p>
                                <p style="font-size: 12px; color: #cccccc; text-align: center;">© 2025 UP2Play. Todos los derechos reservados.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """;

        // Construye un mapa email → nombre a partir de la actividad
        Map<String, String> nombresPorEmail = actividad.getUsuarios().stream()
                .filter(u -> u.getEmail() != null)
                .collect(Collectors.toMap(
                        Usuario::getEmail,
                        u -> u.getNombreUsuario() != null ? u.getNombreUsuario() : "usuario"));

        for (String email : emails) {
            String nombre = nombresPorEmail.getOrDefault(email, "usuario");
            String body = String.format(htmlTemplate, nombre, actividad.getNombre());
            emailService.enviarCorreo(email, subject, body);
        }
    }

    @Transactional
    public Boolean EliminarNotificacion(Long notificaionId, Long usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        Notificacion notificacion = notificacionRepository.findById(notificaionId)
                .orElseThrow(() -> new NotificacionNoEncontrada("Notificación no encontrada"));

        UsuarioNotificacion usuarioNotificacion = usuarioNotificacionRepository.findByUsuarioAndNotificacion(
                usuario,
                notificacion);

        usuarioNotificacionRepository.deleteById(usuarioNotificacion.getId());

        return true;

    }
}
