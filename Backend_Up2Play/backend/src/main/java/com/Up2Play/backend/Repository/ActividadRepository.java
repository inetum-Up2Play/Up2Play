package com.Up2Play.backend.Repository;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Usuario;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long>{
     
    //Buscar lista actividades por su usuario creador
    List<Actividad> findByUsuarioCreador(Usuario usuarioCreador);


    List<Actividad> findByUsuarios_IdAndFechaBeforeOrderByFechaDesc(Long usuarioId, LocalDateTime now);
    }