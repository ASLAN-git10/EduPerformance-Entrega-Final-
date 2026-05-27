package com.grupo2.EduPerformance.EduPerformance.model.entity.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

// Lo que el cliente envía para crear o actualizar un Perfil.
// Perfil es opcional — se puede crear después del Usuario.

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PerfilRequestDTO {

    // Usuario al que pertenece este perfil — obligatorio
    @NotNull(message = "El ID del usuario es obligatorio para crear un perfil")
    private Long usuarioId;

    @Size(max = 200, message = "La dirección no puede superar 200 caracteres")
    private String direccion;

    @Pattern(regexp = "^[0-9\\s\\-\\+]{7,20}$", message = "El teléfono debe tener entre 7 y 20 dígitos")
    private String telefono;

}
