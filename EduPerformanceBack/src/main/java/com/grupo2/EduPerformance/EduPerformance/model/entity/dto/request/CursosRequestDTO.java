package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

// Lo que el cliente envía para crear/actualizar un Curso.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CursosRequestDTO {

    @NotBlank(message = "El nombre del curso es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripción no puede superar 500 caracteres")
    private String descripcion;

    // ID del usuario (profesor) asignado al curso
    // No se manda el objeto Usuario completo
    private Long usuarioId;
}
