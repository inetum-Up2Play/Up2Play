package com.Up2Play.backend.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Up2Play.backend.DTO.PerfilDto;
import com.Up2Play.backend.DTO.Respuestas.PerfilDtoResp;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;
import com.Up2Play.backend.Service.PerfilService;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    private final PerfilService perfilService;
    private final UsuarioRepository usuarioRepository;

    public PerfilController(PerfilService perfilService, UsuarioRepository usuarioRepository) {
        this.perfilService = perfilService;
        this.usuarioRepository = usuarioRepository;
    }

    @PutMapping("editarPerfil/{id}")
    public ResponseEntity<?> updatePerfil(@PathVariable Long id, @RequestBody PerfilDto perfilDto,
            @AuthenticationPrincipal UserDetails principal) {

        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        perfilService.EditarPerfil(id, perfilDto, usuario.getId());

        return ResponseEntity.ok(Map.of("message", "Se ha editado el perfil correctamente."));
    }

    @GetMapping("/obtenerPerfil/{id}")
    public PerfilDtoResp obtenerPerfil(@PathVariable Long id) {
        return perfilService.obtenerPerfil(id);
    }

}
