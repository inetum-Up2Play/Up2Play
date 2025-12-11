package com.Up2Play.backend.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.enums.EstadoActividad;
import com.Up2Play.backend.Repository.ActividadRepository;

@Service
public class ActividadScheduler {

    private final ActividadRepository actividadRepository;

    public ActividadScheduler(ActividadRepository actividadRepository) {
            this.actividadRepository = actividadRepository;
    }

    @Scheduled(fixedRate = 60000) // cada 1 minuto
    public void actualizarEstados() {

        LocalDateTime ahora = LocalDateTime.now();

        // Actividades de PENDIENTE a EN_CURSO
        List<Actividad> pendientes = actividadRepository.findPendientesParaIniciar(ahora);
        for (Actividad a : pendientes) {
            a.setEstado(EstadoActividad.EN_CURSO);
        }
        actividadRepository.saveAll(pendientes);

        // Actividades de EN_CURSO a COMPLETADA a las 12h
        List<Actividad> enCurso = actividadRepository.findEnCursoParaCompletar(ahora);
        for (Actividad a : enCurso) {
            if (a.getFecha().plusHours(12).isBefore(ahora)) {
                a.setEstado(EstadoActividad.COMPLETADA);
            }
        }
        actividadRepository.saveAll(enCurso);
    }
}



