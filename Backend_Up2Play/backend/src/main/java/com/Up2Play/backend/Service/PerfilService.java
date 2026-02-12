package com.Up2Play.backend.Service;

import org.springframework.stereotype.Service;

import com.Up2Play.backend.DTO.PerfilDto;
import com.Up2Play.backend.DTO.Respuestas.PerfilDtoResp;
import com.Up2Play.backend.Exception.ErroresPerfil.EditarPerfilDenegadoException;
import com.Up2Play.backend.Exception.ErroresPerfil.PerfilNoEncontradoException;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Perfil;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.PerfilRepository;
import com.Up2Play.backend.Repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class PerfilService {

    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;

    public PerfilService(PerfilRepository perfilRepository, UsuarioRepository usuarioRepository) {
        this.perfilRepository = perfilRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Perfil crearPerfil(Usuario usuario) {

        Perfil p = new Perfil();

        p.setNombre("Nombre");
        p.setApellido("Apellido");
        p.setTelefono(null);
        p.setSexo(null);
        p.setFechaNacimiento(null);
        p.setIdiomas(null);
        p.setUsuario(usuario);
        p.setEmail(usuario.getEmail());
        p.setImagenPerfil(1);

        return perfilRepository.save(p);

    }

    public Perfil EditarPerfil(Long perfilId, PerfilDto perfilDto, Long usuarioId) {

        Perfil perfil = perfilRepository.findById(perfilId)
                .orElseThrow(() -> new PerfilNoEncontradoException("Perfil no encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        if (!perfil.getUsuario().getId().equals(usuario.getId())) {
            throw new EditarPerfilDenegadoException("No tienes permiso para editar este perfil");
        } else {

            perfil.setNombre(perfilDto.getNombre());
            perfil.setApellido(perfilDto.getApellido());
            perfil.setTelefono(perfilDto.getTelefono());
            perfil.setSexo(perfilDto.getSexo());
            perfil.setFechaNacimiento(perfilDto.getFechaNacimiento());
            perfil.setIdiomas(perfilDto.getIdiomas());
            perfil.setEmail(usuario.getEmail());
            perfil.setImagenPerfil(perfilDto.getImagenPerfil());
        }

        return perfilRepository.save(perfil);

    }

    @Transactional
    public PerfilDtoResp obtenerPerfil(Long id) {
        PerfilDtoResp dto = perfilRepository.findById(id)
                .map(p -> new PerfilDtoResp(
                        p.getId(),
                        p.getNombre(),
                        p.getApellido(),
                        p.getTelefono(),
                        p.getSexo(),
                        p.getFechaNacimiento(),
                        p.getIdiomas(),
                        p.getEmail(),
                        p.getImagenPerfil()))
                .orElseThrow(() -> new PerfilNoEncontradoException("Perfil no encontrado"));
        return dto;
    }

}
