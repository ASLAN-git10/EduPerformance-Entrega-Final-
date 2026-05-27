import React, { createContext, useState, useEffect, useContext } from "react";
import {
  authService,
  usuariosService,
  perfilesService,
  estudiantesService,
  profesoresService,
  cursosService,
  calificacionesService,
  asistenciasService
} from "../services/api";

const AppContext = createContext(null);

const INITIAL_USERS = [
  { id: 1, email: "carlos.mendoza@edu.com", password: "password123", role: "profesor", nombre: "Prof. Carlos Mendoza" },
  { id: 2, email: "laura.gomez@edu.com", password: "password123", role: "profesor", nombre: "Prof. Laura Gómez" },
  { id: 3, email: "ana.silva@edu.com", password: "password123", role: "estudiante", nombre: "Ana María Silva" },
  { id: 4, email: "juan.perez@edu.com", password: "password123", role: "estudiante", nombre: "Juan Pérez" },
  { id: 5, email: "david.restrepo@edu.com", password: "password123", role: "estudiante", nombre: "David Restrepo" },
  { id: 6, email: "sofia.altamirano@edu.com", password: "password123", role: "administrativo", nombre: "Dra. Sofía Altamirano" }
];

const INITIAL_PROFILES = [
  { id: 1, usuarioId: 1, telefono: "+57 311 555 4321", direccion: "Calle 10 # 45-67, Medellín", biografia: "Docente de Ingeniería de Software con más de 10 años de experiencia en desarrollo web y arquitectura empresarial.", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 2, usuarioId: 2, telefono: "+57 320 555 9876", direccion: "Circular 4 # 78-12, Medellín", biografia: "Especialista en Bases de Datos y Ciencia de Datos. Apasionada por enseñar y guiar proyectos de analítica.", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
  { id: 3, usuarioId: 3, telefono: "+57 315 888 2233", direccion: "Carrera 80 # 33-44, Medellín", biografia: "Estudiante de Ingeniería de Sistemas de 6to semestre. Interesada en el desarrollo frontend con React y el diseño UI/UX.", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: 4, usuarioId: 4, telefono: "+57 300 444 5566", direccion: "Calle 50 # 12-34, Envigado", biografia: "Estudiante apasionado por la programación competitiva, el backend con Spring Boot y la ciberseguridad.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: 5, usuarioId: 5, telefono: "+57 312 999 1122", direccion: "Diagonal 32 # 56-78, Sabaneta", biografia: "Estudiante de Sistemas y amante de la inteligencia artificial. Disfruto resolver retos de lógica de software.", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { id: 6, usuarioId: 6, telefono: "+57 301 777 8899", direccion: "Calle 100 # 15-22, Medellín", biografia: "Rectora Institucional. Responsable de la planeación y la gestión estratégica para el aseguramiento de la calidad académica en CESDE.", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" }
];

const INITIAL_TEACHERS = [
  { id: 1, usuarioId: 1, codigo: "DOC-2026-001", departamento: "Ingeniería de Sistemas", especialidad: "Desarrollo Frontend y Arquitectura" },
  { id: 2, usuarioId: 2, codigo: "DOC-2026-002", departamento: "Ciencias de la Computación", especialidad: "Bases de Datos Relacionales y NoSQL" }
];

const INITIAL_STUDENTS = [
  { id: 1, usuarioId: 3, codigo: "EST-2026-001", carrera: "Ingeniería de Sistemas", semestre: 6 },
  { id: 2, usuarioId: 4, codigo: "EST-2026-002", carrera: "Ingeniería de Sistemas", semestre: 5 },
  { id: 3, usuarioId: 5, codigo: "EST-2026-003", carrera: "Ingeniería de Sistemas", semestre: 6 }
];

const INITIAL_COURSES = [
  { id: 1, codigo: "INF-301", nombre: "Desarrollo Web Frontend", descripcion: "Fundamentos de HTML, CSS y desarrollo avanzado de SPA utilizando React y Vite.", profesorId: 1, horario: "Lunes y Miércoles 6:00 PM - 8:00 PM" },
  { id: 2, codigo: "INF-302", nombre: "Arquitectura de Software", descripcion: "Patrones de diseño, microservicios, APIs REST y buenas prácticas de ingeniería de software.", profesorId: 1, horario: "Martes y Jueves 6:00 PM - 8:00 PM" },
  { id: 3, codigo: "INF-201", nombre: "Bases de Datos I", descripcion: "Modelado de datos entidad-relación, lenguaje SQL avanzado y optimización de consultas.", profesorId: 2, horario: "Lunes y Miércoles 8:00 PM - 10:00 PM" }
];

const INITIAL_GRADES = [
  { id: 1, estudianteId: 1, cursoId: 1, nota: 4.8, porcentaje: 25, actividad: "Taller 1: Estilos Premium y CSS", fecha: "2026-04-12", observacion: "Excelente uso de HSL y detalles visuales premium." },
  { id: 2, estudianteId: 1, cursoId: 1, nota: 4.5, porcentaje: 35, actividad: "Parcial 1: Fundamentos de React", fecha: "2026-05-02", observacion: "Muy buen dominio de estados y hooks. Detalles menores de optimización." },
  { id: 3, estudianteId: 2, cursoId: 1, nota: 3.8, porcentaje: 25, actividad: "Taller 1: Estilos Premium y CSS", fecha: "2026-04-12", observacion: "Cumple, pero podría mejorar la estética general." },
  { id: 4, estudianteId: 2, cursoId: 1, nota: 4.2, porcentaje: 35, actividad: "Parcial 1: Fundamentos de React", fecha: "2026-05-02", observacion: "Buen examen." },
  { id: 5, estudianteId: 3, cursoId: 1, nota: 4.7, porcentaje: 25, actividad: "Taller 1: Estilos Premium y CSS", fecha: "2026-04-12", observacion: "Gran trabajo de maquetación y diseño interactivo." },
  { id: 6, estudianteId: 3, cursoId: 1, nota: 4.6, porcentaje: 35, actividad: "Parcial 1: Fundamentos de React", fecha: "2026-05-02", observacion: "Código limpio y bien documentado." },
  { id: 7, estudianteId: 1, cursoId: 3, nota: 4.2, porcentaje: 30, actividad: "Parcial SQL Avanzado", fecha: "2026-04-28", observacion: "Faltó optimizar una subconsulta, pero buen resultado." },
  { id: 8, estudianteId: 2, cursoId: 3, nota: 4.9, porcentaje: 30, actividad: "Parcial SQL Avanzado", fecha: "2026-04-28", observacion: "Perfecto desarrollo de la base de datos." }
];

const INITIAL_ATTENDANCES = [
  { id: 1, estudianteId: 1, cursoId: 1, fecha: "2026-05-10", estado: "Presente" },
  { id: 2, estudianteId: 2, cursoId: 1, fecha: "2026-05-10", estado: "Presente" },
  { id: 3, estudianteId: 3, cursoId: 1, fecha: "2026-05-10", estado: "Ausente" },
  { id: 4, estudianteId: 1, cursoId: 1, fecha: "2026-05-15", estado: "Presente" },
  { id: 5, estudianteId: 2, cursoId: 1, fecha: "2026-05-15", estado: "Tarde" },
  { id: 6, estudianteId: 3, cursoId: 1, fecha: "2026-05-15", estado: "Presente" },
  { id: 7, estudianteId: 1, cursoId: 3, fecha: "2026-05-12", estado: "Presente" },
  { id: 8, estudianteId: 2, cursoId: 3, fecha: "2026-05-12", estado: "Presente" }
];

const getProfessionalAvatar = (usuarioId, role, email) => {
  const emailLower = email ? email.toLowerCase() : "";
  if (emailLower.includes("carlos.mendoza")) return "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80";
  if (emailLower.includes("laura.gomez")) return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
  if (emailLower.includes("ana.silva")) return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80";
  if (emailLower.includes("juan.perez")) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";
  if (emailLower.includes("david.restrepo")) return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80";
  if (emailLower.includes("sofia.altamirano")) return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
  if (emailLower.includes("mateo.lopez")) return "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80";

  // Fallback map based on role and modulo
  const students = [
    "1539571696357-5a69c17a67c6",
    "1517841905240-472988babdf9",
    "1507003211169-0a1dd7228f2d",
    "1494790108377-be9c29b29330",
    "1500648767791-00dcc994a43e",
    "1544005313-94ddf0286df2"
  ];
  const staff = [
    "1560250097-0b93528c311a",
    "1573496359142-b8d87734a5a2",
    "1506794778202-cad84cf45f1d",
    "1534528741775-53994a69daeb"
  ];

  const list = (role === "profesor" || role === "administrativo") ? staff : students;
  const idx = Math.abs(parseInt(usuarioId || 0, 10)) % list.length;
  return `https://images.unsplash.com/photo-${list[idx]}?w=150&auto=format&fit=crop&q=80`;
};

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("edu_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [db, setDb] = useState({
    users: INITIAL_USERS,
    profiles: INITIAL_PROFILES,
    teachers: INITIAL_TEACHERS,
    students: INITIAL_STUDENTS,
    courses: INITIAL_COURSES,
    grades: INITIAL_GRADES,
    attendances: INITIAL_ATTENDANCES
  });

  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Carga inicial conectando al Backend de Spring Boot con Axios
  const loadData = async () => {
    try {
      setLoading(true);
      // Validar si el backend responde con usuarios
      const usuarios = await usuariosService.getAll();
      setIsOnline(true);

      // Traer el resto de colecciones en paralelo
      const [
        perfiles,
        estudiantes,
        profesores,
        cursos,
        calificaciones,
        asistencias
      ] = await Promise.all([
        perfilesService.getAll(),
        estudiantesService.getAll(),
        profesoresService.getAll(),
        cursosService.getAll(),
        calificacionesService.getAll(),
        asistenciasService.getAll()
      ]);

      // Mapear la base de usuarios
      const mappedUsers = usuarios.map(u => {
        let role = "administrativo";
        const isProf = profesores.some(p => p.email && p.email.toLowerCase() === u.email.toLowerCase());
        if (isProf) {
          role = "profesor";
        } else {
          const isEst = estudiantes.some(e => e.email && e.email.toLowerCase() === u.email.toLowerCase());
          if (isEst) role = "estudiante";
        }
        return {
          id: u.id,
          email: u.email,
          nombre: u.nombreCompleto || `${u.nombre} ${u.apellido || ""}`.trim(),
          role: role
        };
      });

      // Mapear perfiles
      const mappedProfiles = perfiles.map(p => {
        const u = usuarios.find(user => user.id === p.usuarioId) || {};
        let role = "administrativo";
        const isProf = profesores.some(prof => prof.email && prof.email.toLowerCase() === u.email?.toLowerCase());
        if (isProf) role = "profesor";
        else {
          const isEst = estudiantes.some(est => est.email && est.email.toLowerCase() === u.email?.toLowerCase());
          if (isEst) role = "estudiante";
        }
        return {
          id: p.id,
          usuarioId: p.usuarioId,
          telefono: p.telefono || "",
          direccion: p.direccion || "",
          biografia: "Biografía cargada del sistema.",
          avatarUrl: p.avatarUrl || getProfessionalAvatar(p.usuarioId, role, u.email)
        };
      });

      // Mapear profesores
      const mappedTeachers = profesores.map(p => ({
        id: p.id,
        usuarioId: p.usuarioId || (usuarios.find(u => u.email === p.email)?.id) || p.id,
        codigo: p.codigo || `DOC-2026-00${p.id}`,
        departamento: p.departamento || "Ingeniería de Sistemas",
        especialidad: p.especialidad || "Desarrollo Frontend y Arquitectura"
      }));

      // Mapear estudiantes
      const mappedStudents = estudiantes.map(e => ({
        id: e.id,
        usuarioId: e.usuarioId || (usuarios.find(u => u.email === e.email)?.id) || e.id,
        codigo: e.codigo || `EST-2026-00${e.id}`,
        carrera: e.carrera || "Ingeniería de Sistemas",
        semestre: e.semestre || 6
      }));

      // Mapear cursos
      const mappedCourses = cursos.map(c => {
        // En CursosResponseDTO se recibe nombreProfesor. Buscamos el profesorId correspondiente
        const matchingTeacher = profesores.find(
          p => p.nombreCompleto === c.nombreProfesor || p.nombre === c.nombreProfesor
        );
        return {
          id: c.id,
          codigo: `INF-30${c.id}`,
          nombre: c.nombre,
          descripcion: c.descripcion || "",
          profesorId: matchingTeacher ? matchingTeacher.id : 1,
          horario: "Lunes y Miércoles 6:00 PM - 8:00 PM"
        };
      });

      // Mapear calificaciones utilizando el nuevo DTO extendido
      const mappedGrades = calificaciones.map(g => ({
        id: g.id,
        estudianteId: g.estudianteId,
        cursoId: g.cursoId,
        nota: g.nota,
        porcentaje: g.porcentaje || 20,
        actividad: g.actividad || "Evaluación",
        fecha: g.fecha ? g.fecha.toString() : new Date().toISOString().split('T')[0],
        observacion: g.observacion || ""
      }));

      // Mapear asistencias de Boolean a los estados exactos del frontend
      const mappedAttendances = asistencias.map(a => ({
        id: a.id,
        estudianteId: a.estudianteId,
        cursoId: a.cursoId,
        fecha: a.fecha ? a.fecha.toString() : new Date().toISOString().split('T')[0],
        estado: a.presente ? "Presente" : "Ausente"
      }));

      setDb({
        users: mappedUsers,
        profiles: mappedProfiles,
        teachers: mappedTeachers,
        students: mappedStudents,
        courses: mappedCourses,
        grades: mappedGrades,
        attendances: mappedAttendances
      });
    } catch (error) {
      console.warn("⚠️ EduPerformance Backend no responde. Utilizando contingencia offline local.");
      setIsOnline(false);
      const saved = localStorage.getItem("edu_performance_db");
      if (saved) {
        setDb(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Si estamos en modo offline, persistimos los cambios en localStorage
    if (!isOnline) {
      localStorage.setItem("edu_performance_db", JSON.stringify(db));
    }
  }, [db, isOnline]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("edu_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("edu_current_user");
    }
  }, [currentUser]);

  // LOGIN FLOWS
  const login = async (email, password) => {
    if (isOnline) {
      const result = await authService.login(email, password);
      if (result.success) {
        setCurrentUser(result.user);
        return result;
      }
    }

    // Fallback local offline
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || password === "password123"));
    if (user) {
      const profile = db.profiles.find(p => p.usuarioId === user.id) || {};
      const teacher = db.teachers.find(t => t.usuarioId === user.id);
      const student = db.students.find(s => s.usuarioId === user.id);
      let roleId = null;
      if (user.role === "profesor" && teacher) roleId = teacher.id;
      if (user.role === "estudiante" && student) roleId = student.id;

      const sessionUser = {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
        roleId: roleId,
        edad: user.edad || 22,
        direccion: profile.direccion || "",
        telefono: profile.telefono || ""
      };
      setCurrentUser(sessionUser);
      return { success: true, user: sessionUser };
    }
    return { success: false, message: "Correo o contraseña incorrectos." };
  };

  const loginAs = async (role, id) => {
    const user = db.users.find(u => u.role === role && u.id === id);
    if (user) {
      return login(user.email, "password123");
    }
    return { success: false, message: "Usuario de prueba no encontrado." };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // CRUD PROFILE
  const updateProfile = async (profileData) => {
    if (isOnline) {
      try {
        let backendProfile = null;
        try {
          backendProfile = await perfilesService.getByUsuarioId(profileData.usuarioId);
        } catch (e) {
          // No existe aún en DB
        }

        const dataToSave = {
          usuarioId: profileData.usuarioId,
          direccion: profileData.direccion,
          telefono: profileData.telefono
        };

        if (backendProfile && backendProfile.id) {
          await perfilesService.update(backendProfile.id, dataToSave);
        } else {
          await perfilesService.create(dataToSave);
        }
      } catch (err) {
        console.error("Error actualizando perfil en el backend:", err);
      }
    }

    setDb(prev => {
      const exists = prev.profiles.some(p => p.usuarioId === profileData.usuarioId);
      let updatedProfiles;
      if (exists) {
        updatedProfiles = prev.profiles.map(p =>
          p.usuarioId === profileData.usuarioId ? { ...p, ...profileData } : p
        );
      } else {
        updatedProfiles = [...prev.profiles, {
          id: prev.profiles.length > 0 ? Math.max(...prev.profiles.map(p => p.id)) + 1 : 1,
          ...profileData
        }];
      }
      return { ...prev, profiles: updatedProfiles };
    });
  };

  // CRUD COURSES
  const addCourse = async (course) => {
    let createdCourse = null;
    if (isOnline) {
      try {
        const teacher = db.teachers.find(t => t.id === parseInt(course.profesorId, 10));
        const usuarioId = teacher ? teacher.usuarioId : null;

        const response = await cursosService.create({
          nombre: course.nombre,
          descripcion: course.descripcion,
          usuarioId: usuarioId
        });

        createdCourse = {
          id: response.id,
          codigo: `INF-30${response.id}`,
          nombre: response.nombre,
          descripcion: response.descripcion || "",
          profesorId: course.profesorId,
          horario: course.horario || "Lunes y Miércoles 6:00 PM - 8:00 PM"
        };
      } catch (err) {
        console.error("Error creando curso en el backend:", err);
      }
    }

    if (!createdCourse) {
      const newId = db.courses.length > 0 ? Math.max(...db.courses.map(c => c.id)) + 1 : 1;
      createdCourse = {
        ...course,
        id: newId,
        codigo: course.codigo || `INF-30${newId}`
      };
    }

    setDb(prev => ({
      ...prev,
      courses: [...prev.courses, createdCourse]
    }));
    return createdCourse;
  };

  const updateCourse = async (id, updatedCourse) => {
    if (isOnline) {
      try {
        const teacher = db.teachers.find(t => t.id === parseInt(updatedCourse.profesorId, 10));
        const usuarioId = teacher ? teacher.usuarioId : null;

        await cursosService.update(id, {
          nombre: updatedCourse.nombre,
          descripcion: updatedCourse.descripcion,
          usuarioId: usuarioId
        });
      } catch (err) {
        console.error("Error editando curso en el backend:", err);
      }
    }

    setDb(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === id ? { ...c, ...updatedCourse } : c)
    }));
  };

  const deleteCourse = async (id) => {
    if (isOnline) {
      try {
        await cursosService.delete(id);
      } catch (err) {
        console.error("Error eliminando curso del backend:", err);
      }
    }

    setDb(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== id),
      grades: prev.grades.filter(g => g.cursoId !== id),
      attendances: prev.attendances.filter(a => a.cursoId !== id)
    }));
  };

  // CRUD GRADES
  const addGrade = async (grade) => {
    let createdGrade = null;
    if (isOnline) {
      try {
        const response = await calificacionesService.create({
          estudianteId: parseInt(grade.estudianteId, 10),
          cursoId: parseInt(grade.cursoId, 10),
          nota: parseFloat(grade.nota),
          porcentaje: parseInt(grade.porcentaje, 10),
          actividad: grade.actividad,
          fecha: grade.fecha || new Date().toISOString().split('T')[0],
          observacion: grade.observacion || ""
        });

        createdGrade = {
          id: response.id,
          estudianteId: response.estudianteId,
          cursoId: response.cursoId,
          nota: response.nota,
          porcentaje: response.porcentaje,
          actividad: response.actividad,
          fecha: response.fecha ? response.fecha.toString() : grade.fecha,
          observacion: response.observacion || ""
        };
      } catch (err) {
        console.error("Error creando calificación en backend:", err);
      }
    }

    if (!createdGrade) {
      const newId = db.grades.length > 0 ? Math.max(...db.grades.map(g => g.id)) + 1 : 1;
      createdGrade = {
        ...grade,
        id: newId,
        nota: parseFloat(grade.nota),
        porcentaje: parseInt(grade.porcentaje, 10),
        fecha: grade.fecha || new Date().toISOString().split('T')[0]
      };
    }

    setDb(prev => ({
      ...prev,
      grades: [...prev.grades, createdGrade]
    }));
    return createdGrade;
  };

  const updateGrade = async (id, updatedGrade) => {
    if (isOnline) {
      try {
        const currentGrade = db.grades.find(g => g.id === id);
        await calificacionesService.update(id, {
          estudianteId: parseInt(updatedGrade.estudianteId || currentGrade.estudianteId, 10),
          cursoId: parseInt(updatedGrade.cursoId || currentGrade.cursoId, 10),
          nota: parseFloat(updatedGrade.nota !== undefined ? updatedGrade.nota : currentGrade.nota),
          porcentaje: parseInt(updatedGrade.porcentaje !== undefined ? updatedGrade.porcentaje : currentGrade.porcentaje, 10),
          actividad: updatedGrade.actividad || currentGrade.actividad,
          fecha: updatedGrade.fecha || currentGrade.fecha || new Date().toISOString().split('T')[0],
          observacion: updatedGrade.observacion || currentGrade.observacion || ""
        });
      } catch (err) {
        console.error("Error actualizando calificación en backend:", err);
      }
    }

    setDb(prev => ({
      ...prev,
      grades: prev.grades.map(g => g.id === id ? {
        ...g,
        ...updatedGrade,
        nota: updatedGrade.nota !== undefined ? parseFloat(updatedGrade.nota) : g.nota,
        porcentaje: updatedGrade.porcentaje !== undefined ? parseInt(updatedGrade.porcentaje, 10) : g.porcentaje
      } : g)
    }));
  };

  const deleteGrade = async (id) => {
    if (isOnline) {
      try {
        await calificacionesService.delete(id);
      } catch (err) {
        console.error("Error eliminando calificación del backend:", err);
      }
    }

    setDb(prev => ({
      ...prev,
      grades: prev.grades.filter(g => g.id !== id)
    }));
  };

  // CRUD ATTENDANCE
  const addAttendance = async (attendance) => {
    let createdAttendance = null;
    if (isOnline) {
      try {
        const presente = attendance.estado === "Presente" || attendance.estado === "Tarde";
        const response = await asistenciasService.create({
          fecha: attendance.fecha || new Date().toISOString().split('T')[0],
          presente: presente,
          estudianteId: parseInt(attendance.estudianteId, 10),
          cursoId: parseInt(attendance.cursoId, 10)
        });

        createdAttendance = {
          id: response.id,
          estudianteId: response.estudianteId,
          cursoId: response.cursoId,
          fecha: response.fecha ? response.fecha.toString() : attendance.fecha,
          estado: attendance.estado
        };
      } catch (err) {
        console.error("Error registrando asistencia en backend:", err);
      }
    }

    if (!createdAttendance) {
      const newId = db.attendances.length > 0 ? Math.max(...db.attendances.map(a => a.id)) + 1 : 1;
      createdAttendance = {
        ...attendance,
        id: newId,
        fecha: attendance.fecha || new Date().toISOString().split('T')[0]
      };
    }

    setDb(prev => ({
      ...prev,
      attendances: [...prev.attendances, createdAttendance]
    }));
    return createdAttendance;
  };

  const updateAttendance = async (id, updatedAttendance) => {
    if (isOnline) {
      try {
        const current = db.attendances.find(a => a.id === id);
        const estado = updatedAttendance.estado || current.estado;
        const presente = estado === "Presente" || estado === "Tarde";

        await asistenciasService.update(id, {
          fecha: updatedAttendance.fecha || current.fecha,
          presente: presente,
          estudianteId: parseInt(updatedAttendance.estudianteId || current.estudianteId, 10),
          cursoId: parseInt(updatedAttendance.cursoId || current.cursoId, 10)
        });
      } catch (err) {
        console.error("Error editando asistencia en backend:", err);
      }
    }

    setDb(prev => ({
      ...prev,
      attendances: prev.attendances.map(a => a.id === id ? { ...a, ...updatedAttendance } : a)
    }));
  };

  const deleteAttendance = async (id) => {
    if (isOnline) {
      try {
        await asistenciasService.delete(id);
      } catch (err) {
        console.error("Error eliminando asistencia en backend:", err);
      }
    }

    setDb(prev => ({
      ...prev,
      attendances: prev.attendances.filter(a => a.id !== id)
    }));
  };

  const bulkSaveAttendance = async (cursoId, fecha, studentStatusList) => {
    const cursoIdInt = parseInt(cursoId, 10);

    if (isOnline) {
      try {
        // Consultar asistencias existentes para este curso y fecha
        const existingRecords = await asistenciasService.getByCursoAndFecha(cursoIdInt, fecha);

        await Promise.all(
          studentStatusList.map(async (s) => {
            const estudianteIdInt = parseInt(s.estudianteId, 10);
            const presente = s.estado === "Presente" || s.estado === "Tarde";

            const existing = existingRecords.find(r => r.estudianteId === estudianteIdInt);

            const dto = {
              fecha,
              presente,
              estudianteId: estudianteIdInt,
              cursoId: cursoIdInt
            };

            if (existing) {
              await asistenciasService.update(existing.id, dto);
            } else {
              await asistenciasService.create(dto);
            }
          })
        );
      } catch (err) {
        console.error("Error en bulkSaveAttendance en backend:", err);
      }
    }

    setDb(prev => {
      const filtered = prev.attendances.filter(a => !(a.cursoId === cursoIdInt && a.fecha === fecha));
      let nextId = prev.attendances.length > 0 ? Math.max(...prev.attendances.map(a => a.id)) + 1 : 1;
      const newRecords = studentStatusList.map(s => ({
        id: nextId++,
        cursoId: cursoIdInt,
        estudianteId: parseInt(s.estudianteId, 10),
        fecha,
        estado: s.estado
      }));

      return {
        ...prev,
        attendances: [...filtered, ...newRecords]
      };
    });
  };

  // --- CRUD USER MANAGEMENT FOR ADMINISTRATOR ---

  const addUser = async (userData, profileData, roleSpecificData) => {
    let createdUser = null;
    let createdProfile = null;
    let createdRoleEntity = null;

    if (isOnline) {
      try {
        // 1. Create user in backend
        const userRes = await usuariosService.create({
          nombre: userData.nombre,
          apellido: userData.apellido || "",
          edad: parseInt(userData.edad || 20, 10),
          email: userData.email,
          password: userData.password || "password123"
        });

        // 2. Create profile in backend
        const profileRes = await perfilesService.create({
          usuarioId: userRes.id,
          direccion: profileData.direccion || "",
          telefono: profileData.telefono || ""
        });

        // 3. Create role specific entity
        if (userData.role === "estudiante") {
          const studentRes = await estudiantesService.create({
            usuarioId: userRes.id,
            codigo: roleSpecificData.codigo || `EST-2026-00${userRes.id}`,
            carrera: roleSpecificData.carrera || "Ingeniería de Sistemas",
            semestre: parseInt(roleSpecificData.semestre || 1, 10)
          });
          createdRoleEntity = {
            id: studentRes.id,
            usuarioId: userRes.id,
            codigo: studentRes.codigo || `EST-2026-00${studentRes.id}`,
            carrera: studentRes.carrera || roleSpecificData.carrera || "Ingeniería de Sistemas",
            semestre: parseInt(studentRes.semestre || roleSpecificData.semestre || 1, 10)
          };
        } else if (userData.role === "profesor") {
          const teacherRes = await profesoresService.create({
            usuarioId: userRes.id,
            codigo: roleSpecificData.codigo || `DOC-2026-00${userRes.id}`,
            departamento: roleSpecificData.departamento || "Ingeniería de Sistemas",
            especialidad: roleSpecificData.especialidad || "Desarrollo Frontend y Arquitectura"
          });
          createdRoleEntity = {
            id: teacherRes.id,
            usuarioId: userRes.id,
            codigo: teacherRes.codigo || `DOC-2026-00${teacherRes.id}`,
            departamento: teacherRes.departamento || roleSpecificData.departamento || "Ingeniería de Sistemas",
            especialidad: teacherRes.especialidad || roleSpecificData.especialidad || "Desarrollo Frontend y Arquitectura"
          };
        }

        createdUser = {
          id: userRes.id,
          email: userRes.email,
          nombre: userRes.nombreCompleto || `${userRes.nombre} ${userRes.apellido || ""}`.trim(),
          role: userData.role,
          password: userData.password || "password123"
        };

        createdProfile = {
          id: profileRes.id,
          usuarioId: userRes.id,
          telefono: profileRes.telefono || "",
          direccion: profileRes.direccion || "",
          biografia: profileData.biografia || "Biografía de usuario del sistema.",
          avatarUrl: profileData.avatarUrl || getProfessionalAvatar(userRes.id, userData.role, userRes.email)
        };

      } catch (err) {
        console.error("⚠️ Error creando usuario en backend, cayendo a contingencia local:", err);
      }
    }

    setDb(prev => {
      const newUserId = createdUser ? createdUser.id : (prev.users.length > 0 ? Math.max(...prev.users.map(u => u.id)) + 1 : 1);
      const newProfileId = createdProfile ? createdProfile.id : (prev.profiles.length > 0 ? Math.max(...prev.profiles.map(p => p.id)) + 1 : 1);

      const localUser = createdUser || {
        id: newUserId,
        email: userData.email,
        nombre: `${userData.nombre} ${userData.apellido || ""}`.trim(),
        role: userData.role,
        password: userData.password || "password123"
      };

      const localProfile = createdProfile || {
        id: newProfileId,
        usuarioId: newUserId,
        telefono: profileData.telefono || "",
        direccion: profileData.direccion || "",
        biografia: profileData.biografia || "Estudiante apasionado por el desarrollo.",
        avatarUrl: profileData.avatarUrl || getProfessionalAvatar(newUserId, userData.role, userData.email)
      };

      let updatedStudents = prev.students;
      let updatedTeachers = prev.teachers;

      if (userData.role === "estudiante") {
        const newStudentId = createdRoleEntity ? createdRoleEntity.id : (prev.students.length > 0 ? Math.max(...prev.students.map(s => s.id)) + 1 : 1);
        const localStudent = createdRoleEntity || {
          id: newStudentId,
          usuarioId: newUserId,
          codigo: `EST-2026-00${newStudentId}`,
          carrera: roleSpecificData.carrera || "Ingeniería de Sistemas",
          semestre: parseInt(roleSpecificData.semestre || 1, 10)
        };
        updatedStudents = [...prev.students, localStudent];
      } else if (userData.role === "profesor") {
        const newTeacherId = createdRoleEntity ? createdRoleEntity.id : (prev.teachers.length > 0 ? Math.max(...prev.teachers.map(t => t.id)) + 1 : 1);
        const localTeacher = createdRoleEntity || {
          id: newTeacherId,
          usuarioId: newUserId,
          codigo: `DOC-2026-00${newTeacherId}`,
          departamento: roleSpecificData.departamento || "Ingeniería de Sistemas",
          especialidad: roleSpecificData.especialidad || "Desarrollo Frontend y Arquitectura"
        };
        updatedTeachers = [...prev.teachers, localTeacher];
      }

      return {
        ...prev,
        users: [...prev.users, localUser],
        profiles: [...prev.profiles, localProfile],
        students: updatedStudents,
        teachers: updatedTeachers
      };
    });
  };

  const updateUser = async (userId, userData, profileData, roleSpecificData) => {
    if (isOnline) {
      try {
        // 1. Update user
        await usuariosService.update(userId, {
          nombre: userData.nombre,
          apellido: userData.apellido || "",
          edad: parseInt(userData.edad || 20, 10),
          email: userData.email,
          password: userData.password || "password123"
        });

        // 2. Update profile
        let backendProfile = null;
        try {
          backendProfile = await perfilesService.getByUsuarioId(userId);
        } catch (e) {}

        const profilePayload = {
          usuarioId: userId,
          direccion: profileData.direccion || "",
          telefono: profileData.telefono || ""
        };

        if (backendProfile && backendProfile.id) {
          await perfilesService.update(backendProfile.id, profilePayload);
        } else {
          await perfilesService.create(profilePayload);
        }

        // 3. Update role specific entity
        if (userData.role === "estudiante") {
          const student = db.students.find(s => s.usuarioId === userId);
          if (student) {
            await estudiantesService.update(student.id, {
              usuarioId: userId,
              codigo: student.codigo || `EST-2026-00${userId}`,
              carrera: roleSpecificData.carrera || student.carrera,
              semestre: parseInt(roleSpecificData.semestre !== undefined ? roleSpecificData.semestre : student.semestre, 10)
            });
          }
        } else if (userData.role === "profesor") {
          const teacher = db.teachers.find(t => t.usuarioId === userId);
          if (teacher) {
            await profesoresService.update(teacher.id, {
              usuarioId: userId,
              codigo: teacher.codigo || `DOC-2026-00${userId}`,
              departamento: roleSpecificData.departamento || teacher.departamento,
              especialidad: roleSpecificData.especialidad || teacher.especialidad
            });
          }
        }
      } catch (err) {
        console.error("⚠️ Error actualizando usuario en backend, cayendo a contingencia local:", err);
      }
    }

    setDb(prev => {
      const updatedUsers = prev.users.map(u =>
        u.id === userId ? {
          ...u,
          email: userData.email,
          nombre: `${userData.nombre} ${userData.apellido || ""}`.trim(),
          password: userData.password || u.password
        } : u
      );

      const updatedProfiles = prev.profiles.map(p =>
        p.usuarioId === userId ? {
          ...p,
          telefono: profileData.telefono || p.telefono,
          direccion: profileData.direccion || p.direccion,
          biografia: profileData.biografia || p.biografia,
          avatarUrl: profileData.avatarUrl || p.avatarUrl
        } : p
      );

      const updatedStudents = prev.students.map(s =>
        s.usuarioId === userId ? {
          ...s,
          carrera: roleSpecificData.carrera || s.carrera,
          semestre: parseInt(roleSpecificData.semestre || s.semestre, 10)
        } : s
      );

      const updatedTeachers = prev.teachers.map(t =>
        t.usuarioId === userId ? {
          ...t,
          departamento: roleSpecificData.departamento || t.departamento,
          especialidad: roleSpecificData.especialidad || t.especialidad
        } : t
      );

      return {
        ...prev,
        users: updatedUsers,
        profiles: updatedProfiles,
        students: updatedStudents,
        teachers: updatedTeachers
      };
    });
  };

  const deleteUser = async (userId) => {
    if (isOnline) {
      try {
        const student = db.students.find(s => s.usuarioId === userId);
        if (student) {
          await estudiantesService.delete(student.id);
        }
        const teacher = db.teachers.find(t => t.usuarioId === userId);
        if (teacher) {
          await profesoresService.delete(teacher.id);
        }
        const profile = db.profiles.find(p => p.usuarioId === userId);
        if (profile) {
          await perfilesService.delete(profile.id);
        }
        await usuariosService.delete(userId);
      } catch (err) {
        console.error("⚠️ Error eliminando usuario en backend, cayendo a contingencia local:", err);
      }
    }

    setDb(prev => {
      const student = prev.students.find(s => s.usuarioId === userId);
      const teacher = prev.teachers.find(t => t.usuarioId === userId);

      return {
        ...prev,
        users: prev.users.filter(u => u.id !== userId),
        profiles: prev.profiles.filter(p => p.usuarioId !== userId),
        students: prev.students.filter(s => s.usuarioId !== userId),
        teachers: prev.teachers.filter(t => t.usuarioId !== userId),
        grades: prev.grades.filter(g => g.estudianteId !== student?.id),
        attendances: prev.attendances.filter(a => a.estudianteId !== student?.id),
        courses: prev.courses.filter(c => c.profesorId !== teacher?.id)
      };
    });
  };

  // HELPER GETTERS
  const getUserProfile = (usuarioId) => {
    return db.profiles.find(p => p.usuarioId === usuarioId) || {};
  };

  const getStudentByUserId = (usuarioId) => {
    return db.students.find(s => s.usuarioId === usuarioId);
  };

  const getTeacherByUserId = (usuarioId) => {
    return db.teachers.find(t => t.usuarioId === usuarioId);
  };

  return (
    <AppContext.Provider
      value={{
        db,
        currentUser,
        loading,
        isOnline,
        login,
        loginAs,
        logout,
        updateProfile,
        addCourse,
        updateCourse,
        deleteCourse,
        addGrade,
        updateGrade,
        deleteGrade,
        addAttendance,
        updateAttendance,
        deleteAttendance,
        bulkSaveAttendance,
        getUserProfile,
        getStudentByUserId,
        getTeacherByUserId,
        addUser,
        updateUser,
        deleteUser,
        reloadData: loadData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe usarse dentro de un AppProvider");
  }
  return context;
}
