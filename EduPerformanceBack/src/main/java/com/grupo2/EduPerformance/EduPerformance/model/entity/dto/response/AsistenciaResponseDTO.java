package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response;

import lombok.*;
import java.time.LocalDate;

// Lo que el cliente recibe al consultar una Asistencia.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsistenciaResponseDTO {

    private Long id;
    private LocalDate fecha;
    private Boolean presente;

    // Nombres legibles — sin anidar objetos completos
    private String nombreEstudiante;
    private String nombreCurso;

    // IDs para vinculación en frontend
    private Long estudianteId;
    private Long cursoId;
}
