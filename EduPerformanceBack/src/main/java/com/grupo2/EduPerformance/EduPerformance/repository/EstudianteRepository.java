package com.grupo2.EduPerformance.EduPerformance.repository;

import com.grupo2.EduPerformance.EduPerformance.model.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repositorio para la entidad Estudiante.
@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    // Busca estudiantes inscritos en un curso.
    List<Estudiante> findByCursos_Id(Long cursoId);
}
