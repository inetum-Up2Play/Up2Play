package com.Up2Play.backend.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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

import jakarta.transaction.Transactional;

@Service
public class NotificacionService {

        private UsuarioRepository usuarioRepository;
        private NotificacionRepository notificacionRepository;
        private UsuarioNotificacionRepository usuarioNotificacionRepository;

        // CRUD

        public NotificacionService(UsuarioRepository usuarioRepository,
                        NotificacionRepository notificacionRepository,
                        UsuarioNotificacionRepository usuarioNotificacionRepository) {
                this.usuarioRepository = usuarioRepository;
                this.notificacionRepository = notificacionRepository;
                this.usuarioNotificacionRepository = usuarioNotificacionRepository;
        }

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
