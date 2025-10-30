package com.Up2Play.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Up2Play.backend.Model.VerificationToken;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, String> {

    Optional<VerificationToken> findByToken(String token);

}
