package com.Up2Play.backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;

//Controlador simple para manejar la ruta base de la aplicación.

public class IndexController {
    /**
     * Endpoint para la ruta raíz ("/").
     **/
    @GetMapping("/")
    public String rutaBase() {
        return "index";
    }

}
