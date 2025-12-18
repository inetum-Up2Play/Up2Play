package com.Up2Play.backend.Controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.Up2Play.backend.DTO.Respuestas.NotificacionDtoResp;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;
import com.Up2Play.backend.Service.NotificacionService;
import jakarta.transaction.Transactional;
//import java.time.LocalDateTime;
//import com.Up2Play.backend.Repository.ActividadRepository;

@RestController
@RequestMapping("/notificaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificacionController {

    private final NotificacionService notificacionService;
    private final UsuarioRepository usuarioRepository;

    public NotificacionController(NotificacionService notificacionService, UsuarioRepository usuarioRepository) {
        this.notificacionService = notificacionService;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    @GetMapping("/getNotificacionesUsuario")
    public List<NotificacionDtoResp> getNotificacionesUsuario(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        return notificacionService.getNotificacionesUsuario(usuario.getId());
    }

    @Transactional
    @GetMapping("/getNotificacionesUsuario")
    public List<NotificacionDtoResp> getNotificacionesUsuarioNoLeidas(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        return notificacionService.getNotificacionesUsuario(usuario.getId());
    }

    @Transactional
    @GetMapping("/getNotificacionesUsuario")
    public List<NotificacionDtoResp> getNotificacionesUsuarioLeidas(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        return notificacionService.getNotificacionesUsuario(usuario.getId());
    }

    @Transactional
    @PutMapping("/leerNotificacion/{id}")
    public ResponseEntity<?> Leer(@PathVariable Long id, @AuthenticationPrincipal UserDetails principal) {

        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        notificacionService.LeerNotificacion(id, usuario.getId());

        return ResponseEntity.ok(Map.of("message", "Has leído una notificación"));
    }

    // Realmente se eliminar la instancia de la tabla M:N UsuarioNotificacion
    @DeleteMapping("/eliminarNotificacion/{id}")
    public ResponseEntity<?> eliminarNotificacion(@PathVariable Long id, @AuthenticationPrincipal UserDetails principal) {

        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        notificacionService.EliminarNotificacion(id, usuario.getId());

        return ResponseEntity.ok(Map.of("message", "Has eliminado una notificación"));
    }

    // Pruebas CRUD
/* 
     private final ActividadRepository actividadRepository;

     public NotificacionController(NotificacionService notificacionService, UsuarioRepository usuarioRepository,
            ActividadRepository actividadRepository) {
        this.notificacionService = notificacionService;
        this.usuarioRepository = usuarioRepository;
        this.actividadRepository = actividadRepository;
    } 

    @Transactional
    @PostMapping("/crearNotificacion")
    public ResponseEntity<?> crearNotificacion(@AuthenticationPrincipal UserDetails principal) {

        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        Actividad actividad = actividadRepository.findById(330L)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        Set<Usuario> usuariosUnidos = actividad.getUsuarios();

        notificacionService.crearNotificacion("tiiitul", "descripciooo", LocalDateTime.now(), EstadoNotificacion.INSCRITO,
                actividad, usuariosUnidos, usuario);
        return ResponseEntity.ok(Map.of("message", "Se ha creado una nueva notificación."));
    } */
}
