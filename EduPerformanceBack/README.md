# EduPerformance

Optimizar la gestión académica por medio de una plataforma moderna, tanto para el estudiante como para el docente.

## Introducción / Contexto

- Los estudiantes y profesores carecen de herramientas integradas que les permitan gestionar eficazmente el tiempo, las tareas y los proyectos académicos.
- Una plataforma académica moderna mejora la productividad, fomenta la organización y contribuye al éxito académico, con impacto positivo tanto en la comunidad estudiantil como en la gestión docente.
- Gestión académica universitaria enfocada en la administración de cursos, tareas, proyectos y comunicación entre estudiantes y docentes.

## Objetivos

**Objetivo General**

- Desarrollar un proyecto fullstack (backend, frontend y bases de datos) robusto que soporte la gestión académica universitaria de manera eficiente y escalable.

**Objetivos Específicos**

- Diseñar la arquitectura backend utilizando Spring Boot y JPA bajo un patrón Multicapa (Controller - Service - Repository).
- Implementar servicios REST y lógica de negocio avanzada para la gestión de estudiantes, docentes, calificaciones y cursos.
- Garantizar seguridad, escalabilidad e interoperabilidad (CORS, Swagger, Global Exceptions) para consumir los datos desde cualquier Front-End.
- Documentar el proyecto siguiendo estrictos estándares profesionales, arquitectónicos y comerciales.

---

## 🚀 Actualizaciones y Características Implementadas (v1.0 API)

La arquitectura backend ha sido elevada a categoría empresarial (Enterprise-Grade), contando con las siguientes fortalezas técnicas y de diseño:

1. **Lógica de Negocio y Seguridad de Datos (Feature Level):**
   - **Motor de Calificaciones:** Cálculo automático de promedios ("al vuelo") y bloqueo estricto contra notas fuera del rango permitido (0.0 - 5.0).
   - **Control de Asistencia:** Restricciones anti-fraude que bloquean el registro de asistencias con fechas futuras (`LocalDate.now()`).
   - **Matrículas Protegidas:** Sistema de inyección cruzada que evita la doble matriculación de un estudiante en el mismo curso.

2. **Arquitectura Desacoplada Basada en DTOs:**
   - **Patrón Request/Response DTO:** Implementación sistemática de clases `*RequestDTO` y `*ResponseDTO` para separar por completo la capa de persistencia (Entidades de Hibernate) de la capa de red.
   - **DTOs Planos:** Las peticiones y respuestas transmiten IDs de referencia planos (`usuarioId`, `estudianteId`, `cursoId`) en lugar de objetos completos anidados, optimizando el ancho de banda y eliminando ciclos de serialización infinita de JSON.
   - **Bean Validation:** Validación de entrada estricta mediante anotaciones de Jakarta (`@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Max`, `@DecimalMin`, `@DecimalMax`).

3. **Optimización del Esquema Relacional (Persistencia PostgreSQL):**
   - **Eliminación de Redundancia (`profesor_curso`):** Se eliminó la tabla intermedia redundante y la relación Many-to-Many entre profesor y curso. Ahora, las asignaturas se resuelven dinámicamente mediante consultas a la clave foránea en la tabla `cursos`, previniendo inconsistencias.
   - **Consistencia mediante Cascadas:** Configuración de `CascadeType.ALL` y `orphanRemoval = true` en la relación de `Usuario` con `Estudiante` y `Profesor` para asegurar la integridad referencial y purgar roles automáticamente cuando se elimina un usuario.
   - **Semilla de Datos Premium (`DataSeeder`):** Inicialización automática de la base de datos con cuentas y perfiles de prueba que incluyen códigos de alumno, departamentos y semestres.

4. **Robustez y Experiencia de Integración (Developer Experience):**
   - **Manejo Global de Excepciones (@ControllerAdvice):** Centralización de errores con un `GlobalExceptionHandler` que traduce fallos en respuestas JSON estructuradas.
   - **Excepciones Personalizadas (`ResourceNotFoundException`):** Lanzamiento de respuestas HTTP 404 consistentes cuando un recurso no existe.
   - **Validación Específica por Campo:** Las violaciones de Bean Validation (`MethodArgumentNotValidException`) se capturan y retornan detalladas por campo (HTTP 400 Bad Request) en lugar de fallar con un error 500 genérico.
   - **Swagger / OpenAPI 3:** Integración total. Documentación interactiva en vivo accesible en `localhost:8080/swagger-ui.html`.
   - **CORS Habilitado:** Configuración flexible para aceptar peticiones de múltiples orígenes de frontend (ej. puertos `:5173`, `:3000`).
   - **Lombok Integration:** Reducción de código repetitivo (Boilerplate) para mantener el enfoque en la lógica de negocio.

Para revisar en detalle la documentación técnica, manuales para Swagger, Casos de Uso y la [Explicación Técnica Comercial (Enterprise-Grade)](./doc/Explicacion_Tecnica_EduPerformance.md), visita la **[Carpeta `/doc` de este repositorio](./doc)**.

---

## Alcance del Proyecto (Scope)

**Qué se ha desarrollado (Backend):**
- Módulos robustos de gestión académica (Estudiantes, Perfiles, Profesores, Cursos, Calificaciones y Asistencias).
- API REST blindada con manejo de errores JSON estandarizado.
- Arquitectura Limpia basada en Inversión de Control de Spring.
- Documentación y Entorno visual automatizado (Swagger).

**Qué NO se va a desarrollar en esta versión (fuera de alcance):**
- Integración con sistemas externos de matrícula financiera o pagos.
- Funcionalidades avanzadas de analítica académica profunda (ej. Machine Learning).

---

## Tecnologías y Herramientas (Tech Stack)

- **Backend**: Spring Initializr, Java 21, Spring Data JPA, Lombok, Springdoc (Swagger OpenAPI 3).
- **Frontend**: React + Vite + Tailwind CSS.
- **Base de datos**: PostgreSQL en producción, H2 en desarrollo inicial.
- **Otras herramientas**: Git, GitHub, Postman, Swagger UI.

---

## Integrantes del Equipo

| Nombre            | Rol principal                  | Correo / Usuario GitHub           |
|-------------------|--------------------------------|-----------------------------------|
| Sergio Atehortua  | Líder / Backend                | salejandro.atehortua@udea.edu.co  |
| Alison Díaz       | Frontend Lead                  | alinson_04@hotmail.com            |
| Jeison ossa       | Backend / Base de datos        | @yeisonossa3010@gmail.com         |

---

## Diagrama de Clases del Dominio (v1)

![Diagrama de Dominion v1](/doc/diagrama-dominio-v1.png)
