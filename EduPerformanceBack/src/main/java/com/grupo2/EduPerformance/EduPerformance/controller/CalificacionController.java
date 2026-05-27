package com.grupo2.EduPerformance.EduPerformance.controller;

import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.CalificacionRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.CalificacionResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.service.CalificacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionController {

    @Autowired
    private CalificacionService service;

    @GetMapping
    public List<CalificacionResponseDTO> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalificacionResponseDTO> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CalificacionResponseDTO create(
            @Valid @RequestBody CalificacionRequestDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalificacionResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CalificacionRequestDTO dto) {
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

    @GetMapping("/estudiante/{estudianteId}/curso/{cursoId}")
    public ResponseEntity<List<CalificacionResponseDTO>> getByEstudianteAndCurso(
            @PathVariable Long estudianteId,
            @PathVariable Long cursoId) {
        return ResponseEntity.ok(
                service.findByEstudianteAndCurso(estudianteId, cursoId));
    }

    @GetMapping("/promedio/estudiante/{estudianteId}/curso/{cursoId}")
    public ResponseEntity<Double> getPromedio(
            @PathVariable Long estudianteId,
            @PathVariable Long cursoId) {
        return ResponseEntity.ok(service.calcularPromedio(estudianteId, cursoId));
    }
}