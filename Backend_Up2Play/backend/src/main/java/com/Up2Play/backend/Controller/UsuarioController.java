package com.Up2Play.backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.Up2Play.backend.DTO.CambiarPasswordDto;
import com.Up2Play.backend.DTO.Respuestas.UsuarioDto;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;
import com.Up2Play.backend.Service.UsuarioService;

//Controlador REST para operaciones CRUD de usuarios. Incluye endpoints que conectan con Angular en localhost:4200) pueda hacer peticiones a este backend.
@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    // Servicio que contiene la lógica para trabajar con usuarios
    @Autowired
    private UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;


    // Constructor que inyecta el servicio de usuarios.
    
    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    // Devuelve lista de usuarios.
    @GetMapping
    public List<Usuario> getAllUsuarios() {

        return usuarioService.getAllUsuarios();
    }

    // Guarda usuario en bases de datos
    @PostMapping
    public Usuario saveUsuario(@RequestBody Usuario usuario) {
        return usuarioService.saveUsuario(usuario);
    }

    // Cambiar contraseña usuario en perfil
    @PutMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@AuthenticationPrincipal UserDetails principal, @RequestBody CambiarPasswordDto cambiarPasswordDto) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        usuarioService.cambiarPasswordPerfil(usuario.getId(), cambiarPasswordDto);
        return  ResponseEntity.ok(Map.of("message", "Se ha cambiado la contraseña correctamente"));
    }

    // Elimina un usuario por ID
    @DeleteMapping("/eliminarUsuario")
    public void deleteUsuario(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        usuarioService.deleteUsuario(usuario.getId());
    }

    //Obtiene el usuario autenticado actual ("/usuarios/me")
    @GetMapping("/me")
    public ResponseEntity<UsuarioDto> usuario(@AuthenticationPrincipal UserDetails principal) {

        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        
        UsuarioDto usuarioDto = new UsuarioDto(
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNombreUsuario(),
            usuario.getRol()
        );
        return ResponseEntity.ok(usuarioDto);
    }

}
