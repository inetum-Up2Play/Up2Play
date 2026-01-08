package com.Up2Play.backend.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Up2Play.backend.DTO.Respuestas.PagoDtoResp;
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Pago;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.PagoRepository;

import jakarta.transaction.Transactional;

@Service
public class PagoService {

    private PagoRepository pagoRepository;

    public PagoService(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
        
    }

    //Crear pago por cada usuario al apuntarse a una actividad de pago

    /* ---------IMPORTANTE!!---------
        Método hecho, falta implementarlo una vez el usuario paga y stripe
        confirma el pago. */
    public Pago crearPago(Actividad act, Usuario usuario){

        Pago pago = new Pago();

        pago.setFecha(LocalDateTime.now());
        pago.setTotal(act.getPrecio());
        pago.setUsuario(usuario);
        pago.setActividad(act);

        return pagoRepository.save(pago);
    }

    //Listar todos los pagos de cada usuario
    @Transactional
    public List<PagoDtoResp> getPagosUsuario(Usuario usuario){
        return pagoRepository.findByUsuario(usuario).stream()
                .map(p -> new PagoDtoResp(
                    p.getId(),
                    p.getFecha(),
                    p.getTotal(),
                    p.getUsuario().getId(),
                    p.getActividad().getId(),
                    p.getActividad().getNombre()))
                .toList();   
    }

}
