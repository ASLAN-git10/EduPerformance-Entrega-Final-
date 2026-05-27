package com.grupo2.EduPerformance.EduPerformance.service;

import com.grupo2.EduPerformance.EduPerformance.exception.ResourceNotFoundException;
import com.grupo2.EduPerformance.EduPerformance.exception.ReglaNegocioException;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Usuario;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.CalificacionRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.CalificacionResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Calificacion;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Cursos;
import com.grupo2.EduPerformance.EduPerformance.model.entity.Estudiante;
import com.grupo2.EduPerformance.EduPerformance.repository.CalificacionRepository;
import com.grupo2.EduPerformance.EduPerformance.repository.CursosRepository;
import com.grupo2.EduPerformance.EduPerformance.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CalificacionService {

    @Autowired
    private CalificacionRepository repository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private CursosRepository cursosRepository;

    // ── Mapeo Entidad → ResponseDTO ──────────────────────────
    private CalificacionResponseDTO toResponseDTO(Calificacion c) {
        CalificacionResponseDTO dto = new CalificacionResponseDTO();
        dto.setId(c.getId());
        dto.setNota(c.getNota());
        dto.setPorcentaje(c.getPorcentaje());
        dto.setActividad(c.getActividad());
        dto.setFecha(c.getFecha());
        dto.setObservacion(c.getObservacion());

        // Nombre del estudiante — navega la relación de forma segura
        if (c.getEstudiante() != null) {
            dto.setEstudianteId(c.getEstudiante().getId());
            if (c.getEstudiante().getUsuario() != null) {
                Usuario u = c.getEstudiante().getUsuario();
                dto.setNombreEstudiante(u.getNombre() + " " + u.getApellido());
            }
        }

        // Nombre del curso
        if (c.getCurso() != null) {
            dto.setCursoId(c.getCurso().getId());
            dto.setNombreCurso(c.getCurso().getNombre());
        }
        return dto;
    }

    // ── Mapeo RequestDTO → Entidad ───────────────────────────
    private Calificacion toEntity(CalificacionRequestDTO dto) {
        Calificacion cal = new Calificacion();
        cal.setNota(dto.getNota());
        cal.setPorcentaje(dto.getPorcentaje());
        cal.setActividad(dto.getActividad());
        cal.setFecha(dto.getFecha());
        cal.setObservacion(dto.getObservacion());

        Estudiante estudiante = estudianteRepository.findById(dto.getEstudianteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Estudiante no encontrado con ID: " + dto.getEstudianteId()));
        cal.setEstudiante(estudiante);

        Cursos curso = cursosRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Curso no encontrado con ID: " + dto.getCursoId()));
        cal.setCurso(curso);

        return cal;
    }

    // ── Métodos CRUD ─────────────────────────────────────────

    public List<CalificacionResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<CalificacionResponseDTO> findById(Long id) {
        return repository.findById(id).map(this::toResponseDTO);
    }

    @Transactional
    public CalificacionResponseDTO save(CalificacionRequestDTO dto) {
        // Segunda barrera de validación (la primera es @DecimalMin/@DecimalMax en el
        // DTO)
        if (dto.getNota() < 0.0 || dto.getNota() > 5.0) {
            throw new ReglaNegocioException("La nota debe estar entre 0.0 y 5.0");
        }
        return toResponseDTO(repository.save(toEntity(dto)));
    }

    @Transactional
    public CalificacionResponseDTO update(Long id, CalificacionRequestDTO dto) {
        Calificacion existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Calificación no encontrada con ID: " + id));

        if (dto.getNota() < 0.0 || dto.getNota() > 5.0) {
            throw new ReglaNegocioException("La nota debe estar entre 0.0 y 5.0");
        }

        // Actualiza solo los campos — no reemplaza el objeto completo
        existente.setNota(dto.getNota());
        existente.setPorcentaje(dto.getPorcentaje());
        existente.setActividad(dto.getActividad());
        existente.setFecha(dto.getFecha());
        existente.setObservacion(dto.getObservacion());

        Estudiante est = estudianteRepository.findById(dto.getEstudianteId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado."));
        existente.setEstudiante(est);

        Cursos curso = cursosRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado."));
        existente.setCurso(curso);

        return toResponseDTO(repository.save(existente));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<CalificacionResponseDTO> findByEstudianteAndCurso(
            Long estudianteId, Long cursoId) {
        return repository.findByEstudianteIdAndCursoId(estudianteId, cursoId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Lógica de negocio: promedio ──────────────────────────
    public double calcularPromedio(Long estudianteId, Long cursoId) {
        List<Calificacion> notas = repository.findByEstudianteIdAndCursoId(estudianteId, cursoId);
        if (notas.isEmpty())
            return 0.0;
        return notas.stream().mapToDouble(Calificacion::getNota).average().orElse(0.0);
        // .average() es más idiomático que suma/tamaño manual
    }
}