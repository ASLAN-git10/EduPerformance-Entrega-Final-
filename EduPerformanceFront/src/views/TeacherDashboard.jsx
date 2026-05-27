import { useState, useEffect } from "react";
import { CardSkeleton, TableSkeleton, ProfileSkeleton } from "@/components/ui/Skeletons";
import { useApp } from "@/components/AppContext";
import {
  LogOut,
  BookOpen,
  Award,
  Calendar,
  Users,
  Plus,
  Edit2,
  Trash2,
  Save,
  AlertCircle,
  Clock,
  Briefcase,
  Search,
  BookOpenCheck,
  Mail,
  MapPin,
  Phone,
  Check,
  CheckCircle2,
  Hash,
  GraduationCap
} from "lucide-react";


export default function TeacherDashboard() {
  const {
    db,
    currentUser,
    logout,
    getUserProfile,
    getTeacherByUserId,
    addCourse,
    updateCourse,
    deleteCourse,
    addGrade,
    updateGrade,
    deleteGrade,
    bulkSaveAttendance,
    deleteAttendance,
    isOnline
  } = useApp();

  const teacher = getTeacherByUserId(currentUser.id);
  const profile = getUserProfile(currentUser.id);

  const [activeTab, setActiveTab] = useState("resumen");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  // --- CRUD STATES ---
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); 

  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  // Form inputs for Course
  const [courseNombre, setCourseNombre] = useState("");
  const [courseCodigo, setCourseCodigo] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseHorario, setCourseHorario] = useState("");

  // Form inputs for Grade
  const [gradeStudentId, setGradeStudentId] = useState("");
  const [gradeCourseId, setGradeCourseId] = useState("");
  const [gradeNota, setGradeNota] = useState("");
  const [gradePorcentaje, setGradePorcentaje] = useState("20");
  const [gradeActividad, setGradeActividad] = useState("");
  const [gradeObservacion, setGradeObservacion] = useState("");
  const [modalSearchText, setModalSearchText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Attendance Form state
  const [attendanceCourseId, setAttendanceCourseId] = useState("");
  const [attendanceFecha, setAttendanceFecha] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceList, setAttendanceList] = useState([]); 
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState("");

  // Simulate loading on mount and tab change
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (!teacher) {
    return (
      <div className="error-screen">
        <p>Error: No se encontró perfil de docente asociado a este usuario.</p>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    );
  }

  // --- FILTERED DATA FOR THIS TEACHER ---
  const teacherCourses = db.courses.filter(c => c.profesorId === teacher.id);
  const teacherCourseIds = teacherCourses.map(c => c.id);

  // Grades belonging to this teacher's courses
  const teacherGrades = db.grades.filter(g => teacherCourseIds.includes(g.cursoId));

  // Attendances taken in this teacher's courses
  const teacherAttendances = db.attendances.filter(a => teacherCourseIds.includes(a.cursoId));

  // --- COMPUTE STATISTICS ---
  const totalStudentsCount = db.students.length; 
  
  const averageGrade = teacherGrades.length > 0
    ? (teacherGrades.reduce((sum, g) => sum + g.nota, 0) / teacherGrades.length).toFixed(2)
    : "0.0";

  const presentAttendances = teacherAttendances.filter(a => a.estado === "Presente").length;
  
  const attendanceRate = teacherAttendances.length > 0
    ? ((presentAttendances / teacherAttendances.length) * 100).toFixed(0)
    : "100";

  // Compute circle progress variables (radial gauge for sidebar)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (parseFloat(attendanceRate) / 100) * circumference;

  // --- CRUD ACTIONS ---

  // COURSES
  const handleOpenCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseNombre(course.nombre);
      setCourseCodigo(course.codigo);
      setCourseDesc(course.descripcion);
      setCourseHorario(course.horario);
    } else {
      setEditingCourse(null);
      setCourseNombre("");
      setCourseCodigo("");
      setCourseDesc("");
      setCourseHorario("");
    }
    setCourseModalOpen(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    const courseData = {
      nombre: courseNombre,
      codigo: courseCodigo,
      descripcion: courseDesc,
      horario: courseHorario,
      profesorId: teacher.id
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }

    setCourseModalOpen(false);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso? Se borrarán todas las notas y asistencias asociadas.")) {
      deleteCourse(id);
    }
  };

  // GRADES
  const handleOpenGradeModal = (grade = null) => {
    if (grade) {
      setEditingGrade(grade);
      setGradeStudentId(grade.estudianteId.toString());
      setGradeCourseId(grade.cursoId.toString());
      setGradeNota(grade.nota.toString());
      setGradePorcentaje(grade.porcentaje.toString());
      setGradeActividad(grade.actividad);
      setGradeObservacion(grade.observacion);

      const selectedStudent = db.students.find(s => s.id === grade.estudianteId);
      const studentUser = db.users.find(u => u.id === selectedStudent?.usuarioId);
      setModalSearchText(studentUser?.nombre || "");
    } else {
      setEditingGrade(null);
      const firstStudent = db.students[0];
      setGradeStudentId(firstStudent?.id.toString() || "");
      setGradeCourseId(teacherCourses[0]?.id.toString() || "");
      setGradeNota("");
      setGradePorcentaje("20");
      setGradeActividad("");
      setGradeObservacion("");

      const studentUser = db.users.find(u => u.id === firstStudent?.usuarioId);
      setModalSearchText(studentUser?.nombre || "");
    }
    setGradeModalOpen(true);
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    const gradeData = {
      estudianteId: parseInt(gradeStudentId, 10),
      cursoId: parseInt(gradeCourseId, 10),
      nota: parseFloat(gradeNota),
      porcentaje: parseInt(gradePorcentaje, 10),
      actividad: gradeActividad,
      observacion: gradeObservacion
    };

    if (editingGrade) {
      updateGrade(editingGrade.id, gradeData);
    } else {
      addGrade(gradeData);
    }

    setGradeModalOpen(false);
  };

  const handleDeleteGrade = (id) => {
    if (window.confirm("¿Estás seguro de que deseas borrar esta calificación?")) {
      deleteGrade(id);
    }
  };

  // BULK ATTENDANCE
  const handleLoadAttendanceList = (courseId) => {
    setAttendanceCourseId(courseId);
    if (!courseId) {
      setAttendanceList([]);
      return;
    }

    const existing = db.attendances.filter(a => a.cursoId === parseInt(courseId, 10) && a.fecha === attendanceFecha);
    
    const initialList = db.students.map(student => {
      const existRecord = existing.find(e => e.estudianteId === student.id);
      return {
        estudianteId: student.id,
        estado: existRecord ? existRecord.estado : "Presente"
      };
    });

    setAttendanceList(initialList);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceList(prev => prev.map(item => {
      if (item.estudianteId === studentId) {
        return { ...item, estado: status };
      }
      return item;
    }));
  };

  const handleSaveAttendanceBulk = (e) => {
    e.preventDefault();
    if (!attendanceCourseId) {
      alert("Por favor selecciona un curso.");
      return;
    }
    bulkSaveAttendance(attendanceCourseId, attendanceFecha, attendanceList);
    setAttendanceSavedMessage("Registro de asistencia guardado y actualizado con éxito.");
    setTimeout(() => setAttendanceSavedMessage(""), 4000);
  };

  const handleDeleteAttendanceRecord = (id) => {
    if (window.confirm("¿Borrar este registro de asistencia individual?")) {
      deleteAttendance(id);
    }
  };



  // --- SVG COMPARATIVE COURSE PERFORMANCE CHART ---
  const coursePerformanceData = teacherCourses.map((c) => {
    const courseGrades = db.grades.filter(g => g.cursoId === c.id);
    const avg = courseGrades.length > 0
      ? courseGrades.reduce((sum, g) => sum + g.nota, 0) / courseGrades.length
      : 0;
    return { name: c.nombre, code: c.codigo, avg };
  });

  const renderCoursePerformanceChart = () => {
    if (coursePerformanceData.length === 0) {
      return <div className="empty-state">No hay asignaturas disponibles para graficar el rendimiento.</div>;
    }

    const width = 460;
    const height = 140;
    const paddingX = 40;
    const paddingY = 20;

    const points = coursePerformanceData.map((c, index) => {
      const x = coursePerformanceData.length > 1
        ? paddingX + (index / (coursePerformanceData.length - 1)) * (width - paddingX * 2)
        : width / 2;
      const y = height - paddingY - (c.avg / 5.0) * (height - paddingY * 2);
      return { x, y, code: c.code, avg: c.avg };
    });

    let d = "";
    if (points.length > 0) {
      d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX1 = p0.x + (p1.x - p0.x) / 2;
        const cpY1 = p0.y;
        const cpX2 = p0.x + (p1.x - p0.x) / 2;
        const cpY2 = p1.y;
        d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      }
    }

    const fillD = points.length > 0
      ? `${d} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : "";

    return (
      <div className="svg-chart-container">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Gridlines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} className="svg-chart-grid" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} className="svg-chart-grid" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="svg-chart-grid" />

          {/* Area under curve */}
          {fillD && <path d={fillD} className="svg-chart-fill" />}

          {/* Bezier Line */}
          {d && <path d={d} className="svg-chart-line" />}

          {/* Interactive points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4.5" className="svg-chart-point" />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="900"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.8))" }}
              >
                {p.avg > 0 ? p.avg.toFixed(2) : "0.0"}
              </text>
              <text
                x={p.x}
                y={height - 4}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="8"
                fontWeight="700"
              >
                {p.code}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // Filter students list based on search query
  const filteredStudents = db.students.filter(s => {
    const estUser = db.users.find(u => u.id === s.usuarioId);
    return (
      s.codigo.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      (estUser?.nombre || "").toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.carrera.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="dashboard-container teacher-theme">
      {/* Background Glows (Glassmorphic Dark Neon Theme) */}
      <div className="dashboard-glow-container" aria-hidden="true">
        <div className="glow-sphere glow-primary"></div>
        <div className="glow-sphere glow-secondary"></div>
        <div className="glow-sphere glow-tertiary"></div>
        <div className="dashboard-grid-pattern"></div>
      </div>

      {/* Definición global de gradientes SVG para referencias en strokes */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="cyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="purpleOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>

      {/* Sidebar navigation (BLANCO DE ALTO CONTRASTE) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Briefcase size={26} className="brand-icon-teacher" />
          <div className="brand-text">
            <h2>EduPerformance</h2>
            <span>Portal Docente</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar-wrapper">
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
              alt={currentUser.nombre}
              className="user-avatar"
            />
            <div className="status-indicator online"></div>
          </div>
          <div className="user-details">
            <h3>{currentUser.nombre}</h3>
            <span className="user-code">{teacher.codigo}</span>
            <span className="user-tag">{teacher.departamento}</span>
          </div>
        </div>

        {/* MEDIDOR RADIAL DOCENTE (Inspirado en el 13% del Mockup - Asistencia general del grupo) */}
        <div className="sidebar-radial-container">
          <div className="sidebar-radial-gauge">
            <svg viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="sidebar-radial-bg-circle"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="sidebar-radial-fill-circle"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="sidebar-radial-center-card">
              <span className="sidebar-radial-percentage">{attendanceRate}%</span>
              <span className="sidebar-radial-label">Asistencia</span>
            </div>
          </div>
        </div>

        {/* GRID DE ESTADISTICAS SIDECAR */}
        <div className="sidebar-stats-grid">
          <div className="sidebar-stat-card">
            <span className="sidebar-stat-val">{averageGrade}</span>
            <span className="sidebar-stat-lbl">Promedio</span>
          </div>
          <div className="sidebar-stat-card">
            <span className="sidebar-stat-val">{teacherCourses.length}</span>
            <span className="sidebar-stat-lbl">Materias</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`nav-item ${activeTab === "resumen" ? "active" : ""}`}
          >
            <Clock size={18} />
            <span>Panel de Control</span>
          </button>
          <button
            onClick={() => setActiveTab("cursos")}
            className={`nav-item ${activeTab === "cursos" ? "active" : ""}`}
          >
            <BookOpen size={18} />
            <span>Gestión de Cursos</span>
          </button>
          <button
            onClick={() => setActiveTab("notas")}
            className={`nav-item ${activeTab === "notas" ? "active" : ""}`}
          >
            <Award size={18} />
            <span>Notas Académicas</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("asistencia");
              if (teacherCourses.length > 0) {
                handleLoadAttendanceList(teacherCourses[0].id.toString());
              }
            }}
            className={`nav-item ${activeTab === "asistencia" ? "active" : ""}`}
          >
            <Calendar size={18} />
            <span>Toma de Asistencia</span>
          </button>
          <button
            onClick={() => setActiveTab("estudiantes")}
            className={`nav-item ${activeTab === "estudiantes" ? "active" : ""}`}
          >
            <Users size={18} />
            <span>Mis Estudiantes</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-button">
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main dashboard content area */}
      <main className="dashboard-content">

        <header className="content-header">
          <div>
            <h1 style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Bienvenido, {currentUser.nombre}
              <GraduationCap size={28} className="welcome-icon welcome-icon-teacher" />
            </h1>
            <p className="welcome-date">
              Sistema de Gestión Académica y Analítica
              <span className={`connection-badge ${isOnline ? "online" : "offline"}`} style={{ marginLeft: "12px", fontSize: "0.75rem", padding: "3px 8px", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: "bold", background: isOnline ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: isOnline ? "#10b981" : "#ef4444", border: isOnline ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isOnline ? "#10b981" : "#ef4444", display: "inline-block" }}></span>
                {isOnline ? "En Línea" : "Sin Conexión"}
              </span>
            </p>
          </div>
          <div className="header-info-badge">
            <span className="departamento-badge">{teacher.departamento}</span>
          </div>
        </header>

        <div className="tab-viewport">
          {/* TAB 1: SUMMARY */}
          {activeTab === "resumen" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <>
                  <div className="metrics-grid">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                  <div className="dashboard-double-columns" style={{ marginTop: "24px" }}>
                    <TableSkeleton rows={3} cols={4} />
                    <CardSkeleton />
                  </div>
                </>
              ) : (
              <>
              <div className="metrics-grid">
                <div className="metric-card glass-panel">
                  <div className="metric-header">
                    <span className="metric-title">Alumnos del Sistema</span>
                    <span className="metric-icon-box users-color">
                      <Users size={22} />
                    </span>
                  </div>
                  <div className="metric-value">{totalStudentsCount}</div>
                  <div className="metric-footer">
                    <span className="metric-trend">Total estudiantes matriculados</span>
                  </div>
                </div>

                <div className="metric-card glass-panel">
                  <div className="metric-header">
                    <span className="metric-title">Rendimiento Promedio</span>
                    <span className="metric-icon-box grade-color">
                      <Award size={22} />
                    </span>
                  </div>
                  <div className="metric-value">{averageGrade}</div>
                  <div className="metric-footer">
                    <span className="metric-trend positive">Calificación general satisfactoria</span>
                  </div>
                </div>

                <div className="metric-card glass-panel">
                  <div className="metric-header">
                    <span className="metric-title">Asistencia Agregada</span>
                    <span className="metric-icon-box attendance-color">
                      <Calendar size={22} />
                    </span>
                  </div>
                  <div className="metric-value">{attendanceRate}%</div>
                  <div className="metric-footer">
                    <div className="linear-progress-track">
                      <div
                        className="linear-progress-bar"
                        style={{ width: `${attendanceRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-double-columns mt-6">
                {/* SVG Curve Line Chart comparing Course averages */}
                <div className="dashboard-column glass-panel">
                  <h3>Promedio Académico por Asignatura</h3>
                  {renderCoursePerformanceChart()}
                </div>

                {/* Course List summary with linear bars */}
                <div className="dashboard-column glass-panel">
                  <h3>Distribución de Rendimiento</h3>
                  <div className="simple-list mt-4">
                    {coursePerformanceData.slice(0, 3).map((c, idx) => (
                      <div key={idx} className="linear-progress-item">
                        <div className="linear-progress-label-row">
                          <span>{c.name}</span>
                          <span>{c.avg > 0 ? c.avg.toFixed(2) : "0.0"} / 5.0</span>
                        </div>
                        <div className="linear-progress-track">
                          <div
                            className="linear-progress-bar"
                            style={{ width: `${(c.avg / 5.0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </>
              )}
            </div>
          )}

          {/* TAB 2: COURSE CRUD */}
          {activeTab === "cursos" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <div className="courses-grid">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : (
              <>
              <div className="tab-actions-header">
                <h3>Asignaturas de su Cargo</h3>
                <button className="premium-btn action-add-btn" onClick={() => handleOpenCourseModal()}>
                  <Plus size={18} />
                  <span>Crear Nuevo Curso</span>
                </button>
              </div>

              <div className="courses-grid">
                {teacherCourses.length === 0 ? (
                  <p className="empty-state-full col-span-3">No tienes asignaturas creadas aún. Crea una arriba.</p>
                ) : (
                  teacherCourses.map((c) => (
                    <div key={c.id} className="course-card glass-panel relative">
                      <span className="course-code-badge">{c.codigo}</span>
                      <h3>{c.nombre}</h3>
                      <p className="course-desc">{c.descripcion}</p>
                      <div className="course-card-meta">
                        <div className="meta-schedule">
                          <strong>Horario:</strong>
                          <span>{c.horario}</span>
                        </div>
                      </div>
                      <div className="course-card-actions mt-4 flex gap-2" style={{ zIndex: 10 }}>
                        <button
                          className="action-icon-btn edit"
                          onClick={() => handleOpenCourseModal(c)}
                        >
                          <Edit2 size={14} />
                          <span>Editar</span>
                        </button>
                        <button
                          className="action-icon-btn delete"
                          onClick={() => handleDeleteCourse(c.id)}
                        >
                          <Trash2 size={14} />
                          <span>Borrar</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              </>
              )}
            </div>
          )}

          {/* TAB 3: GRADES CRUD */}
          {activeTab === "notas" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <TableSkeleton rows={5} cols={7} />
              ) : (
              <>
              <div className="tab-actions-header">
                <h3>Planilla de Calificaciones</h3>
                <button
                  className="premium-btn action-add-btn"
                  onClick={() => handleOpenGradeModal()}
                  disabled={teacherCourses.length === 0}
                >
                  <Plus size={18} />
                  <span>Subir Nota</span>
                </button>
              </div>

              {teacherCourses.length === 0 && (
                <div className="info-warning-banner">
                  <AlertCircle size={20} />
                  <span>Debes crear al menos un curso antes de registrar calificaciones.</span>
                </div>
              )}

              <div className="glass-panel overflow-hidden-x">
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Asignatura</th>
                        <th>Actividad Evaluativa</th>
                        <th>Porcentaje (Peso)</th>
                        <th>Calificación</th>
                        <th>Observación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherGrades.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-8">
                            No se han subido calificaciones aún.
                          </td>
                        </tr>
                      ) : (
                        teacherGrades.map((g) => {
                          const est = db.students.find(s => s.id === g.estudianteId);
                          const estUser = db.users.find(u => u.id === est?.usuarioId);
                          const curso = db.courses.find(c => c.id === g.cursoId);
                          return (
                            <tr key={g.id}>
                              <td>
                                <strong>{estUser?.nombre}</strong>
                                <span className="sub-text block">{est?.codigo}</span>
                              </td>
                              <td>{curso?.nombre}</td>
                              <td>{g.actividad}</td>
                              <td>{g.porcentaje}%</td>
                              <td>
                                <span className={`grade-tag ${g.nota >= 4.0 ? "high" : g.nota >= 3.0 ? "medium" : "low"}`}>
                                  {g.nota.toFixed(1)}
                                </span>
                              </td>
                              <td className="observation-cell">{g.observacion || "Sin observaciones"}</td>
                              <td>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleOpenGradeModal(g)}
                                    className="action-icon-btn edit"
                                    title="Editar"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGrade(g.id)}
                                    className="action-icon-btn delete"
                                    title="Borrar"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
              )}
            </div>
          )}

          {/* TAB 4: BULK ATTENDANCE CRUD */}
          {activeTab === "asistencia" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <>
                  <CardSkeleton />
                  <TableSkeleton rows={4} cols={3} />
                </>
              ) : (
              <>
              <div className="glass-panel">
                <h3>Control Diario de Asistencia</h3>
                <p>Seleccione la asignatura y la fecha de clase para tomar el paso de lista colectivo.</p>

                <form onSubmit={handleSaveAttendanceBulk} className="premium-form attendance-select-form mt-4">
                  {attendanceSavedMessage && (
                    <div className="form-success-banner">
                      <Check size={18} />
                      <span>{attendanceSavedMessage}</span>
                    </div>
                  )}

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="att-course">Asignatura</label>
                      <select
                        id="att-course"
                        value={attendanceCourseId}
                        onChange={(e) => handleLoadAttendanceList(e.target.value)}
                        required
                      >
                        <option value="">-- Seleccionar Materia --</option>
                        {teacherCourses.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre} ({c.codigo})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="att-date">Fecha de la Sesión</label>
                      <input
                        type="date"
                        id="att-date"
                        value={attendanceFecha}
                        onChange={(e) => {
                          setAttendanceFecha(e.target.value);
                          if (attendanceCourseId) {
                            setTimeout(() => handleLoadAttendanceList(attendanceCourseId), 10);
                          }
                        }}
                        required
                      />
                    </div>
                  </div>

                  {attendanceCourseId && (
                    <div className="attendance-taking-section mt-6">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h4 className="section-title" style={{ color: "#ffffff", margin: 0, fontWeight: "800" }}>Paso de Lista Estudiantil</h4>
                        <button
                          type="button"
                          className="attendance-action-btn"
                          onClick={() => setAttendanceList(prev => prev.map(item => ({ ...item, estado: "Presente" })))}
                        >
                          <CheckCircle2 size={14} />
                          <span>Marcar todos como Presente</span>
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="premium-table">
                          <thead>
                            <tr>
                              <th>Estudiante</th>
                              <th>Código</th>
                              <th>Estado de Asistencia</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceList.length === 0 ? (
                              <tr>
                                <td colSpan="3" className="text-center py-6">No hay estudiantes cargados en el sistema.</td>
                              </tr>
                            ) : (
                              attendanceList.map(item => {
                                const est = db.students.find(s => s.id === item.estudianteId);
                                const estUser = db.users.find(u => u.id === est?.usuarioId);
                                return (
                                  <tr key={item.estudianteId}>
                                    <td><strong>{estUser?.nombre}</strong></td>
                                    <td><code>{est?.codigo}</code></td>
                                    <td>
                                      <div className="attendance-options-row">
                                        {["Presente", "Ausente", "Tarde", "Excusa"].map(status => (
                                          <label
                                            key={status}
                                            className={`attendance-radio-label ${status.toLowerCase()} ${item.estado === status ? "selected" : ""}`}
                                          >
                                            <input
                                              type="radio"
                                              name={`att-radio-${item.estudianteId}`}
                                              value={status}
                                              checked={item.estado === status}
                                              onChange={() => handleAttendanceChange(item.estudianteId, status)}
                                            />
                                            <span>{status}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      <button type="submit" className="form-submit-btn mt-6">
                        <Save size={18} />
                        <span>Guardar Planilla de Asistencia</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Attendance logs list */}
              <div className="glass-panel mt-6">
                <h3>Registros de Asistencia Históricos</h3>
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Fecha Sesión</th>
                        <th>Asignatura</th>
                        <th>Estudiante</th>
                        <th>Estado de Asistencia</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherAttendances.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-6">No has tomado asistencia en ningún curso.</td>
                        </tr>
                      ) : (
                        teacherAttendances.map(a => {
                          const curso = db.courses.find(c => c.id === a.cursoId);
                          const est = db.students.find(s => s.id === a.estudianteId);
                          const estUser = db.users.find(u => u.id === est?.usuarioId);
                          return (
                            <tr key={a.id}>
                              <td>{a.fecha}</td>
                              <td>{curso?.nombre}</td>
                              <td>{estUser?.nombre}</td>
                              <td>
                                <span className={`attendance-badge ${a.estado.toLowerCase()}`}>
                                  {a.estado}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="action-icon-btn delete"
                                  onClick={() => handleDeleteAttendanceRecord(a.id)}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
              )}
            </div>
          )}

          {/* TAB 5: STUDENTS LIST */}
          {activeTab === "estudiantes" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                  <ProfileSkeleton />
                  <ProfileSkeleton />
                  <ProfileSkeleton />
                  <ProfileSkeleton />
                </div>
              ) : (
              <div className="glass-panel" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
                <div className="tab-actions-header">
                  <h3>Directorio de Alumnos Vinculados</h3>
                  <div className="input-shell search-shell" style={{ minWidth: "280px", minHeight: "40px" }}>
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Buscar estudiante, código o carrera..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="glass-panel text-center py-8 mt-4">
                    <p>No se encontraron estudiantes que coincidan con la búsqueda.</p>
                  </div>
                ) : (
                  <div className="student-cards-grid">
                    {filteredStudents.map(s => {
                      const estUser = db.users.find(u => u.id === s.usuarioId);
                      const estProfile = getUserProfile(s.usuarioId);
                      
                      // Calculate average grade in teacher's courses
                      const studentGradesInTeacherCourses = db.grades.filter(
                        g => g.estudianteId === s.id && teacherCourseIds.includes(g.cursoId)
                      );
                      const avgGrade = studentGradesInTeacherCourses.length > 0
                        ? (studentGradesInTeacherCourses.reduce((sum, g) => sum + g.nota, 0) / studentGradesInTeacherCourses.length).toFixed(2)
                        : "0.0";
                        
                      // Calculate attendance rate in teacher's courses
                      const studentAttendancesInTeacherCourses = db.attendances.filter(
                        a => a.estudianteId === s.id && teacherCourseIds.includes(a.cursoId)
                      );
                      const presentCount = studentAttendancesInTeacherCourses.filter(a => a.estado === "Presente").length;
                      const attendancePercentage = studentAttendancesInTeacherCourses.length > 0
                        ? ((presentCount / studentAttendancesInTeacherCourses.length) * 100).toFixed(0)
                        : "100";

                      return (
                        <div key={s.id} className="student-card">
                          <div className="student-card-header">
                            <img
                              src={estProfile.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"}
                              alt={estUser?.nombre}
                              className="student-card-avatar"
                            />
                            <div className="student-card-info">
                              <h4>{estUser?.nombre}</h4>
                              <span>{s.codigo}</span>
                            </div>
                          </div>
                          <span className="student-card-program">{s.carrera} • Semestre {s.semestre}</span>
                          
                          <div className="student-card-stats">
                            <div className="student-card-stat">
                              <span className="student-card-stat-val" style={{ color: parseFloat(avgGrade) >= 4.0 ? "#10b981" : parseFloat(avgGrade) >= 3.0 ? "#f59e0b" : "#ef4444" }}>
                                {avgGrade}
                              </span>
                              <span className="student-card-stat-lbl">Promedio</span>
                            </div>
                            <div className="student-card-stat">
                              <span className="student-card-stat-val" style={{ color: parseFloat(attendancePercentage) >= 80 ? "#10b981" : parseFloat(attendancePercentage) >= 60 ? "#f59e0b" : "#ef4444" }}>
                                {attendancePercentage}%
                              </span>
                              <span className="student-card-stat-lbl">Asistencia</span>
                            </div>
                          </div>
                          
                          <div className="student-card-contact">
                            <div className="student-card-contact-item">
                              <Mail size={12} />
                              <span style={{ wordBreak: "break-all" }}>{estUser?.email}</span>
                            </div>
                            <div className="student-card-contact-item">
                              <Phone size={12} />
                              <span>{estProfile.telefono || "Sin teléfono"}</span>
                            </div>
                            <div className="student-card-contact-item">
                              <MapPin size={12} />
                              <span>{estProfile.direccion || "Sin dirección"}</span>
                            </div>
                          </div>
                          
                          <div className="student-card-actions">
                            <a href={`mailto:${estUser?.email}`} className="student-card-btn" style={{ textDecoration: "none" }}>
                              <Mail size={13} />
                              <span>Enviar Correo</span>
                            </a>
                            <button
                              type="button"
                              className="student-card-btn"
                              onClick={() => {
                                navigator.clipboard.writeText(estUser?.email || "");
                                alert("Correo copiado al portapapeles: " + estUser?.email);
                              }}
                            >
                              <Check size={13} />
                              <span>Copiar Correo</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* TAB 6: PROFILE EDIT */}
          {activeTab === "perfil" && (
            <div className="tab-pane fadeIn">
              <div className="glass-panel profile-edit-container">
                <form onSubmit={handleProfileSave} className="premium-form">
                  <h2>Editar Datos de Cátedra</h2>
                  <p>Mantenga su información de contacto y resumen curricular vigentes en la institución.</p>

                  {profileSaved && (
                    <div className="form-success-banner">
                      <Check size={18} />
                      <span>Perfil docente actualizado con éxito en el sistema central.</span>
                    </div>
                  )}

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="teacher-email">Correo Docente (No Editable)</label>
                      <div className="input-shell disabled-shell">
                        <Mail size={18} />
                        <input
                          type="email"
                          id="teacher-email"
                          value={currentUser.email}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="teacher-code">Código Único de Docente</label>
                      <div className="input-shell disabled-shell">
                        <Hash size={18} />
                        <input
                          type="text"
                          id="teacher-code"
                          value={teacher.codigo}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="teacher-phone">Teléfono de Oficina/Celular</label>
                      <div className="input-shell">
                        <Phone size={18} />
                        <input
                          type="text"
                          id="teacher-phone"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="+57 300 000 0000"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="teacher-address">Dirección Física de Residencia</label>
                      <div className="input-shell">
                        <MapPin size={18} />
                        <input
                          type="text"
                          id="teacher-address"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                          placeholder="Calle, Número, Ciudad"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="teacher-dep">Departamento Académico</label>
                      <div className="input-shell disabled-shell">
                        <Briefcase size={18} />
                        <input
                          type="text"
                          id="teacher-dep"
                          value={teacher.departamento}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="teacher-spec">Especialidad de Cátedra</label>
                      <div className="input-shell disabled-shell">
                        <Award size={18} />
                        <input
                          type="text"
                          id="teacher-spec"
                          value={teacher.especialidad}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="teacher-bio">Biografía / Enfoque Curricular</label>
                    <textarea
                      id="teacher-bio"
                      value={biografia}
                      onChange={(e) => setBiografia(e.target.value)}
                      placeholder="Escriba un resumen sobre su trayectoria académica, áreas de investigación, etc..."
                      rows="4"
                    ></textarea>
                  </div>

                  <button type="submit" className="form-submit-btn">
                    <Save size={18} />
                    <span>Guardar Perfil Docente</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==========================================
         GLASSMORPHIC MODALS FOR CRUD OPERATIONS
         ========================================== */}

      {/* COURSE MODAL */}
      {courseModalOpen && (
        <div className="modal-backdrop fadeIn">
          <div className="modal-content glass-panel bounceIn">
            <div className="modal-header">
              <h2>{editingCourse ? "Editar Asignatura" : "Crear Nueva Asignatura"}</h2>
              <button className="close-btn" onClick={() => setCourseModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveCourse} className="premium-form">
              <div className="form-group">
                <label htmlFor="c-name">Nombre de la Asignatura</label>
                <input
                  type="text"
                  id="c-name"
                  value={courseNombre}
                  onChange={(e) => setCourseNombre(e.target.value)}
                  placeholder="Ej. Estructuras de Datos"
                  required
                />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="c-code">Código de Materia</label>
                  <input
                    type="text"
                    id="c-code"
                    value={courseCodigo}
                    onChange={(e) => setCourseCodigo(e.target.value)}
                    placeholder="Ej. EDD-101"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="c-sched">Horario Semanal</label>
                  <input
                    type="text"
                    id="c-sched"
                    value={courseHorario}
                    onChange={(e) => setCourseHorario(e.target.value)}
                    placeholder="Ej. Lunes y Miércoles 10-12"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-desc">Descripción Académica</label>
                <textarea
                  id="c-desc"
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Escriba un breve syllabus o propósito formativo del curso..."
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setCourseModalOpen(false)}>Cancelar</button>
                <button type="submit" className="form-submit-btn">
                  <Save size={16} />
                  <span>{editingCourse ? "Actualizar Asignatura" : "Crear Asignatura"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADE MODAL */}
      {gradeModalOpen && (
        <div className="modal-backdrop fadeIn">
          <div className="modal-content glass-panel bounceIn">
            <div className="modal-header">
              <h2>{editingGrade ? "Editar Calificación" : "Subir Nueva Calificación"}</h2>
              <button className="close-btn" onClick={() => setGradeModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveGrade} className="premium-form">
              <div className="form-group" style={{ position: "relative" }}>
                <label htmlFor="g-est-search">Buscar y Seleccionar Estudiante</label>
                <div className="input-shell search-filter-shell">
                  <Search size={16} style={{ color: "rgba(255, 255, 255, 0.4)" }} />
                  <input
                    id="g-est-search"
                    type="text"
                    placeholder="Escribe el nombre o código del estudiante..."
                    value={modalSearchText}
                    onChange={(e) => {
                      setModalSearchText(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    required
                  />
                  {/* Keep hidden input for the form state */}
                  <input type="hidden" name="gradeStudentId" value={gradeStudentId} />
                </div>
                
                {dropdownOpen && (
                  <div className="predictive-list-container">
                    {db.students
                      .filter(s => {
                        const u = db.users.find(usr => usr.id === s.usuarioId);
                        return (
                          (u?.nombre || "").toLowerCase().includes(modalSearchText.toLowerCase()) ||
                          s.codigo.toLowerCase().includes(modalSearchText.toLowerCase())
                        );
                      })
                      .map(s => {
                        const u = db.users.find(usr => usr.id === s.usuarioId);
                        return (
                          <div
                            key={s.id}
                            className="predictive-list-item"
                            onClick={() => {
                              setGradeStudentId(s.id.toString());
                              setModalSearchText(u?.nombre || "");
                              setDropdownOpen(false);
                            }}
                          >
                            <strong>{u?.nombre}</strong>
                            <code style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{s.codigo}</code>
                          </div>
                        );
                      })}
                    {db.students.filter(s => {
                      const u = db.users.find(usr => usr.id === s.usuarioId);
                      return (
                        (u?.nombre || "").toLowerCase().includes(modalSearchText.toLowerCase()) ||
                        s.codigo.toLowerCase().includes(modalSearchText.toLowerCase())
                      );
                    }).length === 0 && (
                      <div style={{ padding: "12px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                        Ningún estudiante coincide.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="g-course">Asignatura</label>
                  <select
                    id="g-course"
                    value={gradeCourseId}
                    onChange={(e) => setGradeCourseId(e.target.value)}
                    required
                  >
                    {teacherCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} ({c.codigo})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="g-act">Actividad Evaluativa</label>
                  <input
                    type="text"
                    id="g-act"
                    value={gradeActividad}
                    onChange={(e) => setGradeActividad(e.target.value)}
                    placeholder="Ej. Parcial I, Taller II"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="g-nota">Calificación (0.0 - 5.0)</label>
                  <input
                    type="number"
                    id="g-nota"
                    value={gradeNota}
                    onChange={(e) => setGradeNota(e.target.value)}
                    placeholder="4.5"
                    step="0.1"
                    min="0.0"
                    max="5.0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="g-porc">Ponderación / Peso (%)</label>
                  <input
                    type="number"
                    id="g-porc"
                    value={gradePorcentaje}
                    onChange={(e) => setGradePorcentaje(e.target.value)}
                    placeholder="20"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="g-obs">Observaciones de Desempeño</label>
                <input
                  type="text"
                  id="g-obs"
                  value={gradeObservacion}
                  onChange={(e) => setGradeObservacion(e.target.value)}
                  placeholder="Ej. Buen dominio conceptual, cuidar detalles de formato."
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setGradeModalOpen(false)}>Cancelar</button>
                <button type="submit" className="form-submit-btn">
                  <Save size={16} />
                  <span>{editingGrade ? "Actualizar Nota" : "Subir Nota"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
