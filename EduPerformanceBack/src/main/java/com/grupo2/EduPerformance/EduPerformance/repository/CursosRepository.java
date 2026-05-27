package com.grupo2.EduPerformance.EduPerformance.repository;

import com.grupo2.EduPerformance.EduPerformance.model.entity.Cursos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// Repositorio para la entidad Cursos.
@Repository
public interface CursosRepository extends JpaRepository<Cursos, Long> {
    List<Cursos> findByUsuarioId(Long usuarioId);
}
