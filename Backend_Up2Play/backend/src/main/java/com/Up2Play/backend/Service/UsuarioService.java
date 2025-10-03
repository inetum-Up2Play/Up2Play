package com.Up2Play.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> getAllUsuarios() {

        return usuarioRepository.findAll();

    }

    public Usuario saveUsuario(Usuario usuario) {

        return usuarioRepository.save(usuario);
    }

    public void deleteUsuario(Long id) {

        usuarioRepository.deleteById(id);

    }

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        
        usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));
        return usuarioRepository.save(usuario);
    }


}
