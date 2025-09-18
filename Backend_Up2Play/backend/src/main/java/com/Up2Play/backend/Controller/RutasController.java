package com.Up2Play.backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;

public class RutasController {

    @GetMapping("/")
    public String rutaBase(){
        return "index";
    }

}
