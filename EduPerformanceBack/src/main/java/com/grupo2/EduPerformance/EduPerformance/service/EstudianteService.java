package com.grupo2.EduPerformance.EduPerformance.service;

import com.grupo2.EduPerformance.EduPerformance.exception.ReglaNegocioException;
import com.grupo2.EduPerformance.EduPerformance.exception.ResourceNotFoundException;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.EstudianteRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.EstudianteResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Cursos;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Estudiante;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Usuario;
import com.grupo2.EduPerformance.EduPerformance.repository.CursosRepository;
import com.grupo2.EduPerformance.EduPerformance.repository.EstudianteRepository;
import com.grupo2.EduPerformance.EduPerformance.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository repository;

    @Autowired
    private CursosRepository cursosRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ── Mapeo Entidad → ResponseDTO ──────────────────────────
    // Método privado reutilizado en todos los métodos del service.
    private EstudianteResponseDTO toResponseDTO(Estudiante e) {
        EstudianteResponseDTO dto = new EstudianteResponseDTO();
        dto.setId(e.getId());
        dto.setCodigo(e.getCodigo());
        dto.setCarrera(e.getCarrera());
        dto.setSemestre(e.getSemestre());

        if (e.getUsuario() != null) {
            Usuario u = e.getUsuario();
            dto.setUsuarioId(u.getId());
            // Combina nombre y apellido en un solo campo
            dto.setNombreCompleto(u.getNombre() + " " + u.getApellido());
            dto.setEmail(u.getEmail());
            dto.setEdad(u.getEdad());
        }

        if (e.getCursos() != null) {
            // Convierte List<Cursos> → List<String> con solo los nombres
            // Esto elimina completamente el riesgo de bucle de serialización
            dto.setCursos(
                    e.getCursos().stream()
                            .map(Cursos::getNombre)
                            .collect(Collectors.toList()));
        }
        return dto;
    }

    // ── Mapeo RequestDTO → Entidad ───────────────────────────
    private Estudiante toEntity(EstudianteRequestDTO dto) {
        Estudiante estudiante = new Estudiante();
        // Busca el Usuario por ID — si no existe, lanza excepción clara
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con ID: " + dto.getUsuarioId()));
        estudiante.setUsuario(usuario);
        estudiante.setCodigo(dto.getCodigo());
        estudiante.setCarrera(dto.getCarrera());
        estudiante.setSemestre(dto.getSemestre());
        return estudiante;
    }

    // ── Métodos CRUD ─────────────────────────────────────────

    public List<EstudianteResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<EstudianteResponseDTO> findById(Long id) {
        return repository.findById(id).map(this::toResponseDTO);
    }

    @Transactional
    public EstudianteResponseDTO save(EstudianteRequestDTO dto) {
        return toResponseDTO(repository.save(toEntity(dto)));
    }

    @Transactional
    public EstudianteResponseDTO update(Long id, EstudianteRequestDTO dto) {
        Estudiante existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Estudiante no encontrado con ID: " + id));

        // Actualiza solo el usuario — conserva los cursos ya matriculados
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con ID: " + dto.getUsuarioId()));

        existente.setUsuario(usuario);
        existente.setCodigo(dto.getCodigo());
        existente.setCarrera(dto.getCarrera());
        existente.setSemestre(dto.getSemestre());
        // No tocamos existente.getCursos() — se conservan las matrículas
        return toResponseDTO(repository.save(existente));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<EstudianteResponseDTO> findByCurso(Long cursoId) {
        return repository.findByCursos_Id(cursoId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Lógica de negocio: matrícula ─────────────────────────
    @Transactional // si el save() falla, el add() también se revierte
    public EstudianteResponseDTO matricularEstudiante(Long estudianteId, Long cursoId) {
        Estudiante estudiante = repository.findById(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado."));

        Cursos curso = cursosRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado."));

        if (estudiante.getCursos().contains(curso)) {
            throw new ReglaNegocioException(
                    "El estudiante ya está matriculado en este curso.");
        }

        estudiante.getCursos().add(curso);
        return toResponseDTO(repository.save(estudiante));
    }
}