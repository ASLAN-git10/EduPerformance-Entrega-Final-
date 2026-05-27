package com.grupo2.EduPerformance.EduPerformance.service;

import com.grupo2.EduPerformance.EduPerformance.exception.ResourceNotFoundException;
import com.grupo2.EduPerformance.EduPerformance.exception.ReglaNegocioException;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.ProfesorRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.ProfesorResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Cursos;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Profesor;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Usuario;
import com.grupo2.EduPerformance.EduPerformance.repository.CursosRepository;
import com.grupo2.EduPerformance.EduPerformance.repository.ProfesorRepository;
import com.grupo2.EduPerformance.EduPerformance.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfesorService {

    @Autowired
    private ProfesorRepository repository;

    @Autowired
    private CursosRepository cursosRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ── Mapeo Entidad → ResponseDTO ──────────────────────────
    private ProfesorResponseDTO toResponseDTO(Profesor p) {
        ProfesorResponseDTO dto = new ProfesorResponseDTO();
        dto.setId(p.getId());
        dto.setCodigo(p.getCodigo());
        dto.setDepartamento(p.getDepartamento());
        dto.setEspecialidad(p.getEspecialidad());

        if (p.getUsuario() != null) {
            Usuario u = p.getUsuario();
            dto.setUsuarioId(u.getId());
            dto.setNombreCompleto(u.getNombre() + " " + u.getApellido());
            dto.setEmail(u.getEmail());
            dto.setEdad(u.getEdad());

            // Query taught courses dynamically from courses database table using our new query
            List<Cursos> taughtCursos = cursosRepository.findByUsuarioId(u.getId());
            dto.setCursos(
                    taughtCursos.stream()
                            .map(Cursos::getNombre)
                            .collect(Collectors.toList()));
        }

        return dto;
    }

    // ── Mapeo RequestDTO → Entidad ───────────────────────────
    private Profesor toEntity(ProfesorRequestDTO dto) {
        Profesor profesor = new Profesor();
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con ID: " + dto.getUsuarioId()));
        profesor.setUsuario(usuario);
        profesor.setCodigo(dto.getCodigo());
        profesor.setDepartamento(dto.getDepartamento());
        profesor.setEspecialidad(dto.getEspecialidad());
        return profesor;
    }

    // ── Métodos CRUD ─────────────────────────────────────────

    public List<ProfesorResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProfesorResponseDTO> findById(Long id) {
        return repository.findById(id).map(this::toResponseDTO);
    }

    @Transactional
    public ProfesorResponseDTO save(ProfesorRequestDTO dto) {
        return toResponseDTO(repository.save(toEntity(dto)));
    }

    @Transactional
    public ProfesorResponseDTO update(Long id, ProfesorRequestDTO dto) {
        Profesor existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Profesor no encontrado con ID: " + id));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con ID: " + dto.getUsuarioId()));

        existente.setUsuario(usuario);
        existente.setCodigo(dto.getCodigo());
        existente.setDepartamento(dto.getDepartamento());
        existente.setEspecialidad(dto.getEspecialidad());
        return toResponseDTO(repository.save(existente));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    // ── Lógica de negocio: asignación de curso ───────────────
    @Transactional
    public ProfesorResponseDTO asignarCurso(Long profesorId, Long cursoId) {
        Profesor profesor = repository.findById(profesorId)
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado."));

        Cursos curso = cursosRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado."));

        if (curso.getUsuario() != null && curso.getUsuario().getId().equals(profesor.getUsuario().getId())) {
            throw new ReglaNegocioException(
                    "El profesor ya está asignado a este curso.");
        }

        curso.setUsuario(profesor.getUsuario());
        cursosRepository.save(curso);
        return toResponseDTO(profesor);
    }
}