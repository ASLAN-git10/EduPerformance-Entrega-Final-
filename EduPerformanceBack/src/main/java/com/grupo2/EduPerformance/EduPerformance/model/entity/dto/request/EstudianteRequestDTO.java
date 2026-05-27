package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstudianteRequestDTO {
    @NotNull(message = "El ID del estudiante es obligatorio")
    private Long usuarioId;

    private String codigo;

    private String carrera;

    private Integer semestre;


}
