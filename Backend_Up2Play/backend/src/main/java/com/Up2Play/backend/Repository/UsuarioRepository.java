package com.Up2Play.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Usuario;

//Repositorio JPA para operaciones CRUD en la entidad Usuario.
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    //Busca un usuario por su email.
    Optional<Usuario> findByEmail(String email);

    //Busca usuario por nombre
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    //Verifica si existe un usuario con el email dado.
    boolean existsByEmail(String email);

    // Busca un usuario por su código de verificación.
    Optional<Usuario> findByVerificationCode(String verificationCode);
}
