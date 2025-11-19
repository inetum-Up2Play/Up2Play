package com.Up2Play.backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Up2Play.backend.DTO.ActividadDto;
import com.Up2Play.backend.DTO.EditarActividadDto;
import com.Up2Play.backend.DTO.Respuestas.ActividadDtoCreadas;
import com.Up2Play.backend.DTO.Respuestas.ActividadDtoResp;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;
import com.Up2Play.backend.Service.ActividadService;
import com.Up2Play.backend.Service.JwtService;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/auth/actividades")
@CrossOrigin(origins = "http://localhost:4200")
public class ActividadController {

    private final ActividadService actividadService;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public ActividadController(ActividadService actividadService, JwtService jwtService,
            UsuarioRepository usuarioRepository) {
        this.actividadService = actividadService;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/getAll")
    public List<ActividadDtoResp> getAllActividades() {
        return actividadService.getAllActividades();
    }

    @GetMapping("/getCreadas")
    public List<ActividadDtoCreadas> getActividadesCreadas(@RequestHeader String token) {
        String email = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        return actividadService.getActividadesCreadas(usuario);
    }

    @GetMapping("/getApuntadas")
    public List<ActividadDtoResp> getActividadesApuntadas(@RequestHeader String token) {

        String email = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        Long usuariosId = usuario.getId();
        return actividadService.getActividadesApuntadas(usuariosId);
    }

    @GetMapping("/getPorId/{id}")
    public ActividadDtoResp getActividad(@PathVariable Long id) {
        return actividadService.getActividad(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteActividad(@PathVariable Long id) {
        actividadService.deleteActividad(id);
    }

    @Transactional
    @PostMapping("/crearActividad")
    public ResponseEntity<?> crearActividad(@RequestBody ActividadDto actividadDto, @RequestHeader String token) {
        String email = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        System.out.println("HOLA" + email + usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado")));
        actividadService.crearActividad(actividadDto, usuario);
        return ResponseEntity.ok(Map.of("message", "Se ha creado una nueva nueva actividad."));
    }

    /*
     * @PostMapping("/unirseActividad/{id}")
     * 
     * @PutMapping("/desapuntarseActividad/{id}")
     */
    // el controlador funciona, pero hay que comprovar si solo puede editar la
    // actividad el creador
    @PutMapping("/editarActividad/{id}")
    public ResponseEntity<?> editarActividad(@PathVariable Long id,
            @RequestBody EditarActividadDto editarActividadDto) {
        actividadService.editarActividad(id, editarActividadDto);
        return ResponseEntity.ok(Map.of("message", "Se ha editado la actividad correctamente."));
    }

}
