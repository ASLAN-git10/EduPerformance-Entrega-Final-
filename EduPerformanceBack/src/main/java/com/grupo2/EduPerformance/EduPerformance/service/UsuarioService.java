package com.grupo2.EduPerformance.EduPerformance.service;

import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.UsuarioRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.UsuarioResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Perfil;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Usuario;
import com.grupo2.EduPerformance.EduPerformance.repository.PerfilRepository;
import com.grupo2.EduPerformance.EduPerformance.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.grupo2.EduPerformance.EduPerformance.exception.ResourceNotFoundException;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    // ── Mapeo Entidad → ResponseDTO ──────────────────────────
    private UsuarioResponseDTO toResponseDTO(Usuario u) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(u.getId());
        dto.setNombreCompleto(u.getNombre() + " " + u.getApellido());
        dto.setEdad(u.getEdad());
        dto.setEmail(u.getEmail());
        // ✅ password NO se mapea al ResponseDTO — nunca sale de la BD hacia el cliente

        if (u.getPerfil() != null) {
            dto.setDireccion(u.getPerfil().getDireccion());
            dto.setTelefono(u.getPerfil().getTelefono());
        }
        return dto;
    }

    // ── Mapeo RequestDTO → Entidad ───────────────────────────
    private Usuario toEntity(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setEdad(dto.getEdad());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword()); // 🔐 En un caso real, aquí se debería hashear el password antes de guardarlo

        return usuario;
    }

    // ── Métodos CRUD ─────────────────────────────────────────

    public List<UsuarioResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioResponseDTO> findById(Long id) {
        return repository.findById(id).map(this::toResponseDTO);
    }

    @Transactional
    public UsuarioResponseDTO save(UsuarioRequestDTO dto) {
        return toResponseDTO(repository.save(toEntity(dto)));
    }

    @Transactional
    public UsuarioResponseDTO update(Long id, UsuarioRequestDTO dto) {
        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con ID: " + id));

        existente.setNombre(dto.getNombre());
        existente.setApellido(dto.getApellido());
        existente.setEdad(dto.getEdad());
        existente.setEmail(dto.getEmail());

        // 🔐 Solo re-hashea si el cliente envía un password nuevo
        // Evita re-hashear un hash ya existente si el cliente lo envía igual
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existente.setPassword(dto.getPassword());
        }

        return toResponseDTO(repository.save(existente));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}