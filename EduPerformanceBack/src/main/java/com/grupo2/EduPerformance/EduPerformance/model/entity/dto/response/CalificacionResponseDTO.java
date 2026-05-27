package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response;

import lombok.*;

// Lo que el cliente recibe al consultar una Calificacion.
// Muestra nombres legibles en lugar de objetos anidados.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalificacionResponseDTO {

    private Long id;
    private Double nota;

    // Nombre del estudiante — legible directamente, sin anidar el objeto
    private String nombreEstudiante;

    // Nombre del curso
    private String nombreCurso;

    private Integer porcentaje;
    private String actividad;
    private java.time.LocalDate fecha;
    private String observacion;

    // También exponemos los IDs para que el frontend pueda vincularlos fácilmente
    private Long estudianteId;
    private Long cursoId;
}
