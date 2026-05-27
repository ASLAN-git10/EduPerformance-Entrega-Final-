package com.grupo2.EduPerformance.EduPerformance.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

// Entidad Cursos.
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "cursos")
public class Cursos {

    // Identificador único del curso.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del curso.
    private String nombre;

    // Descripción del curso.
    private String descripcion;

    // Profesor asignado (Relación Muchos a Uno).
    @ManyToOne(fetch = FetchType.LAZY) // LAZY para rendimiento
    @JoinColumn(name = "usuario_id") // FK en la tabla cursos
    @JsonBackReference // Evita recursión infinita al serializar
    private Usuario usuario;

}
