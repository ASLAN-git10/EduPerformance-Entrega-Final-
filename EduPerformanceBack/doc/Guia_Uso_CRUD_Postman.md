# Guía de Uso: Colección CRUD Completa en Postman

Esta guía detalla el paso a paso para importar y ejecutar la colección Postman que realiza operaciones CRUD (Crear, Leer, Actualizar, Eliminar) completas para el aplicativo **EduPerformance2.0**.

## 1. Importar la Colección en Postman

1. Abre tu aplicación de **Postman**.
2. En la parte superior izquierda, haz clic en el botón **Import**.
3. Selecciona la pestaña **File** (o simplemente arrastra el archivo hacia la ventana de Postman).
4. Sube el archivo `EduPerformance_CRUD_Completo_Postman.json` que se encuentra en la carpeta `doc`.
5. Haz clic en **Import**. Verás que aparece una nueva colección llamada **"EduPerformance - Operaciones CRUD Completas"** en tu panel lateral izquierdo.

## 2. Preparar el Entorno

La colección ya viene configurada con **Variables de Colección** para que las pruebas sean automáticas y sencillas, evitando copiar y pegar IDs manualmente:
- `base_url`: Viene con el valor por defecto `http://localhost:8080/api`. Si tu servidor corre en otro puerto, puedes modificarlo haciendo clic en la colección -> Pestaña **Variables**.
- Variables de IDs (`usuarioId`, `cursoId`, `estudianteId`, `profesorId`, `asistenciaId`, `calificacionId`): Estas variables se llenan **automáticamente** cuando ejecutas las peticiones de creación (POST) de cada entidad.

⚠️ **Importante:** Asegúrate de que tu aplicación de Spring Boot (EduPerformance2.0) esté en ejecución antes de lanzar las peticiones.

## 3. Ejecución del CRUD Paso a Paso

Las peticiones están ordenadas lógicamente en carpetas para probar el ciclo de vida completo de los datos. Para probar las relaciones, es recomendable seguir el orden de las carpetas: primero crear los Usuarios y Cursos, luego Estudiantes y Profesores, y finalmente las Asistencias y Calificaciones.

### 3.1. CRUD de Usuarios
Ve a la carpeta **"CRUD Usuarios"** y ejecuta las peticiones en este orden estricto:

1. **1. Crear Usuario (POST)**: Haz clic en **Send**. Crea un usuario y guarda su ID en `usuarioId`.
2. **2. Obtener Todos los Usuarios (GET)**: Haz clic en **Send**. Trae la lista de todos los usuarios.
3.  **3. Obtener Usuario por ID (GET)**: Haz clic en **Send**. Consulta el usuario recién creado.
4.  **4. Actualizar Usuario (PUT)**: Haz clic en **Send**. Actualiza los datos del usuario especificado.
5.  **5. Eliminar Usuario (DELETE)**: Haz clic en **Send**. *(Si deseas probar los demás CRUDs usando este usuario, NO lo elimines todavía. Déjalo para el final de tus pruebas)*.

### 3.2. CRUD de Perfiles
Ve a la carpeta **"CRUD Perfiles"**. **Nota:** Requiere que haya un `usuarioId` en las variables. Las peticiones utilizan DTOs planos para la vinculación.
1. **1. Crear Perfil (POST)**: Vincula un perfil con dirección y teléfono al `usuarioId` creado. Guarda el ID en `perfilId`.
2. **2. Obtener Todos los Perfiles (GET)**: Lista los perfiles en el sistema.
3. **3. Obtener Perfil por ID (GET)**: Detalles del perfil por su ID.
4. **4. Obtener Perfil por Usuario ID (GET)**: Permite consultar el perfil directamente usando el `usuarioId` (muy utilizado por el frontend).
5. **5. Actualizar Perfil (PUT)**: Actualiza los detalles del perfil.
6. **6. Eliminar Perfil (DELETE)**: Elimina el registro del perfil.

### 3.3. CRUD de Cursos
Ve a la carpeta **"CRUD Cursos"** y sigue la misma dinámica:

1. **1. Crear Curso (POST)**: Haz clic en **Send**. Crea el curso y guarda el ID en `cursoId`. Opcionalmente se puede enviar un `usuarioId` en el body para asignarle un profesor.
2. **2. Obtener Todos los Cursos (GET)**: Lista los cursos.
3. **3. Obtener Curso por ID (GET)**: Detalles del curso por ID.
4. **4. Actualizar Curso (PUT)**: Actualiza el curso.
5. **5. Eliminar Curso (DELETE)**: *(No lo elimines todavía si vas a matricular estudiantes o asignar asistencias/calificaciones)*.

### 3.4. CRUD de Estudiantes
Ve a la carpeta **"CRUD Estudiantes"**. **Nota:** Requiere que haya un `usuarioId` en las variables. El cuerpo utiliza un DTO plano (`usuarioId`) en vez de un objeto `usuario` anidado.

1. **1. Crear Estudiante (POST)**: Crea el estudiante vinculándolo al usuario. Se guardará su ID en `estudianteId`.
2. **2. Obtener Todos los Estudiantes (GET)**: Lista los estudiantes.
3. **3. Obtener Estudiante por ID (GET)**: Consulta el estudiante creado.
4. **4. Actualizar Estudiante (PUT)**: Actualiza los datos.
5. **5. Eliminar Estudiante (DELETE)**: Elimina el estudiante.

### 3.5. CRUD de Profesores
Ve a la carpeta **"CRUD Profesores"**. **Nota:** Requiere que haya un `usuarioId` en las variables. El cuerpo utiliza un DTO plano (`usuarioId`).

1. **1. Crear Profesor (POST)**: Crea el profesor vinculado al usuario. Se guardará su ID en `profesorId`.
2. **2. Obtener Todos los Profesores (GET)**: Lista los profesores.
3. **3. Obtener Profesor por ID (GET)**: Consulta el profesor creado.
4. **4. Actualizar Profesor (PUT)**: Actualiza el profesor.
5. **5. Eliminar Profesor (DELETE)**: Elimina el profesor.

### 3.6. CRUD de Asistencias
Ve a la carpeta **"CRUD Asistencias"**. **Nota:** Requiere que existan `estudianteId` y `cursoId`. El cuerpo de petición utiliza DTOs con IDs planos (`estudianteId`, `cursoId`) y un booleano para `presente`.

1. **1. Crear Asistencia (POST)**: Crea el registro de asistencia del estudiante en el curso y guarda el ID en `asistenciaId`.
2. **2. Obtener Todas las Asistencias (GET)**: Lista las asistencias.
3. **3. Obtener Asistencia por ID (GET)**: Consulta el registro de asistencia.
4. **4. Actualizar Asistencia (PUT)**: Actualiza la asistencia (por ejemplo, de presente a ausente).
5. **5. Eliminar Asistencia (DELETE)**: Elimina el registro de asistencia.

### 3.7. CRUD de Calificaciones
Ve a la carpeta **"CRUD Calificaciones"**. **Nota:** Requiere que existan `estudianteId` y `cursoId`. Utiliza un DTO plano con campos extendidos (`porcentaje`, `actividad`, `fecha`, `observacion`).

1. **1. Crear Calificacion (POST)**: Ingresa la calificación para el estudiante en el curso y guarda su ID en `calificacionId`.
2. **2. Obtener Todas las Calificaciones (GET)**: Lista las calificaciones.
3. **3. Obtener Calificacion por ID (GET)**: Consulta la calificación creada.
4. **4. Obtener Calificaciones por Estudiante y Curso (GET)**: Consulta las notas de un alumno en un curso específico.
5. **5. Obtener Promedio Acumulado (GET)**: Retorna el promedio acumulado en tiempo real de un estudiante en una asignatura.
6. **6. Actualizar Calificacion (PUT)**: Actualiza la nota y metadatos.
7. **7. Eliminar Calificacion (DELETE)**: Elimina la calificación.

## Beneficios de esta Colección
- **Cero configuración manual de IDs:** Los scripts de la pestaña *Tests* extraen los IDs de las respuestas POST y los inyectan en las variables para las siguientes peticiones.
- **Bodies pre-cargados:** No necesitas escribir JSON manualmente; cada petición (POST y PUT) ya tiene un formato `raw` (JSON) válido preparado para el modelo de datos de tu aplicación.
- **Uso de variables dinámicas:** Algunos campos, como el `email` del usuario, usan variables nativas de Postman como `{{$timestamp}}` para generar correos únicos en cada ejecución y evitar errores de duplicidad en la base de datos (por ejemplo: `carlos.gomez171542389@univ.edu`).
