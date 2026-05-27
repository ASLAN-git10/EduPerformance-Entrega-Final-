package com.grupo2.EduPerformance.EduPerformance.controller;

import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.ProfesorResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.ProfesorRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.service.ProfesorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profesores")
public class ProfesorController {

    @Autowired
    private ProfesorService service;

    @GetMapping
    public List<ProfesorResponseDTO> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesorResponseDTO> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProfesorResponseDTO create(@Valid @RequestBody ProfesorRequestDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfesorResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ProfesorRequestDTO dto) {
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

    // Endpoint de asignación — sin cambios en la firma,
    // la lógica mejorada vive en el Service
    @PostMapping("/{id}/asignar/{cursoId}")
    public ResponseEntity<ProfesorResponseDTO> asignarCurso(
            @PathVariable Long id,
            @PathVariable Long cursoId) {
        try {
            return ResponseEntity.ok(service.asignarCurso(id, cursoId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}