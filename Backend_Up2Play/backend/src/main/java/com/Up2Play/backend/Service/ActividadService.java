package com.Up2Play.backend.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.Up2Play.backend.DTO.ActividadDto;
import com.Up2Play.backend.DTO.Respuestas.ActividadDtoCreadas;
import com.Up2Play.backend.DTO.Respuestas.ActividadDtoResp;
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

        LocalDate fecha = LocalDate.parse(input.getFecha());
        if (fecha.isBefore(LocalDate.now())) {
            throw new RuntimeException("La fecha no puede ser anterior a la fecha actual.");
        } else {
            act.setFecha(fecha);
        }

        LocalTime hora = LocalTime.parse(input.getHora());
        if (fecha.isBefore(LocalDate.now()) && hora.isBefore(LocalTime.now())) {
            throw new RuntimeException("La  no puede ser anterior a la fecha actual.");
        } else {
            act.setHora(hora);
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

        act.setEstado(EstadoActividad.fromValue("Pendiente"));
        act.setUsuarioCreador(usuario);

        Actividad actGuardada = actividadRepository.save(act);

        return actGuardada;
    }

    // Listado todas las actividades

    @Transactional
    public List<ActividadDtoResp> getAllActividades() {
        return actividadRepository.findAll().stream()
                .map(a -> new ActividadDtoResp(
                        a.getId(),
                        a.getNombre(),
                        a.getDescripcion(),
                        a.getFecha() != null ? a.getFecha().toString() : null,
                        a.getHora() != null ? a.getHora().toString() : null,
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
    @Transactional
    public List<ActividadDtoCreadas> getActividadesCreadas(Usuario usuario) {
        return actividadRepository.findByUsuarioCreador(usuario).stream().map(a -> new ActividadDtoCreadas(
                        a.getId(),
                        a.getNombre(),
                        a.getDescripcion(),
                        a.getFecha() != null ? a.getFecha().toString() : null,
                        a.getHora() != null ? a.getHora().toString() : null,
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
    public Set<Actividad> getActividadesApuntadas(Usuario usuario) {
        return usuario.getActividadesUnidas();
    }

    // Lista actividad por id
    public Actividad getActividad(Long id) {
        return actividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));
    }

    // Editar actividad
    public Actividad editarActividad(Long id, ActividadDto input) {
        Actividad act = new Actividad();

        Actividad actEditada = actividadRepository.save(act);
        return actEditada;

    }
    // Eliminar actiividad

}
