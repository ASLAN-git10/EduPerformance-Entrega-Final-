package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfesorRequestDTO {

    @NotNull(message = "El Id de usuario es obligatorio")
    private Long usuarioId;

    private String codigo;

    private String departamento;

    private String especialidad;

}
