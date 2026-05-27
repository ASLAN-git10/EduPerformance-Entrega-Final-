package com.grupo2.EduPerformance.EduPerformance.model.entity;

import jakarta.persistence.*;
import lombok.*;

// Entidad Calificacion.
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "calificaciones")
public class Calificacion {

    // Identificador único de la calificación.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Valor numérico de la nota.
    private Double nota;

    // Relación con el estudiante evaluado.
    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;

    // Relación con el curso correspondiente.
    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Cursos curso;

    // Ponderación porcentual de la calificación (ej: 25, 30)
    private Integer porcentaje;

    // Nombre o descripción de la actividad (ej: "Taller 1: CSS Premium")
    private String actividad;

    // Fecha en la que se registró la calificación
    private java.time.LocalDate fecha;

    // Comentarios u observaciones adicionales del docente
    private String observacion;
}
