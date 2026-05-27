package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

// Lo que el cliente envía para registrar una Asistencia.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaRequestDTO {

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    // true = presente, false = ausente
    // No @NotNull porque false es un valor válido, no ausencia de valor
    private Boolean presente;

    @NotNull(message = "El ID del estudiante es obligatorio")
    private Long estudianteId;

    @NotNull(message = "El ID del curso es obligatorio")
    private Long cursoId;
}