package com.Up2Play.backend.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Up2Play.backend.DTO.ActividadDto;
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.enums.EstadoActividad;
import com.Up2Play.backend.Model.enums.NivelDificultad;
import com.Up2Play.backend.Repository.ActividadRepository;
import com.Up2Play.backend.Repository.UsuarioRepository;

@Service
public class ActividadService {
    private ActividadRepository actividadRepository;
    private UsuarioRepository usuarioRepository;

    public ActividadService(ActividadRepository actividadRepository, UsuarioRepository usuarioRepository){
        this.actividadRepository = actividadRepository;
        this.usuarioRepository = usuarioRepository;
    }

    //CRUD
    
    //Crear Actividad
    public Actividad crearActividad(ActividadDto input , Usuario usuario){
        
        Actividad act = new Actividad();

        act.setNombre(input.getNombre());
        act.setDescripcion(input.getDescripcion());

        LocalDate fecha = LocalDate.parse(input.getFecha());
         if (LocalDate.now().isBefore(fecha)) {
            throw new RuntimeException ("La fecha no puede ser anterior a la fecha actual.");
        } else {
            act.setFecha(fecha);
        }

        LocalTime hora = LocalTime.parse(input.getHora());
         if (LocalDate.now().isEqual(fecha) && LocalTime.now().isBefore(hora)) {
            throw new RuntimeException ("La  no puede ser anterior a la fecha actual.");
        } else {
            act.setHora(hora);
        }

        act.setUbicacion(input.getUbicacion());
        act.setNivel(NivelDificultad.fromValue(input.getNivel()));

        act.setNum_pers_inscritas(1);

        int num_personas_totales = Integer.parseInt(input.getNum_pers_totales());

        if (num_personas_totales == 0) {
            act.setNum_pers_totales(1);
        } else act.setNum_pers_totales(num_personas_totales);

        act.setDeporte(input.getDeporte());
       
        act.setEstado(EstadoActividad.fromValue("Pendiente"));

        Actividad actGuardada = actividadRepository.save(act);

        
        act.setUsuarioCreador(usuario);
        return actGuardada;
    }

    //Ver acvtividad
    public List<Actividad> getAllActividades (){
        return actividadRepository.findAll();
    }
}
