package com.Up2Play.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    boolean existsByEmail(String email);

    Optional<Usuario> findByVerificationCode(String verificationCode);

    Optional<Usuario> findByStripeAccountId(String stripeAccountId);

    @Modifying
    @Query("DELETE FROM VerificationToken t WHERE t.usuario.id = :usuarioId")
    int deleteToken(@Param("usuarioId") Long usuarioId);

}
