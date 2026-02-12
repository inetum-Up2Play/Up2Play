package com.Up2Play.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Perfil;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {

    List<Perfil> findByUsuarioId(Long usuarioId);

}
