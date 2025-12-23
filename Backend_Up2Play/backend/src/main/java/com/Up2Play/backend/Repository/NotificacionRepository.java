package com.Up2Play.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.Notificacion;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    @Modifying
@Query("DELETE FROM Notificacion n WHERE n.usuarioCreador.id = :id")
void deleteByUsuarioCreador(@Param("id") Long id);


}
