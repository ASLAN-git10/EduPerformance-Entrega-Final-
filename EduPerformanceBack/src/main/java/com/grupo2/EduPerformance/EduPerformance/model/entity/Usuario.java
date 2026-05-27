package com.grupo2.EduPerformance.EduPerformance.model.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

// Entidad Usuario base.
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Usuario {
    // Identificador único del usuario.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del usuario.
    @Column(length = 30, nullable = false)
    private String nombre;

    // Apellido del usuario.
    private String apellido;

    // Edad del usuario.
    private Integer edad;

    // Correo electrónico único.
    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Relación Uno a Uno con Perfil.
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Perfil perfil;

    // Relaciones Uno a Uno bidireccionales con Estudiante y Profesor para permitir cascades limpios
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Estudiante estudiante;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Profesor profesor;

    // Lista de cursos asociados al usuario.
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Permite serializar esta parte
    private List<Cursos> cursos = new ArrayList<>();
}
