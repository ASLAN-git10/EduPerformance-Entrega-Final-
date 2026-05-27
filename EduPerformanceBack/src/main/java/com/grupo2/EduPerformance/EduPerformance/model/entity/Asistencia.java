package com.grupo2.EduPerformance.EduPerformance.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

// Entidad que representa la asistencia de un Estudiante.
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "asistencias")
public class Asistencia {

    // Identificador único de la asistencia.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Fecha en la que se tomó la asistencia.
    private LocalDate fecha;

    // Indica si el estudiante estuvo presente (true) o ausente (false).
    private Boolean presente;

    // Relación con el estudiante (Muchos a Uno).
    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;

    // Relación con el curso (Muchos a Uno).
    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Cursos curso;
}
