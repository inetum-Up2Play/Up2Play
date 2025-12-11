package com.Up2Play.backend.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Usuario;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long>{
     
    //Buscar lista actividades por su usuario creador
    List<Actividad> findByUsuarioCreador(Usuario usuarioCreador);

    // Actividades pendientes cuya fecha ya pasó → cambiar a EN_CURSO
    @Query("SELECT a FROM Actividad a WHERE a.estado = com.Up2Play.backend.Model.enums.EstadoActividad.PENDIENTE AND a.fecha <= :ahora")
    List<Actividad> findPendientesParaIniciar(LocalDateTime ahora);

    
    // Actividades en curso cuya fecha + 12h ya pasó → cambiar a COMPLETADA
    @Query("SELECT a FROM Actividad a WHERE a.estado = com.Up2Play.backend.Model.enums.EstadoActividad.EN_CURSO AND a.fecha <= :ahora")
    List<Actividad> findEnCursoParaCompletar(LocalDateTime ahora);
    }