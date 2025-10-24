package com.Up2Play.backend.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.VerificationToken;
import com.Up2Play.backend.Repository.VerificationTokenRepository;

@Service
public class VerificationTokenService {

    private final VerificationTokenRepository verificationTokenRepository;

    public VerificationTokenService(VerificationTokenRepository verificationTokenRepository) {
        this.verificationTokenRepository = verificationTokenRepository;
    }

    public VerificationToken createToken(Usuario usuario) {

        String token = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);
        VerificationToken verificationToken = new VerificationToken(token, usuario, expiresAt, false);
        return verificationTokenRepository.save(verificationToken);
    }

    public Usuario validateToken(String token) {

        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalido"));
        if (verificationToken.isUsed()) {
            throw new RuntimeException("Token ya fue usado");
        }

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Token expirado");
        }

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);
        return verificationToken.getUsuario();

    }

}
