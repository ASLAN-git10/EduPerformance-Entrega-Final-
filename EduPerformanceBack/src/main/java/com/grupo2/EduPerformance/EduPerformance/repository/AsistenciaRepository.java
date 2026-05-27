package com.grupo2.EduPerformance.EduPerformance.repository;

import com.grupo2.EduPerformance.EduPerformance.model.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

// Repositorio para la entidad Asistencia.
@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    // Busca asistencias por curso y fecha.
    List<Asistencia> findByCursoIdAndFecha(Long cursoId, LocalDate fecha);
}
