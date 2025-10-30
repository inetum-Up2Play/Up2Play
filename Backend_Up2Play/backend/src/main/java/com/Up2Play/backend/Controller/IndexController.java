package com.Up2Play.backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador simple para manejar la ruta base de la aplicación.
 * Nota: Para que funcione como controlador en Spring, se recomienda
 * agregar @Controller o @RestController.
 */
public class IndexController {
    /**
     * Endpoint para la ruta raíz ("/").
     * Retorna el nombre de la vista "index" (para renderizar una página principal).
     * 
     * @return Nombre de la vista a renderizar.
     */
    @GetMapping("/")
    public String rutaBase() {
        return "index";
    }

}
