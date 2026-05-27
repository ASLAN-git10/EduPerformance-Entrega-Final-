package com.grupo2.EduPerformance.EduPerformance.controller;

import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.EstudianteRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.EstudianteResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.service.EstudianteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService service;

    @GetMapping
    public List<EstudianteResponseDTO> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteResponseDTO> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // @Valid activa las anotaciones @NotNull, @NotBlank, etc. del DTO
    @PostMapping
    public EstudianteResponseDTO create(@Valid @RequestBody EstudianteRequestDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstudianteResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody EstudianteRequestDTO dto) {
        try {
            return ResponseEntity.ok(service.update(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<EstudianteResponseDTO>> getByCurso(
            @PathVariable Long cursoId) {
        return ResponseEntity.ok(service.findByCurso(cursoId));
    }

    @PostMapping("/{id}/matricular/{cursoId}")
    public ResponseEntity<EstudianteResponseDTO> matricular(
            @PathVariable Long id,
            @PathVariable Long cursoId) {
        try {
            return ResponseEntity.ok(service.matricularEstudiante(id, cursoId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}