package com.Up2Play.backend.Config;

import java.util.concurrent.TimeUnit;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;



// Configuración que controla el comportamiento el caché, como la expiración o los limites del caché.
@Configuration
@EnableCaching //activa el soporte de caché en Spring. Esto permite usar anotaciones como @Cacheable, @CachePut, @CacheEvict.
public class CacheConfig {

    //Se define  y configura el objeto "Caffeine" que se utilizará en el metodo de abajo
    @Bean
    public Caffeine<Object, Object> caffeineConfig() {
        return Caffeine.newBuilder() //crea una configuración personalizada para caffeine
        .expireAfterWrite(10, TimeUnit.MINUTES)
        .maximumSize(1000);
    }

    //Este método define el gestor de caché principal, donde recoge el objeto Caffeine de arriba
    @Bean
    public CacheManager cacheManager(Caffeine<Object, Object> caffeine) {
        CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager("loginAttempts");
        caffeineCacheManager.setCaffeine(caffeine);
        return caffeineCacheManager;
    }

}

