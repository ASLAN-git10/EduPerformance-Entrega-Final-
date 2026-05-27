# EduPerformance: Arquitectura y Funcionalidades del Sistema Core

## Resumen Ejecutivo

**EduPerformance** es un motor de gestión académica de grado empresarial (Enterprise-Grade) diseñado para centralizar, automatizar y proteger los procesos críticos de las instituciones educativas. Construido sobre una arquitectura moderna basada en **Java Spring Boot**, este Back-End actúa como el pilar tecnológico que orquesta las operaciones de estudiantes, docentes, cursos, calificaciones y asistencias.

La plataforma trasciende los sistemas tradicionales de almacenamiento al incorporar **lógica de negocio estricta y validaciones en tiempo real**, garantizando la integridad referencial y la pureza de los datos académicos. Gracias a su diseño API RESTful, EduPerformance está completamente preparado para integrarse de forma fluida con múltiples canales de interacción: aplicaciones móviles, portales web (React, Angular, Vue) y sistemas de inteligencia de negocios.

---

## 🏛️ Arquitectura del Sistema

El sistema ha sido diseñado utilizando una **Arquitectura en Capas (Layered Architecture)**, lo cual asegura una alta cohesión y un bajo acoplamiento. Esto permite que el software sea escalable, mantenible y altamente testeable.

1.  **Capa de Presentación (Controllers):** Expone los endpoints RESTful (`/api/*`). Es el punto de entrada para las peticiones HTTP, garantizando respuestas estandarizadas (JSON) y códigos de estado HTTP adecuados.
2.  **Capa de Negocio (Services):** Contiene el corazón del aplicativo. Aquí residen todas las reglas de negocio, validaciones anti-fraude y cálculos dinámicos. Aísla completamente la lógica operativa de la capa de acceso a datos.
3.  **Capa de Acceso a Datos (Repositories):** Utiliza **Spring Data JPA** para interactuar con la base de datos relacional de manera eficiente, segura (prevención de Inyección SQL) y transaccional.
4.  **Capa de Dominio (Entities):** Modelos estructurados utilizando **Hibernate/JPA** que mapean el modelo orientado a objetos directamente con el esquema relacional.
5.  **Capa de Transferencia de Datos (DTOs):** Emplea el patrón *Data Transfer Object* (`*RequestDTO` y `*ResponseDTO`) para desacoplar las entidades de Hibernate de la capa de red. Esto evita referencias cíclicas de JSON en relaciones bidireccionales, reduce el peso de las peticiones (payloads) al transmitir IDs planos (`usuarioId`, `cursoId`, `estudianteId`) en lugar de objetos completos anidados, y blinda la entrada de datos mediante anotaciones de validación (`@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Max`, `@DecimalMin`, `@DecimalMax`).
6.  **Manejo Global de Excepciones:** Un `GlobalExceptionHandler` intercepta cualquier anomalía del sistema y la traduce en una respuesta de error estandarizada (`ErrorResponse`), evitando la fuga de información sensible (Stacktraces) y mejorando la experiencia del desarrollador cliente (Front-End/Mobile).

---

## ⚙️ Capacidades y Lógica de Negocio (Features)

EduPerformance automatiza y blinda los siguientes flujos operativos:

### 1. Gestión de Identidades (Usuarios y Perfiles)
*   **Modelo Extensible:** El sistema separa la información transaccional y de acceso (`Usuario`) de la información demográfica (`Perfil`) mediante una relación uno a uno.
*   **Roles Especializados:** Sobre la base de un `Usuario`, el sistema ramifica el comportamiento hacia entidades operativas como `Estudiante` y `Profesor`.

### 2. Motor Avanzado de Calificaciones
No delegamos las matemáticas críticas a cálculos manuales.
*   **Cálculo de Promedios en Tiempo Real (On-the-Fly):** Se pueden consultar los promedios de notas exactos de un estudiante en una asignatura específica en cualquier momento de manera automatizada.
*   **Blindaje de Integridad:** Reglas de negocio estrictas (`ReglaNegocioException`) rechazan proactivamente calificaciones que violen las convenciones académicas (ej. la nota debe ser estrictamente un valor numérico entre `0.0` y `5.0`), asegurando la pureza procesal de las actas de notas.

### 3. Control Milimétrico de Asistencias
*   **Trazabilidad Histórica:** Permite auditar la asistencia (presente/ausente) cruzando las dimensiones de `Estudiante`, `Curso` y `Fecha`.
*   **Restricción Cronológica:** La inteligencia del servicio bloquea automáticamente el fraude temporal, haciendo imposible registrar la asistencia de un estudiante en una fecha futura a la actual (`LocalDate.now()`).

### 4. Orquestación Dinámica de Matrículas (Cursos)
*   **Asignación Inteligente:** Vinculación de estudiantes (`matricular`) y profesores (`asignarCurso`) a la malla curricular a través de relaciones Muchos-a-Muchos.
*   **Prevención de Duplicidad:** Antes de ejecutar una inserción en base de datos, el sistema verifica transaccionalmente que un estudiante o profesor no esté ya asignado a dicho curso, retornando una alerta temprana (Bad Request) y evitando inconsistencias en los listados.

---

## 🛡️ Seguridad y Tecnologías Utilizadas

*   **Framework Principal:** Java 17+ con Spring Boot 3.x.
*   **Persistencia:** Spring Data JPA / Hibernate (ORM) sobre PostgreSQL.
*   **API y Serialización:** Spring Web (RESTful API) desacoplada con DTOs planos, eliminando el uso innecesario de anotaciones como `@JsonManagedReference` y `@JsonBackReference` que sobrecargaban la lógica del cliente.
*   **Diseño Relacional y Consistencia:**
    *   **Eliminación de Redundancias:** Remoción de la tabla intermedia artificial `profesor_curso`. Ahora las asignaturas se resuelven dinámicamente consultando la clave foránea en la tabla `cursos`, simplificando el modelo de datos.
    *   **Integridad en Cascada:** Configuración de `CascadeType.ALL` y `orphanRemoval = true` en la relación de `Usuario` con `Estudiante` y `Profesor` para purgar correctamente los roles cuando un usuario es eliminado, evitando inconsistencias relacionales.
*   **CORS Configuration:** Políticas de "Cross-Origin Resource Sharing" adaptables, pre-configuradas para entornos de desarrollo local y listas para ser endurecidas en producción.
*   **Boilerplate Reduction:** Integración profunda con **Lombok** para generar código limpio, enfocado exclusivamente en la lógica de valor.

## Conclusión

EduPerformance no es solo un CRUD (Crear, Leer, Actualizar, Borrar); es un **ecosistema de reglas de negocio consolidadas**. Al concentrar todas las validaciones complejas en un Backend blindado, se garantiza que cualquier interfaz visual que se conecte a este núcleo ofrezca invariablemente una experiencia de usuario segura, coherente y libre de errores operativos.
