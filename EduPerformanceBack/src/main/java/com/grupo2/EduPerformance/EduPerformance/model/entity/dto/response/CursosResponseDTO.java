package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response;

import lombok.*;

// Lo que el cliente recibe al consultar un Curso.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CursosResponseDTO {

    private Long id;
    private String nombre;
    private String descripcion;

    // Solo el nombre del profesor asignado — sin anidar el objeto Usuario
    // Evita el bucle: Curso → Usuario → List<Cursos> → Curso → ...
    private String nombreProfesor;
}
