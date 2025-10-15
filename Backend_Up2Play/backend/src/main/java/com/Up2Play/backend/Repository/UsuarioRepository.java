package com.Up2Play.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Usuario;

/**
 * Repositorio JPA para operaciones CRUD en la entidad Usuario.
 * Proporciona métodos personalizados para consultas por email y código de
 * verificación.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su email.
     * 
     * @param email El email a buscar.
     * @return Optional con el usuario si existe, vacío si no.
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el email dado.
     * 
     * @param email El email a verificar.
     * @return true si existe, false si no.
     */
    boolean existsByEmail(String email);

    /**
     * Busca un usuario por su código de verificación.
     * 
     * @param verificationCode El código de verificación a buscar.
     * @return Optional con el usuario si existe, vacío si no.
     */
    Optional<Usuario> findByVerificationCode(String verificationCode);
}
