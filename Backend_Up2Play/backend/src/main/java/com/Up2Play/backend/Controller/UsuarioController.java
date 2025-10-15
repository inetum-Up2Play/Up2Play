package com.Up2Play.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Service.UsuarioService;

/**
 * Controlador REST para operaciones CRUD de usuarios.
 * Incluye endpoint para obtener el usuario autenticado actual.
 * Permite CORS desde localhost:4200 (ej. frontend Angular).
 */
@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {
    /**
     * Servicio de usuarios para lógica de negocio (CRUD).
     * Nota: @Autowired es redundante con el constructor; se prefiere inyección por
     * constructor.
     */
    @Autowired
    private UsuarioService usuarioService;

    /**
     * Constructor que inyecta el servicio de usuarios.
     * 
     * @param usuarioService Servicio a inyectar.
     */
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Endpoint GET para obtener lista de todos los usuarios.
     * 
     * @return Lista de usuarios.
     */
    @GetMapping
    public List<Usuario> getAllUsuarios() {

        return usuarioService.getAllUsuarios();
    }

    /**
     * Endpoint POST para crear un nuevo usuario.
     * 
     * @param usuario Datos del usuario a guardar.
     * @return Usuario creado.
     */
    @PostMapping
    public Usuario saveUsuario(@RequestBody Usuario usuario) {
        return usuarioService.saveUsuario(usuario);
    }

    /**
     * Endpoint PUT para actualizar un usuario por ID.
     * Establece el ID en el objeto recibido y guarda cambios.
     * 
     * @param id      ID del usuario a actualizar.
     * @param usuario Datos actualizados.
     * @return Usuario actualizado.
     */
    @PutMapping("/{id}")
    public Usuario updateUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        usuario.setId(id);
        return usuarioService.saveUsuario(usuario);
    }

    /**
     * Endpoint DELETE para eliminar un usuario por ID.
     * 
     * @param id ID del usuario a eliminar.
     */
    @DeleteMapping("/{id}")
    public void deleteUsuario(@PathVariable Long id) {
        usuarioService.deleteUsuario(id);
    }

    /**
     * Endpoint GET para obtener el usuario autenticado actual ("/usuarios/me").
     * Usa SecurityContext para extraer el principal del contexto de autenticación.
     * 
     * @return ResponseEntity con el usuario actual.
     */
    @GetMapping("/me")
    public ResponseEntity<Usuario> usuario() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario currentUser = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

}
