package com.Up2Play.backend.env;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * Clase utilitaria para cargar y acceder a variables de entorno desde un
 * archivo .env.
 * Utiliza la librería Dotenv para manejar configuraciones sensibles (ej.
 * credenciales, URLs).
 * Carga el archivo una sola vez de forma estática para eficiencia.
 */
public class EnvLoader {

    /**
     * Instancia estática de Dotenv, cargada al inicializar la clase.
     * Maneja el archivo .env en la raíz del proyecto.
     */
    private static final Dotenv dotenv = Dotenv.load();

    /**
     * Método estático para obtener el valor de una variable de entorno por clave.
     * Retorna null si la clave no existe.
     * 
     * @param key Clave de la variable de entorno (ej. "DB_PASSWORD").
     * @return Valor de la variable o null si no se encuentra.
     */
    public static String get(String key) {
        return dotenv.get(key);
    }
}
