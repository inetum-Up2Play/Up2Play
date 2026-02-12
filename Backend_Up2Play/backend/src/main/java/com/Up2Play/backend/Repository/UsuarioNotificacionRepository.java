package com.Up2Play.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Notificacion;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.UsuarioNotificacion;

@Repository
public interface UsuarioNotificacionRepository extends JpaRepository<UsuarioNotificacion, Long> {

    UsuarioNotificacion findByUsuarioAndNotificacion(Usuario usuario, Notificacion notificacion);

    List<UsuarioNotificacion> findByUsuario(Usuario usuario);

}
