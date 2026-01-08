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
    private NotificacionService notificacionService;

    

    //Crear pago por cada usuario al apuntarse a una actividad de pago

    public PagoService(PagoRepository pagoRepository, NotificacionService notificacionService) {
        this.pagoRepository = pagoRepository;
        this.notificacionService = notificacionService;
    }

    /* ---------IMPORTANTE!!---------
        Método hecho, falta implementarlo una vez el usuario paga y stripe
        confirma el pago. 
        Se usa en: 
        // webhook de Stripe
        if (evento == PAYMENT_INTENT_SUCCEEDED) {
            pagoService.crearPago(actividad, usuario);
        } o en la manera que sea que se compruebe que el pago se ha realizado con éxito.
    */
    public Pago crearPago(Actividad act, Usuario usuario){

        Pago pago = new Pago();

        pago.setFecha(LocalDateTime.now());
        pago.setTotal(act.getPrecio());
        pago.setUsuario(usuario);
        pago.setActividad(act);

        Pago pagoGuardado = pagoRepository.save(pago);
        notificacionService.notificacionPagoConfirmado(pagoGuardado);
        return pagoGuardado;
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
