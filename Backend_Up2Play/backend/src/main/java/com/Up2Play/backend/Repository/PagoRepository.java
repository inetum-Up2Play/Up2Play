package com.Up2Play.backend.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Pago;
import com.Up2Play.backend.Model.Usuario;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long>{
     
    //Buscar lista pagos por su usuario 
    List<Actividad> findByUsuario(Usuario usuarioCreador);

    //Buscar lista pagos por actividad 
    List<Actividad> findByActividad(Actividad actividad);



    }