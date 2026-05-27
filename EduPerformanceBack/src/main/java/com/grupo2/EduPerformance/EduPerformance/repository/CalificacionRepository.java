package com.grupo2.EduPerformance.EduPerformance.repository;

import com.grupo2.EduPerformance.EduPerformance.model.entity.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repositorio para la entidad Calificacion.
@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Long> {
    // Busca calificaciones por estudiante y curso.
    List<Calificacion> findByEstudianteIdAndCursoId(Long estudianteId, Long cursoId);
}
