package com.Up2Play.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> getAllUsuarios() {

        return usuarioRepository.findAll();

    }

    public Usuario saveUsuario(Usuario usuario) {

        return usuarioRepository.save(usuario);
    }

    public void deleteUsuario(Long id) {

        usuarioRepository.deleteById(id);

    }

}
