package com.Up2Play.backend.env;

import io.github.cdimascio.dotenv.Dotenv;

// Clase para cargar y acceder a variables de entorno desde un archivo .env.
public class EnvLoader {

    // // Carga el archivo .env una sola vez cuando se inicia la aplicación
    private static final Dotenv dotenv = Dotenv.load();

    //Metodo que permite obtener el valor de una variable del archivo .env.
    public static String get(String key) {
        return dotenv.get(key);
    }
}
