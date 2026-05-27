import { useState, useEffect } from "react";
import { CardSkeleton, TableSkeleton, ProfileSkeleton } from "@/components/ui/Skeletons";
import { useApp } from "@/components/AppContext";
import {
  LogOut,
  User,
  BookOpen,
  Award,
  Calendar,
  MapPin,
  Phone,
  BookOpenCheck,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Info,
  Sparkles
} from "lucide-react";

export default function StudentDashboard() {
  const {
    db,
    currentUser,
    logout,
    getUserProfile,
    getStudentByUserId,
    isOnline
  } = useApp();

  const [activeTab, setActiveTab] = useState("resumen");
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile Form State
  const profile = getUserProfile(currentUser.id);
  const student = getStudentByUserId(currentUser.id);
  
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Simulate loading on mount and tab change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (!student) {
    return (
      <div className="error-screen">
        <p>Error: No se encontró perfil de estudiante asociado a este usuario.</p>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    );
  }

  // Filter grades & attendance for this student
  const studentGrades = db.grades.filter((g) => g.estudianteId === student.id);
  const studentAttendances = db.attendances.filter((a) => a.estudianteId === student.id);
  
  // Find courses that are linked to this student
  const studentCourseIds = Array.from(
    new Set([
      ...studentGrades.map((g) => g.cursoId),
      ...studentAttendances.map((a) => a.cursoId)
    ])
  );
  
  const studentCourses = db.courses.filter((c) => studentCourseIds.includes(c.id));

  // Compute Metrics
  // 1. GPA (Average Grade)
  const averageGrade = studentGrades.length > 0
    ? (studentGrades.reduce((sum, g) => sum + g.nota, 0) / studentGrades.length).toFixed(2)
    : "0.0";

  // 2. Attendance %
  const totalClasses = studentAttendances.length;
  const presentsCount = studentAttendances.filter((a) => a.estado === "Presente").length;
  const tardesCount = studentAttendances.filter((a) => a.estado === "Tarde").length;
  const excusasCount = studentAttendances.filter((a) => a.estado === "Excusa").length;
  
  const attendanceRate = totalClasses > 0
    ? (((presentsCount + tardesCount * 0.7 + excusasCount) / totalClasses) * 100).toFixed(0)
    : "100";

  // Compute circle progress variables (radial gauge)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (parseFloat(attendanceRate) / 100) * circumference;

  // --- SVG GRADES TRAJECTORY GENERATOR (BEZIER CURVE) ---
  const renderGradesChart = () => {
    if (studentGrades.length === 0) {
      return <div className="empty-state">No hay suficientes datos académicos para graficar.</div>;
    }

    // Sort grades by date for a chronological timeline
    const sortedGrades = [...studentGrades].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const maxPoints = Math.min(sortedGrades.length, 6);
    const chartGrades = sortedGrades.slice(-maxPoints);

    const width = 460;
    const height = 140;
    const paddingX = 40;
    const paddingY = 20;

    // Map grades (0.0 to 5.0) to SVG coordinates
    const points = chartGrades.map((g, index) => {
      const x = chartGrades.length > 1 
        ? paddingX + (index / (chartGrades.length - 1)) * (width - paddingX * 2)
        : width / 2;
      const y = height - paddingY - (g.nota / 5.0) * (height - paddingY * 2);
      return {
        x,
        y,
        grade: g.nota,
        activity: g.actividad,
        date: g.fecha,
        percentage: g.porcentaje
      };
    });

    // Build SVG Path string (smooth line using Bezier curve control points)
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

    // Fill underneath area
    const fillD = points.length > 0
      ? `${d} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : "";

    return (
      <div className="svg-chart-container" style={{ position: "relative" }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Horizontal Gridlines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} className="svg-chart-grid" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} className="svg-chart-grid" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="svg-chart-grid" />

          {/* Area Fill */}
          {fillD && <path d={fillD} className="svg-chart-fill" />}

          {/* Curve Line */}
          {d && <path d={d} className="svg-chart-line" />}

          {/* Interactive Circle points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint && hoveredPoint.x === p.x && hoveredPoint.y === p.y ? "6.5" : "4.5"}
                className="svg-chart-point"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Activity name on the bottom axis */}
              <text
                x={p.x}
                y={height - 4}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="8"
                fontWeight="700"
              >
                {p.activity.substring(0, 8)}..
              </text>
            </g>
          ))}
        </svg>

        {hoveredPoint && (
          <div
            className="chart-tooltip"
            style={{
              position: "absolute",
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
              opacity: 1,
              transform: "translate(-50%, -100%) translateY(-10px)",
              pointerEvents: "none"
            }}
          >
            <h4>{hoveredPoint.activity}</h4>
            <div className="tooltip-row">
              <span className="tooltip-label">Nota:</span>
              <span className="tooltip-value highlight-grade">{hoveredPoint.grade.toFixed(1)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Peso:</span>
              <span className="tooltip-value">{hoveredPoint.percentage}%</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Fecha:</span>
              <span className="tooltip-value">{hoveredPoint.date}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container student-theme">
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
          <BookOpenCheck size={26} className="brand-icon-student" />
          <div className="brand-text">
            <h2>EduPerformance</h2>
            <span>Portal Estudiantes</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar-wrapper">
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
              alt={currentUser.nombre}
              className="user-avatar"
            />
            <div className="status-indicator online"></div>
          </div>
          <div className="user-details">
            <h3>{currentUser.nombre}</h3>
            <span className="user-code">{student.codigo}</span>
            <span className="user-tag">Semestre {student.semestre}</span>
          </div>
        </div>

        {/* MEDIDOR RADIAL INSTITUCIONAL (Inspirado en el 13% del Mockup) */}
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
            <span className="sidebar-stat-val">{studentCourses.length}</span>
            <span className="sidebar-stat-lbl">Materias</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`nav-item ${activeTab === "resumen" ? "active" : ""}`}
          >
            <TrendingUp size={18} />
            <span>Resumen General</span>
          </button>
          <button
            onClick={() => setActiveTab("cursos")}
            className={`nav-item ${activeTab === "cursos" ? "active" : ""}`}
          >
            <BookOpen size={18} />
            <span>Mis Cursos</span>
          </button>
          <button
            onClick={() => setActiveTab("notas")}
            className={`nav-item ${activeTab === "notas" ? "active" : ""}`}
          >
            <Award size={18} />
            <span>Calificaciones</span>
          </button>
          <button
            onClick={() => setActiveTab("asistencia")}
            className={`nav-item ${activeTab === "asistencia" ? "active" : ""}`}
          >
            <Calendar size={18} />
            <span>Mi Asistencia</span>
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
              Hola, {currentUser.nombre.split(" ")[0]}
              <Sparkles size={28} className="welcome-icon welcome-icon-student" />
            </h1>
            <p className="welcome-date">
              Panel Académico del Estudiante
              <span className={`connection-badge ${isOnline ? "online" : "offline"}`} style={{ marginLeft: "12px", fontSize: "0.75rem", padding: "3px 8px", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: "bold", background: isOnline ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: isOnline ? "#10b981" : "#ef4444", border: isOnline ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isOnline ? "#10b981" : "#ef4444", display: "inline-block" }}></span>
                {isOnline ? "En Línea" : "Sin Conexión"}
              </span>
            </p>
          </div>
          <div className="header-info-badge">
            <span className="carrera-badge">{student.carrera}</span>
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
                    <ProfileSkeleton />
                  </div>
                </>
              ) : (
              <>
              <div className="metrics-grid">
                {/* Promedio card with clean layout */}
                <div className="metric-card glass-panel">
                  <div className="metric-header">
                    <span className="metric-title">Desempeño Acumulado</span>
                    <span className="metric-icon-box grade-color">
                      <Award size={22} />
                    </span>
                  </div>
                  <div className="metric-value">{averageGrade}</div>
                  <div className="metric-footer">
                    <span className="metric-trend positive">Excelente Desempeño General</span>
                  </div>
                </div>

                {/* Asistencia linear progress card */}
                <div className="metric-card glass-panel">
                  <div className="metric-header">
                    <span className="metric-title">Asistencia Semestral</span>
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

                {/* Cursos card */}
                <div className="metric-card glass-panel">
                  <div className="metric-header">
                    <span className="metric-title">Cursos Matriculados</span>
                    <span className="metric-icon-box courses-color">
                      <BookOpen size={22} />
                    </span>
                  </div>
                  <div className="metric-value">{studentCourses.length}</div>
                  <div className="metric-footer">
                    <span className="metric-trend">Materias Activas en Semestre</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-double-columns">
                {/* SVG Curve Line Chart (Visual de Alto Impacto) */}
                <div className="dashboard-column glass-panel">
                  <h3>Evolución de Calificaciones</h3>
                  {renderGradesChart()}
                </div>

                {/* Contact details refined */}
                <div className="dashboard-column glass-panel">
                  <h3>Detalles del Estudiante</h3>
                  <div className="profile-quick-details">
                    <div className="detail-row">
                      <div className="detail-row-icon-box">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="label">Dirección</span>
                        <p>{profile.direccion || "No registrada"}</p>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-row-icon-box">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="label">Teléfono</span>
                        <p>{profile.telefono || "No registrado"}</p>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-row-icon-box">
                        <User size={18} />
                      </div>
                      <div>
                        <span className="label">Biografía institucional</span>
                        <p className="bio-paragraph">{profile.biografia || "Agrega una biografía en tu perfil académico."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </>
              )}
            </div>
          )}

          {/* TAB 2: MY COURSES */}
          {activeTab === "cursos" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <div className="courses-grid">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : (
              <div className="courses-grid">
                {studentCourses.length === 0 ? (
                  <p className="empty-state-full col-span-3">No estás matriculado en ningún curso.</p>
                ) : (
                  studentCourses.map((c) => {
                    const profUser = db.users.find((u) => u.id === db.teachers.find((t) => t.id === c.profesorId)?.usuarioId);
                    return (
                      <div key={c.id} className="course-card glass-panel">
                        <div className="course-card-header">
                          <span className="course-code-badge">{c.codigo}</span>
                        </div>
                        <h3>{c.nombre}</h3>
                        <p className="course-desc">{c.descripcion}</p>
                        <div className="course-card-meta">
                          <div className="meta-teacher">
                            <strong>Docente:</strong>
                            <span>{profUser?.nombre || "Docente Asignado"}</span>
                          </div>
                          <div className="meta-schedule">
                            <strong>Horario:</strong>
                            <span>{c.horario}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              )}
            </div>
          )}

          {/* TAB 3: GRADES */}
          {activeTab === "notas" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : (
              <div className="glass-panel overflow-hidden-x">
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Materia</th>
                        <th>Actividad Evaluada</th>
                        <th>Fecha Registro</th>
                        <th>Porcentaje (Peso)</th>
                        <th>Nota</th>
                        <th>Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentGrades.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8">
                            No tienes calificaciones registradas.
                          </td>
                        </tr>
                      ) : (
                        studentGrades.map((g) => {
                          const curso = db.courses.find((c) => c.id === g.cursoId);
                          return (
                            <tr key={g.id}>
                              <td>
                                <strong>{curso?.nombre}</strong>
                               <span className="sub-text block">{curso?.codigo}</span>
                              </td>
                              <td>{g.actividad}</td>
                              <td>{g.fecha}</td>
                              <td>{g.porcentaje}%</td>
                              <td>
                                <span className={`grade-tag ${g.nota >= 4.0 ? "high" : g.nota >= 3.0 ? "medium" : "low"}`}>
                                  {g.nota.toFixed(1)}
                                </span>
                              </td>
                              <td className="observation-cell">{g.observacion || "Sin observaciones registradas"}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === "asistencia" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <>
                  <div className="metrics-grid">
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                  <TableSkeleton rows={4} cols={4} />
                </>
              ) : (
              <>
              <div className="metrics-grid">
                <div className="metric-card glass-panel">
                  <h3>Estados de Asistencia</h3>
                  <div className="attendance-states-summary">
                    <div className="state-row text-success">
                      <CheckCircle2 size={20} />
                      <span>Clases Asistidas</span>
                      <strong>{presentsCount}</strong>
                    </div>
                    <div className="state-row text-warning">
                      <Clock size={20} />
                      <span>Llegadas con Retraso</span>
                      <strong>{tardesCount}</strong>
                    </div>
                    <div className="state-row text-info">
                      <HelpCircle size={20} />
                      <span>Excusas Médicas/Académicas</span>
                      <strong>{excusasCount}</strong>
                    </div>
                    <div className="state-row text-danger">
                      <XCircle size={20} />
                      <span>Faltas Injustificadas</span>
                      <strong>{totalClasses - presentsCount - tardesCount - excusasCount}</strong>
                    </div>
                  </div>
                </div>

                <div className="metric-card glass-panel">
                  <h3>Porcentaje de Asistencia</h3>
                  <div className="linear-progress-item mt-4">
                    <div className="linear-progress-label-row">
                      <span>Asistencia Promedio</span>
                      <span>{attendanceRate}%</span>
                    </div>
                    <div className="linear-progress-track">
                      <div className="linear-progress-bar" style={{ width: `${attendanceRate}%` }}></div>
                    </div>
                  </div>
                  <div className="info-warning-banner mt-6" style={{ margin: 0 }}>
                    <Info size={16} />
                    <span>Requiere mínimo 80% para aprobación automática del semestre académico.</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel mt-6">
                <h3>Mapa de Asistencia Semanal</h3>
                <div className="heatmap-container">
                  <div className="heatmap-grid">
                    {Array.from({ length: 28 }).map((_, idx) => {
                      const record = studentAttendances[idx];
                      if (record) {
                        const curso = db.courses.find((c) => c.id === record.cursoId);
                        return (
                          <div
                            key={record.id}
                            className={`heatmap-cell ${record.estado.toLowerCase()}`}
                            title={`Fecha: ${record.fecha} | Curso: ${curso?.nombre || "N/A"} | Estado: ${record.estado}`}
                          />
                        );
                      } else {
                        return (
                          <div
                            key={`empty-${idx}`}
                            className="heatmap-cell vacio"
                            title="Sin registro de clase"
                          />
                        );
                      }
                    })}
                  </div>
                  <div className="heatmap-legend">
                    <div className="heatmap-legend-item">
                      <div className="heatmap-legend-color vacio"></div>
                      <span>Sin clase</span>
                    </div>
                    <div className="heatmap-legend-item">
                      <div className="heatmap-legend-color presente"></div>
                      <span>Presente</span>
                    </div>
                    <div className="heatmap-legend-item">
                      <div className="heatmap-legend-color tarde"></div>
                      <span>Tarde</span>
                    </div>
                    <div className="heatmap-legend-item">
                      <div className="heatmap-legend-color excusa"></div>
                      <span>Excusa</span>
                    </div>
                    <div className="heatmap-legend-item">
                      <div className="heatmap-legend-color ausente"></div>
                      <span>Ausente</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel mt-6">
                <h3>Historial de Asistencia Detallado</h3>
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Fecha Sesión</th>
                        <th>Asignatura</th>
                        <th>Código Materia</th>
                        <th>Estado de Asistencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentAttendances.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-8">
                            No se han tomado registros de asistencia en el periodo.
                          </td>
                        </tr>
                      ) : (
                        studentAttendances.map((a) => {
                          const curso = db.courses.find((c) => c.id === a.cursoId);
                          return (
                            <tr key={a.id}>
                              <td>{a.fecha}</td>
                              <td><strong>{curso?.nombre}</strong></td>
                              <td>{curso?.codigo}</td>
                              <td>
                                <span className={`attendance-badge ${a.estado.toLowerCase()}`}>
                                  {a.estado === "Presente" && <CheckCircle2 size={14} />}
                                  {a.estado === "Ausente" && <XCircle size={14} />}
                                  {a.estado === "Tarde" && <Clock size={14} />}
                                  {a.estado === "Excusa" && <HelpCircle size={14} />}
                                  {a.estado}
                                </span>
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

        </div>
      </main>
    </div>
  );
}
