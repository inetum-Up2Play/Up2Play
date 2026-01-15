package com.Up2Play.backend.Repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Pago;
import com.Up2Play.backend.Model.Usuario;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long>{
     
    //Buscar lista pagos por su usuario 
    List<Pago> findByUsuario(Usuario usuario);

    //Buscar lista pagos por actividad 
    List<Pago> findByActividad(Actividad actividad);

    Optional<Pago> findByStripePaymentId(String stripePaymentId);

Optional<Pago> findByActividadAndUsuario(Actividad actividad, Usuario usuario);


    }