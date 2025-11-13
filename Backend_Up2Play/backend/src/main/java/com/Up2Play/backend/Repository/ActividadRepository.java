package com.Up2Play.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Actividad;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long>{
     
    //Busca la actividad por su usuario creador
    Optional<Actividad> findByUsuarioCreador(String usuarioCreador);

    //Busca actividad por id
    
    }