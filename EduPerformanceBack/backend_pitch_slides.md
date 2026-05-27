# ⚙️ PITCH PRESENTATION: BACKEND ARCHITECTURE & ADVANCED DATABASE PATTERNS
## EduPerformance Spring Boot & PostgreSQL - Client Pitch Slide Deck

---

<!-- slide -->
## 🏛️ DIAPOSITIVA 1: PORTADA & PROPÓSITO
### "Arquitectura Backend Robusta, Escalable y Tolerante a Fallos"

* **Presentador:** [Tu Nombre / Equipo CESDE]
* **Enfoque de Negocio:** Integridad absoluta de datos académicos, procesamiento rápido de APIs y control de transacciones.
* **Pilares Tecnológicos:**
  * Spring Boot 3 como núcleo de servicios REST.
  * Base de datos PostgreSQL serverless de alto rendimiento.
  * Hibernate/JPA para mapeo relacional impecable.
  * Capa de excepciones profesional con mapeo de códigos HTTP estándar.

---

<!-- slide -->
## 🚀 DIAPOSITIVA 2: PERSISTENCIA ACADÉMICA REAL & ENTIDADES JPA
### "Almacenamiento Confiable de los Datos del Estudiante y Docente"

* **El Concepto de Ingeniería:** Definición de entidades JPA estrictas mapeando los campos relacionales físicos en la base de datos de PostgreSQL.
* **Beneficio para el Cliente:** Los datos de carreras, semestres, códigos de alumnos, departamentos y especialidades docentes no se pierden en el navegador; quedan respaldados de por vida en servidores seguros en la nube.
* **Mapeo en el Código (Backend):**
  * **Estudiante Entity:** [src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/Estudiante.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/Estudiante.java) declara columnas físicas en base de datos para `codigo`, `carrera` y `semestre`.
  * **Profesor Entity:** [src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/Profesor.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/Profesor.java) declara `codigo`, `departamento` y `especialidad`.

---

<!-- slide -->
## ✂️ DIAPOSITIVA 3: ELIMINACIÓN DE REDUNDANCIAS (JOIN TABLES)
### "Normalización de Datos: Evitando Conflictos de Registro"

* **El Concepto de Ingeniería:** Eliminación de relaciones `@ManyToMany` innecesarias y purga de tablas de unión obsoletas (como `profesor_curso`).
* **Beneficio para el Cliente:** Máxima consistencia. Al quitar la tabla de unión redundante, no hay peligro de que un curso se asigne a un profesor en una tabla y en otra no. Los datos siempre dicen la verdad.
* **Mapeo en el Código (Backend):**
  * **Clave Foránea Única:** Los cursos se relacionan dinámicamente. La entidad `Profesor` se desligó de la relación duplicada con `Cursos`.
  * **Resolución Dinámica:** En [src/main/java/com/grupo2/EduPerformance/EduPerformance/service/ProfesorService.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/service/ProfesorService.java) los cursos de un profesor se consultan en tiempo real consultando la clave foránea del curso en la tabla de base de datos.

---

<!-- slide -->
## 🔗 DIAPOSITIVA 4: INTEGRIDAD REFERENCIAL & CASCADAS
### "Bajas de Usuarios Limpias y sin Huérfanos"

* **El Concepto de Ingeniería:** Implementación del patrón de eliminación en cascada (`CascadeType.ALL` y `orphanRemoval = true`) en relaciones `@OneToOne`.
* **Beneficio para el Cliente:** Cero corrupción de base de datos. Si un administrador elimina la cuenta de un docente o estudiante, el sistema purga de forma atómica y limpia sus roles secundarios de la base de datos, evitando bloqueos por llaves foráneas.
* **Mapeo en el Código (Backend):**
  * **Usuario Entity:** En [src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/Usuario.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/Usuario.java) se definen los mapeos en cascada hacia `Estudiante` y `Profesor`.
  * **Limpieza Automática:** Hibernate ejecuta un borrado atómico en cadena en PostgreSQL sin requerir queries manuales adicionales.

---

<!-- slide -->
## 🔗 DIAPOSITIVA 5: PATRÓN DTO (PREVENCIÓN DE BUCLES DE SERIALIZACIÓN)
### "Arquitectura Segura y Flujo de Datos Inteligente"

* **El Concepto de Ingeniería:** Separación de capas físicas de base de datos mediante DTOs (Data Transfer Objects):
  * *RequestDTO:* Valida y encapsula los datos entrantes del cliente.
  * *ResponseDTO:* Aplana la estructura eliminando recursiones anidadas infinitas.
* **Beneficio para el Cliente:** Desempeño óptimo de red y seguridad. Evita que el servidor caiga en un bucle infinito (Estudiante -> Curso -> Profesor -> Curso -> Estudiante...) ahorrando memoria del servidor.
* **Mapeo en el Código (Backend):**
  * **Aplanado de Respuestas:** [src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/dto/response/EstudianteResponseDTO.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/dto/response/EstudianteResponseDTO.java) aplana los datos de `Usuario` y retorna solo los nombres de los cursos en una lista simple de strings.
  * **Validación de Inputs:** [src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/dto/request/EstudianteRequestDTO.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/model/entity/dto/request/EstudianteRequestDTO.java) valida los datos usando Jakarta Validation.

---

<!-- slide -->
## 🚨 DIAPOSITIVA 6: MANEJO GLOBAL DE EXCEPCIONES (EXCEPTION MAPPER)
### "Mensajes Claros, Respuestas Seguras"

* **El Concepto de Ingeniería:** Desacoplamiento del flujo de errores mediante un controlador de consejos globales (`@ControllerAdvice`) y excepciones personalizadas.
* **Beneficio para el Cliente:** Reporte de errores amigable. La aplicación frontend recibe códigos HTTP exactos (404 si un curso no existe, 400 si faltan campos obligatorios) con explicaciones legibles, en lugar de crashear el portal con trazas de error de base de datos en crudo.
* **Mapeo en el Código (Backend):**
  * **Excepción Personalizada:** [src/main/java/com/grupo2/EduPerformance/EduPerformance/exception/ResourceNotFoundException.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/exception/ResourceNotFoundException.java) representa búsquedas fallidas.
  * **Mapeador Global:** [src/main/java/com/grupo2/EduPerformance/EduPerformance/exception/GlobalExceptionHandler.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/exception/GlobalExceptionHandler.java) captura los fallos de validación de campos (`MethodArgumentNotValidException`) y responde con **HTTP 400 (Bad Request)** detallado.

---

<!-- slide -->
## 🌱 DIAPOSITIVA 7: CALIDAD EN LA SIEMBRA DE DATOS (DATA SEEDER)
### "Entorno Listo para Demostraciones y Auditorías"

* **El Concepto de Ingeniería:** Sembrado inteligente de base de datos transaccional con control de duplicidad.
* **Beneficio para el Cliente:** Entorno listo para usar. Desde el primer segundo de despliegue, el portal ya cuenta con datos de prueba realistas para directivos, docentes, cursos, notas y planillas históricas, agilizando demostraciones.
* **Mapeo en el Código (Backend):**
  * **Siembra Inteligente:** [src/main/java/com/grupo2/EduPerformance/EduPerformance/config/DataSeeder.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/config/DataSeeder.java) verifica si la base de datos ya contiene registros antes de insertar.
  * **Integridad:** Pobla los perfiles, códigos y cursos respetando el nuevo esquema normalizado de base de datos sin generar duplicidad.

---

<!-- slide -->
## 🔒 DIAPOSITIVA 8: SEGURIDAD DE RED & CORS
### "Peticiones Cruzadas Protegidas y Autorizadas"

* **El Concepto de Ingeniería:** Configuración global de intercambio de recursos de origen cruzado (CORS) mediante filtros Mvc.
* **Beneficio para el Cliente:** Blindaje perimetral. Solo las aplicaciones web autorizadas (como tu portal web de React en puerto `5173`) pueden comunicarse con el backend y consultar calificaciones; cualquier atacante externo de un dominio no autorizado será rechazado en la red.
* **Mapeo en el Código (Backend):**
  * **Filtro CORS:** [src/main/java/com/grupo2/EduPerformance/EduPerformance/config/CorsConfig.java](src/main/java/com/grupo2/EduPerformance/EduPerformance/config/CorsConfig.java) habilita explícitamente los verbos `GET`, `POST`, `PUT`, `DELETE` y autoriza los orígenes de desarrollo y producción autorizados del cliente.

---

<!-- slide -->
## 🏆 DIAPOSITIVA 9: CONCLUSIÓN & SOLIDEZ OPERATIVA
### "Un Motor de Persistencia de Datos Estable, Seguro e Inteligente"

* **Integridad:** Sin redundancias y con borrado automático en cascada.
* **Calidad de Errores:** Respuestas semánticas HTTP (400, 404, 500) en formato JSON estandarizado.
* **Seguridad:** CORS configurado y DTOs validados antes de procesar transacciones.
* **El Backend de EduPerformance está listo para soportar miles de transacciones concurrentes con máxima confiabilidad.**
