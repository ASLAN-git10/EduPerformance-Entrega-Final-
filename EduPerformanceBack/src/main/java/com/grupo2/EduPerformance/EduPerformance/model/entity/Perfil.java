package com.grupo2.EduPerformance.EduPerformance.model.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

// Entidad Perfil con detalles adicionales del Usuario.
@Table(name = "perfiles")
public class Perfil {
    // Identificador único del perfil.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Dirección de residencia.
    private String direccion;

    // Número de teléfono de contacto.
    private String telefono;

    // Relación inversa Uno a Uno con Usuario.
    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    @JsonBackReference
    private Usuario usuario;
}
