package com.Up2Play.backend.Controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Up2Play.backend.DTO.Respuestas.PagoDtoResp;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;
import com.Up2Play.backend.Service.PagoService;

@RestController
@RequestMapping("/pagos")
@CrossOrigin(origins = "http://localhost:4201")
public class PagoController {

    private final PagoService pagoService;
    private final UsuarioRepository usuarioRepository;

   
    public PagoController(PagoService pagoService,
            UsuarioRepository usuarioRepository) {
        this.pagoService = pagoService;
        this.usuarioRepository = usuarioRepository;
    }

     //Listar todos los pagos de cada usuario
    @GetMapping("/getPagos")
    public List<PagoDtoResp> getPagosPorUsuario(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        return pagoService.getPagosUsuario(usuario);
    }

}
