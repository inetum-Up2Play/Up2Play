package com.Up2Play.backend.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Up2Play.backend.DTO.ActividadDto;
import com.Up2Play.backend.DTO.EditarActividadDto;
import com.Up2Play.backend.DTO.Respuestas.ActividadDtoCreadas;
import com.Up2Play.backend.DTO.Respuestas.ActividadDtoResp;
import com.Up2Play.backend.Exception.ErroresActividad.ActividadNoEncontrada;
import com.Up2Play.backend.Exception.ErroresActividad.FechaYHora;
import com.Up2Play.backend.Exception.ErroresActividad.MaximosParticipantes;
import com.Up2Play.backend.Exception.ErroresActividad.UsuarioCreador;
import com.Up2Play.backend.Exception.ErroresActividad.UsuarioCreadorEditar;
import com.Up2Play.backend.Exception.ErroresActividad.UsuarioCreadorEliminar;
import com.Up2Play.backend.Exception.ErroresActividad.UsuarioNoApuntadoException;
import com.Up2Play.backend.Exception.ErroresActividad.UsuarioYaApuntadoException;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.enums.EstadoActividad;
import com.Up2Play.backend.Model.enums.NivelDificultad;
import com.Up2Play.backend.Repository.ActividadRepository;
import com.Up2Play.backend.Repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class ActividadService {
    private ActividadRepository actividadRepository;
    private UsuarioRepository usuarioRepository;

    public ActividadService(ActividadRepository actividadRepository, UsuarioRepository usuarioRepository) {
        this.actividadRepository = actividadRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // CRUD

    // Crear Actividad
    public Actividad crearActividad(ActividadDto input, Usuario usuario) {

        Actividad act = new Actividad();

        act.setNombre(input.getNombre());
        act.setDescripcion(input.getDescripcion());

        LocalDateTime fecha = LocalDateTime.parse(input.getFecha());
        if (fecha.isBefore(LocalDateTime.now())) {
            throw new FechaYHora("La fecha y hora no pueden ser anteriores al momento actual.");
        } else {
            act.setFecha(fecha);
        }

        act.setUbicacion(input.getUbicacion());
        act.setNivel(NivelDificultad.fromValue(input.getNivel()));

        act.setNumPersInscritas(1);

        int num_personas_totales = Integer.parseInt(input.getNumPersTotales());

        if (num_personas_totales == 0) {
            act.setNumPersTotales(1);
        } else
            act.setNumPersTotales(num_personas_totales);

        act.setDeporte(input.getDeporte());

        double precio = Double.parseDouble(input.getPrecio());
        act.setPrecio(precio);

        act.setEstado(EstadoActividad.fromValue("Pendiente"));
        act.setUsuarioCreador(usuario);

        Usuario usuarioApuntado = usuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        act.getUsuarios().add(usuario);
        usuarioApuntado.getActividadesUnidas().add(act);

        Actividad actGuardada = actividadRepository.save(act);

        return actGuardada;
    }

    // Listado todas las actividades

    @Transactional // (readOnly = true)
    public List<ActividadDtoResp> getAllActividades() {
        return actividadRepository.findAll().stream()
                .map(a -> new ActividadDtoResp(
                        a.getId(),
                        a.getNombre(),
                        a.getDescripcion(),
                        a.getFecha() != null ? a.getFecha().toString() : null,
                        a.getUbicacion(),
                        a.getDeporte(),
                        a.getNivel() != null ? a.getNivel().name() : null,
                        a.getNumPersInscritas(),
                        a.getNumPersTotales(),
                        a.getEstado() != null ? a.getEstado().name() : null,
                        a.getPrecio(),
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getId() : null,
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getEmail() : null))
                .toList();
    }

    // Lista de actividades creadas por un usuario
    @Transactional // (readOnly = true)
    public List<ActividadDtoCreadas> getActividadesCreadas(Usuario usuario) {
        return actividadRepository.findByUsuarioCreador(usuario).stream().map(a -> new ActividadDtoCreadas(
                a.getId(),
                a.getNombre(),
                a.getDescripcion(),
                a.getFecha() != null ? a.getFecha().toString() : null,
                a.getUbicacion(),
                a.getDeporte(),
                a.getNivel() != null ? a.getNivel().name() : null,
                a.getNumPersInscritas(),
                a.getNumPersTotales(),
                a.getEstado() != null ? a.getEstado().name() : null,
                a.getPrecio(),
                a.getUsuarioCreador() != null ? a.getUsuarioCreador().getId() : null,
                a.getUsuarioCreador() != null ? a.getUsuarioCreador().getEmail() : null)).toList();
    }

    // Lista de actividades a las que un usuario está apuntado
    @Transactional
    public List<ActividadDtoResp> getActividadesApuntadas(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        return usuario.getActividadesUnidas().stream()
                .map(a -> new ActividadDtoResp(
                        a.getId(),
                        a.getNombre(),
                        a.getDescripcion(),
                        a.getFecha() != null ? a.getFecha().toString() : null,
                        a.getUbicacion(),
                        a.getDeporte(),
                        a.getNivel() != null ? a.getNivel().name() : null,
                        a.getNumPersInscritas(),
                        a.getNumPersTotales(),
                        a.getEstado() != null ? a.getEstado().name() : null,
                        a.getPrecio(),
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getId() : null,
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getEmail() : null))
                .toList();

    }

    // Lista de actividades a las que un usuario no esta apuntado
    @Transactional
    public List<ActividadDtoResp> getActividadesNoApuntadas(Long usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        return actividadRepository.findAll().stream()
                .filter(act -> !usuario.getActividadesUnidas().contains(act))
                .map(a -> new ActividadDtoResp(
                        a.getId(),
                        a.getNombre(),
                        a.getDescripcion(),
                        a.getFecha() != null ? a.getFecha().toString() : null,
                        a.getUbicacion(),
                        a.getDeporte(),
                        a.getNivel() != null ? a.getNivel().name() : null,
                        a.getNumPersInscritas(),
                        a.getNumPersTotales(),
                        a.getEstado() != null ? a.getEstado().name() : null,
                        a.getPrecio(),
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getId() : null,
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getEmail() : null))
                .toList();
    }

    // Lista actividad por id
    @Transactional
    public ActividadDtoResp getActividad(Long id) {
        return actividadRepository.findById(id)
                .map(a -> new ActividadDtoResp(
                        a.getId(),
                        a.getNombre(),
                        a.getDescripcion(),
                        a.getFecha() != null ? a.getFecha().toString() : null,
                        a.getUbicacion(),
                        a.getDeporte(),
                        a.getNivel() != null ? a.getNivel().name() : null,
                        a.getNumPersInscritas(),
                        a.getNumPersTotales(),
                        a.getEstado() != null ? a.getEstado().name() : null,
                        a.getPrecio(),
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getId() : null,
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getEmail() : null))
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));
    }

    // Editar actividad
    public Actividad editarActividad(Long id, EditarActividadDto input, Long idUsuario) {
        Actividad act = actividadRepository.findById(id)
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        if (usuario.getId().equals(act.getUsuarioCreador().getId())) {
            act.setNombre(input.getNombre());
            act.setDescripcion(input.getDescripcion());

            LocalDateTime fecha = LocalDateTime.parse(input.getFecha());
            if (fecha.isBefore(LocalDateTime.now())) {
                throw new FechaYHora("La fecha y hora no pueden ser anteriores al momento actual.");
            } else {
                act.setFecha(fecha);
            }

            act.setUbicacion(input.getUbicacion());
            act.setNivel(NivelDificultad.fromValue(input.getNivel()));

            int num_personas_totales = Integer.parseInt(input.getnumPersTotales());

            if (num_personas_totales == 0) {
                act.setNumPersTotales(1);
            } else
                act.setNumPersTotales(num_personas_totales);

            act.setDeporte(input.getDeporte());

            Actividad actEditada = actividadRepository.save(act);
            return actEditada;
        } else {

            throw new UsuarioCreadorEditar("Solo el usuario creador puede editar la actividad");
        }

    }

    // Eliminar actividad
    public void deleteActividad(Long idActividad, Long idUsuario) {
        Actividad act = actividadRepository.findById(idActividad)
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        if (usuario.getId().equals(act.getUsuarioCreador().getId())) {

            List<Usuario> usuarios = usuarioRepository.findAll();

            for (Usuario usuario2 : usuarios) {

                usuario2.getActividadesUnidas().removeIf(actividad -> actividad.getId().equals(idActividad));
                usuarioRepository.save(usuario2);
            }

            act.getUsuarios().clear();
            usuario.getActividadesUnidas().clear();
            actividadRepository.deleteById(idActividad);
        } else {

            throw new UsuarioCreadorEliminar("Solo el usuario creador puede eliminar la actividad");

        }

    }

    // Unirse a Actividad
    @Transactional
    public ActividadDtoResp unirActividad(Long idActividad, Long idUsuario) {

        Actividad act = actividadRepository.findById(idActividad)
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        if (!act.getUsuarios().contains(usuario)) {

            act.setNumPersInscritas(act.getNumPersInscritas() + 1);

            if (act.getNumPersInscritas() > act.getNumPersTotales()) {

                throw new MaximosParticipantes("Se ha alcanzado el numero maximo de participantes en esta actividad");
            } else {
                act.getUsuarios().add(usuario);
                usuario.getActividadesUnidas().add(act);
                act.getUsuarios().add(usuario);

            }

        } else {

            throw new UsuarioYaApuntadoException("El usuario ya está apuntado a esta actividad");
        }

        usuarioRepository.save(usuario);
        return new ActividadDtoResp(
                act.getId(),
                act.getNombre(),
                act.getDescripcion(),
                act.getFecha() != null ? act.getFecha().toString() : null,
                act.getUbicacion(),
                act.getDeporte(),
                act.getNivel() != null ? act.getNivel().name() : null,
                act.getNumPersInscritas(),
                act.getNumPersTotales(),
                act.getEstado() != null ? act.getEstado().name() : null,
                act.getPrecio(),
                act.getUsuarioCreador() != null ? act.getUsuarioCreador().getId() : null,
                act.getUsuarioCreador() != null ? act.getUsuarioCreador().getEmail() : null);
    }

    // Desapuntarse a Actividad
    @Transactional
    public ActividadDtoResp desapuntarActividad(Long idActividad, Long idUsuario) {

        Actividad act = actividadRepository.findById(idActividad)
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        if (act.getUsuarios().contains(usuario)) {

            if (!act.getUsuarioCreador().equals(usuario)) {

                act.getUsuarios().remove(usuario);
                usuario.getActividadesUnidas().remove(act);
                act.setNumPersInscritas(act.getNumPersInscritas() - 1);

            } else {
                throw new UsuarioCreador("El usuario creador no puede desapuntarse de la actividad");
            }

        } else {

            throw new UsuarioNoApuntadoException("El usuario no está apuntado a esta actividad");
        }

        usuarioRepository.save(usuario);
        return new ActividadDtoResp(
                act.getId(),
                act.getNombre(),
                act.getDescripcion(),
                act.getFecha() != null ? act.getFecha().toString() : null,
                act.getUbicacion(),
                act.getDeporte(),
                act.getNivel() != null ? act.getNivel().name() : null,
                act.getNumPersInscritas(),
                act.getNumPersTotales(),
                act.getEstado() != null ? act.getEstado().name() : null,
                act.getPrecio(),
                act.getUsuarioCreador() != null ? act.getUsuarioCreador().getId() : null,
                act.getUsuarioCreador() != null ? act.getUsuarioCreador().getEmail() : null);

    }
}
