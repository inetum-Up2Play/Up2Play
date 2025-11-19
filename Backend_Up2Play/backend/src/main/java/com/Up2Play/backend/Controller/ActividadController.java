package com.Up2Play.backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/actividades")
@CrossOrigin(origins = "http://localhost:4200")
public class ActividadController {

    private final ActividadService actividadService;
    private final UsuarioRepository usuarioRepository;

    public ActividadController(ActividadService actividadService, UsuarioRepository usuarioRepository) {
        this.actividadService = actividadService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/getAll")
    public List<ActividadDtoResp> getAllActividades() {
        return actividadService.getAllActividades();
    }


   /* ------------POR SI ACASO, BORRAR UNA VEZ COMPROVADO QUE EL OTRO MÉTODO FUNCIONA-----------------
   @GetMapping("/getCreadas")
    public List<ActividadDtoCreadas> getActividadesCreadas(@RequestHeader String token) {
        String email = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return actividadService.getActividadesCreadas(usuario);
    }
    */


    @GetMapping("/getCreadas")
    public List<ActividadDtoCreadas> getActividadesCreadas(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return actividadService.getActividadesCreadas(usuario);
    }


    /* ------------POR SI ACASO, BORRAR UNA VEZ COMPROVADO QUE EL OTRO MÉTODO FUNCIONA-----------------
    @GetMapping("/getApuntadas")
    public List<ActividadDtoResp> getActividadesApuntadas(@RequestHeader String token) {

        String email = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Long usuariosId = usuario.getId();
        return actividadService.getActividadesApuntadas(usuariosId);
    }
    */

   @GetMapping("/getApuntadas")

    public List<ActividadDtoResp> getActividadesApuntadas(@AuthenticationPrincipal UserDetails principal) {
        //el getUsername recoge el correo, no el username
        String email = principal.getUsername();
        System.out.println(email);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        Long usuariosId = usuario.getId();
        return actividadService.getActividadesApuntadas(usuariosId);
    }

    @GetMapping("/{id}")
    public ActividadDtoResp getActividad(@PathVariable Long id) {
        return actividadService.getActividad(id);
    }
    
    @GetMapping("getNoApuntadas")
     public List<ActividadDtoResp> getActividadesNoApuntadas(@AuthenticationPrincipal UserDetails principal) {

        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        Long usuariosId = usuario.getId();
        return actividadService.getActividadesNoApuntadas(usuariosId);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteActividad(@PathVariable Long id) {
        actividadService.deleteActividad(id);
    }

    @Transactional
    @PostMapping("/crearActividad")
    public ResponseEntity<?> crearActividad(@RequestBody ActividadDto actividadDto,
            @AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        actividadService.crearActividad(actividadDto, usuario);
        return ResponseEntity.ok(Map.of("message", "Se ha creado una nueva actividad."));
    }


    /* ------------POR SI ACASO, BORRAR UNA VEZ COMPROVADO QUE EL OTRO MÉTODO FUNCIONA-----------------
    @Transactional
    @PostMapping("/crearActividad")
    public ResponseEntity<?> crearActividad(@RequestBody ActividadDto actividadDto, @RequestHeader String token) {
        String email = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        System.out.println("HOLA" + email + usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
        actividadService.crearActividad(actividadDto, usuario);
        return ResponseEntity.ok(Map.of("message", "Se ha creado una nueva nueva actividad."));
    } */

    
    @PutMapping("/{id}/participantes")
    public ResponseEntity<?> unirActividad (@PathVariable("id") Long idActividad,  @AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        actividadService.unirActividad(idActividad, usuario.getId());
        return ResponseEntity.ok(Map.of("message", "Te has unido a la actividad."));
    }
    
    @DeleteMapping("/{id}/participantes")
    public ResponseEntity<?> desapuntarActividad (@PathVariable("id") Long idActividad,  @AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
        actividadService.desapuntarActividad(idActividad, usuario.getId());
        return ResponseEntity.ok(Map.of("message", "Te has desapuntado de la actividad."));
    }
     

    @PutMapping("editarActividad/{id}")
    public ResponseEntity<?> editarActividad(@PathVariable Long id,
            @RequestBody EditarActividadDto editarActividadDto) {
        actividadService.editarActividad(id, editarActividadDto);
        return ResponseEntity.ok(Map.of("message", "Se ha editado la actividad correctamente."));
    }

}
