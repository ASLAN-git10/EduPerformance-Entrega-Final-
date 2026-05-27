# Guía Rápida de Perfiles y Permisos — EduPerformance 🏛_

Esta guía explica de forma sencilla y directa qué puede y qué no puede hacer cada tipo de usuario en la plataforma.

---

## 📊 Tabla Comparativa de Funciones

| Función / Permiso | Estudiante | Profesor | Administrador |
| :--- | :---: | :---: | :---: |
| Ver calificaciones y asistencia propia | **Sí** | No | No |
| Crear y editar asignaturas (cursos) | No | **Sí** | No |
| Subir y modificar calificaciones de alumnos | No | **Sí** | No |
| Tomar asistencia de grupos | No | **Sí** | No |
| Crear o eliminar alumnos y profesores | No | No | **Sí** |
| Configurar semestre y fecha límite de notas | No | No | **Sí** |
| Bloquear la edición de notas de forma global | No | No | **Sí** |
| Descargar copias de seguridad (JSON) | No | No | **Sí** |

---

## 👨‍🎓 1. Perfil: Estudiante (Portal del Alumno)
**¿Quién es?** El usuario que asiste a clases y consulta su progreso académico.

### **Lo que SÍ puede hacer:**
* **Ver su promedio acumulado:** Visualizar su nota promedio de todo el semestre en tiempo real.
* **Consultar sus notas detalladas:** Ver qué nota sacó en cada actividad de sus asignaturas, junto con el porcentaje (peso) de la tarea y las observaciones de su profesor.
* **Revisar sus inasistencias:** Ver los días en que estuvo presente u ausente.
* **Ver sus materias:** Conocer qué materias tiene inscritas y quién es su profesor.

### **Lo que NO puede hacer:**
* No puede modificar sus notas ni las de otros compañeros.
* No puede cambiar sus registros de asistencia.
* No puede inscribirse a cursos por su cuenta (lo realiza el sistema/administración).

---

## 👨‍🏫 2. Perfil: Profesor (Portal Docente)
**¿Quién es?** El encargado de dictar las materias, evaluar a los alumnos y llevar el control del grupo.

### **Lo que SÍ puede hacer:**
* **Administrar sus cursos:** Crear nuevos cursos, editar sus nombres, descripciones y horarios.
* **Gestionar calificaciones (CRUD):** Subir notas, modificarlas o eliminarlas. Cada nota incluye la actividad evaluada, el porcentaje que vale (ej. 20%) y comentarios para el estudiante.
* **Tomar asistencia:** Pasar lista a sus estudiantes en cada clase.
  * *Seguridad:* El sistema le impide registrar asistencias con fechas futuras para evitar fraudes.
* **Ver analíticas de sus grupos:** Observar un gráfico interactivo del promedio de rendimiento de sus asignaturas y ver alertas de grupos con bajo promedio.

### **Lo que NO puede hacer:**
* No puede crear cuentas de nuevos usuarios (profesores o estudiantes).
* No puede modificar notas si el Administrador ha activado el bloqueo de notas general.
* No puede descargar copias de seguridad del sistema.

---

## 🛡️ 3. Perfil: Administrador (Consola Institucional)
**¿Quién es?** El usuario encargado de la gestión global, la seguridad de los datos y las configuraciones de la plataforma.

### **Lo que SÍ puede hacer:**
* **Controlar cuentas de usuario (CRUD):** Crear, editar y borrar estudiantes y profesores del sistema de forma completa.
* **Ajustar el Periodo Académico:** Definir cuál es el semestre corriente (ej. `2026-I`) y establecer la fecha límite para que los profesores puedan subir notas.
* **Bloquear notas:** Activar un interruptor de seguridad que impide a todos los profesores modificar calificaciones una vez terminado el plazo.
* **Respaldar el sistema (Backup):** Descargar toda la base de datos como un archivo `.json` de respaldo en su computadora, o reiniciar el sistema a su estado original de fábrica.
* **Auditar en vivo:** Ver una bitácora en tiempo real con todas las acciones importantes que suceden en la plataforma (quién entra, quién cambia notas, etc.).

### **Lo que NO puede hacer:**
* No realiza la toma de asistencia diaria ni califica tareas individuales de los estudiantes.
