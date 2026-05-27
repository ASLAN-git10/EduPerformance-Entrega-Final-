package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

// Lo que el cliente envía para registrar una Calificacion.
// Usa IDs en lugar de objetos completos.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CalificacionRequestDTO {

    // La validación de rango también aquí como primera barrera.
    // El Service la valida también como segunda barrera (defensa en profundidad).
    @NotNull(message = "La nota es obligatoria")
    @DecimalMin(value = "0.0", message = "La nota mínima es 0.0")
    @DecimalMax(value = "5.0", message = "La nota máxima es 5.0")
    private Double nota;

    // IDs de referencia — no objetos anidados
    @NotNull(message = "El ID del estudiante es obligatorio")
    private Long estudianteId;

    @NotNull(message = "El ID del curso es obligatorio")
    private Long cursoId;

    private Integer porcentaje;

    private String actividad;

    private java.time.LocalDate fecha;

    private String observacion;
}