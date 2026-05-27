package com.grupo2.EduPerformance.EduPerformance.repository;

import com.grupo2.EduPerformance.EduPerformance.model.entity.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// Repositorio para la entidad Perfil.
@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {
    // Busca el perfil de un usuario por su ID
    // Usado en PerfilService.findByUsuarioId()
    Optional<Perfil> findByUsuarioId(Long usuarioId);

    // Verifica si un usuario ya tiene perfil antes de crear uno nuevo
    // Usado en PerfilService.toEntity() para evitar duplicados
    boolean existsByUsuarioId(Long usuarioId);
}
