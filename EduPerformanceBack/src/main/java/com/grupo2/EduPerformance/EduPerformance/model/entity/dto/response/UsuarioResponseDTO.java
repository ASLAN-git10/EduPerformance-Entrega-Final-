package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response;

import lombok.*;

// Lo que el cliente recibe al consultar un Usuario.
// Combina nombre + apellido y anida el perfil de forma segura.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {

    private Long id;

    // Combinamos nombre y apellido en un solo campo legible
    private String nombreCompleto;

    private Integer edad;
    private String email;

    // Datos del perfil aplanados — sin anidar el objeto Perfil completo
    private String direccion;
    private String telefono;
}