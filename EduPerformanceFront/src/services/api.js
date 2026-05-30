import axios from "axios";

// Configuración centralizada de Axios apuntando al Backend de Spring Boot
const API_URL = import.meta.env.VITE_API_URL || "https://eduperformance-backend.onrender.com/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // Timeout extendido de 60s para manejar cold start de Render Free Tier
});

// Variable para rastrear de forma reactiva si el backend está en línea
let backendOnline = true;

export const isBackendOnline = () => backendOnline;
export const setBackendOnline = (status) => {
  backendOnline = status;
};

// Interceptor para verificar la conectividad de forma automática
apiClient.interceptors.response.use(
  (response) => {
    setBackendOnline(true);
    return response;
  },
  (error) => {
    // Si la respuesta falló debido a problemas de red (sin respuesta)
    if (!error.response) {
      setBackendOnline(false);
      console.warn("⚠️ EduPerformance Backend fuera de línea. Utilizando persistencia local de contingencia.");
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Simulación premium de Login a través del listado de usuarios
  async login(email, password) {
    try {
      const response = await apiClient.get("/usuarios");
      const users = response.data;
      
      // Buscar el usuario por email
      // Nota: En la respuesta del backend, el email viene directo, 
      // pero en DTOs combinamos nombreCompleto
      const matchedUser = users.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!matchedUser) {
        throw new Error("Usuario no encontrado.");
      }

      // En un flujo real de producción el backend verificaría la contraseña en el POST /api/auth/login.
      // Aquí obtenemos el detalle completo del usuario
      const userDetailRes = await apiClient.get(`/usuarios/${matchedUser.id}`);
      const userDetail = userDetailRes.data;

      // Obtener roles consultando las listas de profesores y estudiantes
      const [profesoresRes, estudiantesRes] = await Promise.all([
        apiClient.get("/profesores"),
        apiClient.get("/estudiantes")
      ]);

      let role = "administrativo"; // Rol por defecto si no es estudiante ni profesor
      let roleId = null;

      const matchedTeacher = profesoresRes.data.find(t => t.email && t.email.toLowerCase() === email.toLowerCase());
      if (matchedTeacher) {
        role = "profesor";
        roleId = matchedTeacher.id;
      } else {
        const matchedStudent = estudiantesRes.data.find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
        if (matchedStudent) {
          role = "estudiante";
          roleId = matchedStudent.id;
        }
      }

      const sessionUser = {
        id: matchedUser.id,
        email: matchedUser.email,
        nombre: matchedUser.nombreCompleto,
        role: role,
        roleId: roleId,
        edad: matchedUser.edad,
        direccion: matchedUser.direccion,
        telefono: matchedUser.telefono
      };

      return { success: true, user: sessionUser };
    } catch (error) {
      console.error("Error durante el login en backend:", error);
      return { success: false, message: error.response?.data?.message || error.message || "Error al conectar con los servicios de autenticación." };
    }
  }
};

// --- SERVICIOS CRUD PARA CADA ENTIDAD ---

export const usuariosService = {
  getAll: () => apiClient.get("/usuarios").then(res => res.data),
  getById: (id) => apiClient.get(`/usuarios/${id}`).then(res => res.data),
  create: (data) => apiClient.post("/usuarios", data).then(res => res.data),
  update: (id, data) => apiClient.put(`/usuarios/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/usuarios/${id}`).then(res => res.data),
};

export const perfilesService = {
  getAll: () => apiClient.get("/perfiles").then(res => res.data),
  getById: (id) => apiClient.get(`/perfiles/${id}`).then(res => res.data),
  getByUsuarioId: (usuarioId) => apiClient.get(`/perfiles/usuario/${usuarioId}`).then(res => res.data),
  create: (data) => apiClient.post("/perfiles", data).then(res => res.data),
  update: (id, data) => apiClient.put(`/perfiles/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/perfiles/${id}`).then(res => res.data),
};

export const estudiantesService = {
  getAll: () => apiClient.get("/estudiantes").then(res => res.data),
  getById: (id) => apiClient.get(`/estudiantes/${id}`).then(res => res.data),
  getByCursoId: (cursoId) => apiClient.get(`/estudiantes/curso/${cursoId}`).then(res => res.data),
  create: (data) => apiClient.post("/estudiantes", data).then(res => res.data),
  update: (id, data) => apiClient.put(`/estudiantes/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/estudiantes/${id}`).then(res => res.data),
  matricular: (id, cursoId) => apiClient.post(`/estudiantes/${id}/matricular/${cursoId}`).then(res => res.data),
};

export const profesoresService = {
  getAll: () => apiClient.get("/profesores").then(res => res.data),
  getById: (id) => apiClient.get(`/profesores/${id}`).then(res => res.data),
  create: (data) => apiClient.post("/profesores", data).then(res => res.data),
  update: (id, data) => apiClient.put(`/profesores/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/profesores/${id}`).then(res => res.data),
  asignarCurso: (id, cursoId) => apiClient.post(`/profesores/${id}/asignar/${cursoId}`).then(res => res.data),
};

export const cursosService = {
  getAll: () => apiClient.get("/cursos").then(res => res.data),
  getById: (id) => apiClient.get(`/cursos/${id}`).then(res => res.data),
  create: (data) => apiClient.post("/cursos", data).then(res => res.data),
  update: (id, data) => apiClient.put(`/cursos/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/cursos/${id}`).then(res => res.data),
};

export const calificacionesService = {
  getAll: () => apiClient.get("/calificaciones").then(res => res.data),
  getById: (id) => apiClient.get(`/calificaciones/${id}`).then(res => res.data),
  getByEstudianteAndCurso: (estudianteId, cursoId) => 
    apiClient.get(`/calificaciones/estudiante/${estudianteId}/curso/${cursoId}`).then(res => res.data),
  getPromedio: (estudianteId, cursoId) => 
    apiClient.get(`/calificaciones/promedio/estudiante/${estudianteId}/curso/${cursoId}`).then(res => res.data),
  create: (data) => apiClient.post("/calificaciones", data).then(res => res.data),
  update: (id, data) => apiClient.put(`/calificaciones/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/calificaciones/${id}`).then(res => res.data),
};

export const asistenciasService = {
  getAll: () => apiClient.get("/asistencias").then(res => res.data),
  getById: (id) => apiClient.get(`/asistencias/${id}`).then(res => res.data),
  getByCursoAndFecha: (cursoId, fecha) => 
    apiClient.get(`/asistencias/curso/${cursoId}/fecha/${fecha}`).then(res => res.data),
  create: (data) => apiClient.post("/asistencias", data).then(res => res.data),
  update: (id, data) => apiClient.put(`/asistencias/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/asistencias/${id}`).then(res => res.data),
};
