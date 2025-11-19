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

        act.setNum_pers_inscritas(1);

        int num_personas_totales = Integer.parseInt(input.getNum_pers_totales());

        if (num_personas_totales == 0) {
            act.setNum_pers_totales(1);
        } else
            act.setNum_pers_totales(num_personas_totales);

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
                        a.getNum_pers_inscritas(),
                        a.getNum_pers_totales(),
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
                a.getNum_pers_inscritas(),
                a.getNum_pers_totales(),
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
                        a.getNum_pers_inscritas(),
                        a.getNum_pers_totales(),
                        a.getEstado() != null ? a.getEstado().name() : null,
                        a.getPrecio(),
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getId() : null,
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getEmail() : null))
                .toList();

    }

    //Lista de actividades a las que un usuario no esta apuntado
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
                        a.getNum_pers_inscritas(),
                        a.getNum_pers_totales(),
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
                        a.getNum_pers_inscritas(),
                        a.getNum_pers_totales(),
                        a.getEstado() != null ? a.getEstado().name() : null,
                        a.getPrecio(),
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getId() : null,
                        a.getUsuarioCreador() != null ? a.getUsuarioCreador().getEmail() : null))
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));
    }

    // Editar actividad
    public Actividad editarActividad(Long id, EditarActividadDto input) {
        Actividad act = actividadRepository.findById(id)
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));
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
            act.setNum_pers_totales(1);
        } else
            act.setNum_pers_totales(num_personas_totales);

        act.setDeporte(input.getDeporte());

        Actividad actEditada = actividadRepository.save(act);
        return actEditada;

    }

    // Eliminar actividad
    public void deleteActividad(Long id) {
        actividadRepository.deleteById(id);
    }


    //Unirse a Actividad
    @Transactional
    public ActividadDtoResp unirActividad (Long idActividad , Long idUsuario){

        Actividad act = actividadRepository.findById(idActividad)
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        act.getUsuarios().add(usuario);
        usuario.getActividadesUnidas().add(act);
        usuarioRepository.save(usuario);
    return new ActividadDtoResp(
                        act.getId(),
                        act.getNombre(),
                        act.getDescripcion(),
                        act.getFecha() != null ? act.getFecha().toString() : null,
                        act.getUbicacion(),
                        act.getDeporte(),
                        act.getNivel() != null ? act.getNivel().name() : null,
                        act.getNum_pers_inscritas(),
                        act.getNum_pers_totales(),
                        act.getEstado() != null ? act.getEstado().name() : null,
                        act.getPrecio(),
                        act.getUsuarioCreador() != null ? act.getUsuarioCreador().getId() : null,
                        act.getUsuarioCreador() != null ? act.getUsuarioCreador().getEmail() : null);
                
    }
    


    //Desapuntarse a Actividad
    @Transactional
    public ActividadDtoResp desapuntarActividad (Long idActividad , Long idUsuario){

        Actividad act = actividadRepository.findById(idActividad)
                .orElseThrow(() -> new ActividadNoEncontrada("Actividad no encontrada"));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        act.getUsuarios().remove(usuario);
        usuario.getActividadesUnidas().remove(act);
        usuarioRepository.save(usuario);
    return new ActividadDtoResp(
                        act.getId(),
                        act.getNombre(),
                        act.getDescripcion(),
                        act.getFecha() != null ? act.getFecha().toString() : null,
                        act.getUbicacion(),
                        act.getDeporte(),
                        act.getNivel() != null ? act.getNivel().name() : null,
                        act.getNum_pers_inscritas(),
                        act.getNum_pers_totales(),
                        act.getEstado() != null ? act.getEstado().name() : null,
                        act.getPrecio(),
                        act.getUsuarioCreador() != null ? act.getUsuarioCreador().getId() : null,
                        act.getUsuarioCreador() != null ? act.getUsuarioCreador().getEmail() : null);
                
    }
}
    

