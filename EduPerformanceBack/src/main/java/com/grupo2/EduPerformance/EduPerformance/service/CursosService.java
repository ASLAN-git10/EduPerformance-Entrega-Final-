package com.grupo2.EduPerformance.EduPerformance.service;

import com.grupo2.EduPerformance.EduPerformance.exception.ResourceNotFoundException;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.CursosRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.CursosResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Cursos;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Usuario;
import com.grupo2.EduPerformance.EduPerformance.repository.CursosRepository;
import com.grupo2.EduPerformance.EduPerformance.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CursosService {

    @Autowired
    private CursosRepository repository;

    // Necesario para asignar el profesor (Usuario) al curso
    @Autowired
    private UsuarioRepository usuarioRepository;

    // ── Mapeo Entidad → ResponseDTO ──────────────────────────
    private CursosResponseDTO toResponseDTO(Cursos c) {
        CursosResponseDTO dto = new CursosResponseDTO();
        dto.setId(c.getId());
        dto.setNombre(c.getNombre());
        dto.setDescripcion(c.getDescripcion());

        // Muestra el nombre del profesor asignado
        // Sin anidar el objeto Usuario completo — evita el bucle
        // Usuario → List<Cursos> → Usuario → ...
        if (c.getUsuario() != null) {
            Usuario u = c.getUsuario();
            dto.setNombreProfesor(u.getNombre() + " " + u.getApellido());
        }

        return dto;
    }

    // ── Mapeo RequestDTO → Entidad ───────────────────────────
    private Cursos toEntity(CursosRequestDTO dto) {
        Cursos curso = new Cursos();
        curso.setNombre(dto.getNombre());
        curso.setDescripcion(dto.getDescripcion());

        // Vincula el Usuario (profesor) si se envía usuarioId
        if (dto.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Usuario no encontrado con ID: " + dto.getUsuarioId()));
            curso.setUsuario(usuario);
        }

        return curso;
    }

    // ── Métodos CRUD ─────────────────────────────────────────

    public List<CursosResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<CursosResponseDTO> findById(Long id) {
        return repository.findById(id).map(this::toResponseDTO);
    }

    @Transactional
    public CursosResponseDTO save(CursosRequestDTO dto) {
        return toResponseDTO(repository.save(toEntity(dto)));
    }

    @Transactional
    public CursosResponseDTO update(Long id, CursosRequestDTO dto) {
        Cursos existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Curso no encontrado con ID: " + id));

        // Actualiza campo a campo
        existente.setNombre(dto.getNombre());
        existente.setDescripcion(dto.getDescripcion());

        // Actualiza el profesor asignado si se envía nuevo usuarioId
        if (dto.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Usuario no encontrado con ID: " + dto.getUsuarioId()));
            existente.setUsuario(usuario);
        }

        return toResponseDTO(repository.save(existente));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}