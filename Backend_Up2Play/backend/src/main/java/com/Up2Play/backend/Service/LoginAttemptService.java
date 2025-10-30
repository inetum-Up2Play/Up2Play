package com.Up2Play.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

//Clase que gestiona los intentos de login fallido
@Service
public class LoginAttemptService {

    //indica cuantos intentos fallidos se permiten antes de bloquear
    private static final int max_attempts = 5;

    //indica el nombre de este cache y se especifica en la CacheConfig
    private static final String cache_name = "loginAttempts";

    //variable de tipo "Cache" donde se guarda cuantos intentos lleva el usuario
    private final Cache attemptsCache;
    
    //autoinyecta el CacheManager (configurado en CacheConfig)
    @Autowired 
    public LoginAttemptService (CacheManager cacheManager){
        this.attemptsCache = cacheManager.getCache(cache_name); //del CacheManager, coge el caché "loginAttempts" y lo guarda en la variable "attemptsCache" 
    }
    
    public static int getMaxAttempts() {
        return max_attempts;
    }

    //método que se llama cuando un usuario falla un intento de login
    public void loginFailed (String key) {
        Integer attempts = attemptsCache.get(key,Integer.class); //muestra los intentos 
        if (attempts==null){
            attempts = 0;
        }
        attempts++;
        attemptsCache.put(key, attempts); //añade los intentos de la variable
    }

    public void loginSucceeded(String key){ 
        attemptsCache.evict(key); //borra los intentos si el inicio de sesion ha funcionado
    }

    //metodo que devuelve un true si el usuario ha intentado entrar 5 veces o más
    public boolean isBlocked(String key) {
        Integer attempts = attemptsCache.get(key, Integer.class);
        if (attempts!=null) {
            if (attempts>=max_attempts) {
                return true;
            }
        }
        return false; 
    }
}
