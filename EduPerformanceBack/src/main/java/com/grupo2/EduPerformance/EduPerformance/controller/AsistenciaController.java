package com.grupo2.EduPerformance.EduPerformance.controller;

import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request.AsistenciaRequestDTO;
import com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response.AsistenciaResponseDTO;
import com.grupo2.EduPerformance.EduPerformance.service.AsistenciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    @Autowired
    private AsistenciaService service;

    // Obtiene todas las asistencias.
    @GetMapping
    public List<AsistenciaResponseDTO> getAll() {
        return service.findAll();
    }

    // Obtiene una asistencia por su ID.
    @GetMapping("/{id}")
    public ResponseEntity<AsistenciaResponseDTO> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crea una nueva asistencia.
    @PostMapping
    public AsistenciaResponseDTO create(@Valid @RequestBody AsistenciaRequestDTO dto) {
        return service.save(dto);
    }

    // Actualiza una asistencia existente.
    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody AsistenciaRequestDTO dto) {
        try {
            return ResponseEntity.ok(service.update(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Elimina una asistencia por su ID.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Busca asistencias filtradas por curso y fecha.
    @GetMapping("/curso/{cursoId}/fecha/{fecha}")
    public ResponseEntity<List<AsistenciaResponseDTO>> getByCursoAndFecha(
            @PathVariable Long cursoId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(service.findByCursoAndFecha(cursoId, fecha));
    }
}