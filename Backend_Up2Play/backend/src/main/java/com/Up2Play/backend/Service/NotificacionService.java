package com.Up2Play.backend.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.Up2Play.backend.DTO.Respuestas.NotificacionDtoResp;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Notificacion;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.enums.EstadoNotificacion;
import com.Up2Play.backend.Repository.NotificacionRepository;
import com.Up2Play.backend.Repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class NotificacionService {

    private Notificacion notificacion;
    private UsuarioRepository usuarioRepository;
    private NotificacionRepository notificacionRepository;

    public NotificacionService(Notificacion notificacion, UsuarioRepository usuarioRepository,
            NotificacionRepository notificacionRepository) {
        this.notificacion = notificacion;
        this.usuarioRepository = usuarioRepository;
        this.notificacionRepository = notificacionRepository;
    }

    // CRUD

    @Transactional
    public List<NotificacionDtoResp> getNotificacionesUsuario(Long usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        return usuario.getNotificaciones().stream().map(n -> new NotificacionDtoResp(

                n.getId(),
                n.getTitulo(),
                n.getDescripcion(),
                n.getFecha() != null ? n.getFecha().toString() : null,
                n.isLeido(),
                n.getEstadoNotificacion().toString(),
                n.getActividad().getId())).toList();
    }

    public Notificacion crearNotificacion(String titulo, String descripcion, LocalDate fecha,
            EstadoNotificacion estadoNotificacion, Actividad actividad, Set<Usuario> usuarios, Usuario usuarioCreador) {

        Notificacion n = new Notificacion();

        n.setTitulo(titulo);
        n.setDescripcion(descripcion);
        n.setFecha(fecha);
        n.setLeido(false);
        n.setEstadoNotificacion(estadoNotificacion);
        n.setActividad(actividad);
        n.setUsuarios(usuarios);
        n.setUsuarioCreador(usuarioCreador);

        Notificacion notificacionGuardada = notificacionRepository.save(n);

        return notificacionGuardada;
    }


}
