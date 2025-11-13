package com.Up2Play.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
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
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Service.ActividadService;

@RestController
@RequestMapping("/actividades")
@CrossOrigin(origins = "http://localhost:4200")
public class ActividadController {

    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

  /* 
    @GetMapping("/getAll")
    public List<Actividad> getAllActividades() {
      
        return actividadService.getAllActividades();
    }
    
    @GetMapping("/getCreadas")
    public List<Actividad> getActividadesCreadas() {
      
        return actividadService.getActividadesCreadas();
    }

    @GetMapping("/getApuntadas")
    public List<Actividad> getActividadesApuntadas() {
      
        return actividadService.getActividadesApuntadas();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteActividad(@PathVariable Long id){
        actividadService.deleteActividad(id);
    }

    @PostMapping("/createActividad")
    public ResponseEntity<Actividad> createActividad(@RequestBody ActividadDto actividadDto) {
        Actividad creada = actividadService.createActividad(actividadDto);
        return ResponseEntity.status(201).body(creada);
    }

    @PostMapping("/unirseActividad/{id}")

    @PutMapping("/desapuntarseActividad/{id}")

    @PutMapping("/editarActividad/{id}")
    public ResponseEntity<Actividad> editarActividad(@PathVariable Long id, @RequestBody ActividadDto actividadDto) {
        Actividad editada = actividadService.editarActividad(id, actividadDto);
        return ResponseEntity.ok(editada);
    }

  */  
    
    
}
