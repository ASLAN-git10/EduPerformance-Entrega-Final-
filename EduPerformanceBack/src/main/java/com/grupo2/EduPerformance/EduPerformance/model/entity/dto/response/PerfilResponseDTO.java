package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.response;

import lombok.*;

// Lo que el cliente recibe al consultar un Perfil.
// No anida el objeto Usuario completo — solo su ID como referencia.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilResponseDTO {

    private Long id;
    private String direccion;
    private String telefono;

    // Solo el ID del usuario dueño de este perfil.
    // Si el frontend necesita más datos del usuario,
    // hace GET /api/usuarios/{usuarioId} por separado.
    private Long usuarioId;
    private String nombreUsuario; // nombre + apellido para mostrar en UI
}

