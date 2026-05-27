import { useState, useEffect } from "react";
import { CardSkeleton, TableSkeleton } from "@/components/ui/Skeletons";
import { useApp } from "@/components/AppContext";
import {
  LogOut,
  User,
  Shield,
  Activity,
  Users,
  Server,
  Save,
  Briefcase,
  Search,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sliders,
  Database,
  Plus,
  Edit2,
  Mail,
  Hash,
  Info,
  Phone,
  MapPin
} from "lucide-react";

export default function AdminDashboard() {
  const {
    db,
    currentUser,
    logout,
    getUserProfile,
    addUser,
    updateUser,
    deleteUser,
    isOnline
  } = useApp();

  const profile = getUserProfile(currentUser.id) || {
    telefono: "+57 301 777 8899",
    direccion: "Calle 100 # 15-22, Medellín",
    biografia: "Rectora Institucional. Responsable de la planeación y la gestión estratégica para el aseguramiento de la calidad académica en CESDE."
  };

  const [activeTab, setActiveTab] = useState("resumen");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // --- USER CRUD STATES ---
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [edad, setEdad] = useState("20");
  const [role, setRole] = useState("estudiante");
  const [telefonoForm, setTelefonoForm] = useState("");
  const [direccionForm, setDireccionForm] = useState("");
  const [biografiaForm, setBiografiaForm] = useState("");
  const [avatarUrlForm, setAvatarUrlForm] = useState("");
  
  // Student specifics
  const [carrera, setCarrera] = useState("");
  const [semestre, setSemestre] = useState("1");
  
  // Teacher specifics
  const [departamento, setDepartamento] = useState("");
  const [especialidad, setEspecialidad] = useState("");

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // --- SERVER ACTION STATES ---
  const [rebooting, setRebooting] = useState(false);
  const [rebootProgress, setRebootProgress] = useState(0);
  const [rebootSuccess, setRebootSuccess] = useState(false);
  const [serverConsoleLogs, setServerConsoleLogs] = useState([
    "INFO [2026-05-20 22:38] DB: Conexión establecida de forma segura.",
    "INFO [2026-05-20 22:38] Auth: Listo para procesar solicitudes de login.",
    "INFO [2026-05-20 22:38] SysMonitor: CPU al 14%, Memoria al 42%.",
    "WARN [2026-05-20 22:39] API: Solicitud entrante con latencia ligeramente elevada."
  ]);

  const [currentSemester, setCurrentSemester] = useState("2026-I");
  const [gradesLocked, setGradesLocked] = useState(false);
  const [closingDate, setClosingDate] = useState("2026-06-30");
  const [backupSuccessMessage, setBackupSuccessMessage] = useState("");

  const handleDownloadBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `eduperformance_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      setBackupSuccessMessage("Copia de seguridad descargada exitosamente en formato JSON.");
      setTimeout(() => setBackupSuccessMessage(""), 4000);
      
      setServerConsoleLogs(prev => [
        ...prev.slice(-8),
        `INFO [${new Date().toLocaleTimeString()}] Soporte: Copia de seguridad exportada y guardada en local.`
      ]);
    } catch (err) {
      alert("Error al generar copia de seguridad: " + err.message);
    }
  };

  const handleResetDatabase = () => {
    if (window.confirm("¿ATENCIÓN: Estás seguro de que deseas restablecer la base de datos a los valores de fábrica? Se borrarán todos los cambios locales realizados.")) {
      localStorage.removeItem("edu_db_state");
      alert("La base de datos ha sido restablecida. La aplicación se recargará automáticamente para aplicar la semilla original.");
      window.location.reload();
    }
  };

  // Simulate loading on mount and tab change
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Server console logs updater
  useEffect(() => {
    if (activeTab !== "ajustes") return;
    const interval = setInterval(() => {
      const types = ["SYSTEM", "INFO", "WARN"];
      const messages = [
        "DB: Transacciones confirmadas con éxito en base de datos central.",
        "Auth: Inicio de sesión exitoso en el Portal Docente.",
        "Académico: Docente Carlos Mendoza subió notas parciales para Desarrollo Web Frontend.",
        "Soporte: Copia de seguridad exportada y guardada en local.",
        "Académico: Estudiante Ana Silva ingresó a consultar su promedio académico.",
        "Académico: Cierre temporal de carga de inasistencias completado.",
        "Sistema: Regeneración periódica de tokens de sesión completada."
      ];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const time = new Date().toLocaleTimeString();
      setServerConsoleLogs((prev) => [
        ...prev.slice(-8),
        `${randomType} [${time}] ${randomMsg}`
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleOpenUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      const userProfile = getUserProfile(user.id) || {};
      
      const nameParts = user.nombre.split(" ");
      setNombre(nameParts[0] || "");
      setApellido(nameParts.slice(1).join(" ") || "");
      
      setEmail(user.email || "");
      setPassword(user.password || "password123");
      setEdad(user.edad ? user.edad.toString() : "20");
      setRole(user.role || "estudiante");
      setTelefonoForm(userProfile.telefono || "");
      setDireccionForm(userProfile.direccion || "");
      setBiografiaForm(userProfile.biografia || "");
      setAvatarUrlForm(userProfile.avatarUrl || "");
      
      if (user.role === "estudiante") {
        const student = db.students.find(s => s.usuarioId === user.id) || {};
        setCarrera(student.carrera || "");
        setSemestre(student.semestre ? student.semestre.toString() : "1");
        setDepartamento("");
        setEspecialidad("");
      } else if (user.role === "profesor") {
        const teacher = db.teachers.find(t => t.usuarioId === user.id) || {};
        setDepartamento(teacher.departamento || "");
        setEspecialidad(teacher.especialidad || "");
        setCarrera("");
        setSemestre("1");
      }
    } else {
      setEditingUser(null);
      setNombre("");
      setApellido("");
      setEmail("");
      setPassword("password123");
      setEdad("20");
      setRole("estudiante");
      setTelefonoForm("");
      setDireccionForm("");
      setBiografiaForm("");
      setAvatarUrlForm("");
      setCarrera("");
      setSemestre("1");
      setDepartamento("");
      setEspecialidad("");
    }
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      showToast("Por favor complete los campos obligatorios.", "error");
      return;
    }

    const userData = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      edad: parseInt(edad, 10),
      role: role
    };

    const profileData = {
      telefono: telefonoForm.trim(),
      direccion: direccionForm.trim(),
      biografia: biografiaForm.trim(),
      avatarUrl: avatarUrlForm.trim() || `https://images.unsplash.com/photo-${role === "estudiante" ? "1494790108377-be9c29b29330" : "1507003211169-0a1dd7228f2d"}?w=150`
    };

    const roleSpecificData = role === "estudiante" 
      ? { carrera: carrera.trim(), semestre: parseInt(semestre, 10) }
      : { departamento: departamento.trim(), especialidad: especialidad.trim() };

    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData, profileData, roleSpecificData);
        showToast("Usuario actualizado con éxito.");
      } else {
        await addUser(userData, profileData, roleSpecificData);
        showToast("Usuario creado con éxito.");
      }
      setUserModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Ocurrió un error al guardar el usuario.", "error");
    }
  };

  const handleDeleteUserClick = (userId) => {
    const user = db.users.find(u => u.id === userId);
    if (!user) return;
    if (user.role === "administrativo") {
      showToast("No se puede eliminar la cuenta del administrador principal.", "error");
      return;
    }
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${user.nombre}? Esta acción es irreversible e impactará sus calificaciones y asistencias.`)) {
      try {
        deleteUser(userId);
        showToast("Usuario eliminado correctamente.");
      } catch (err) {
        console.error(err);
        showToast("Error al eliminar el usuario.", "error");
      }
    }
  };

  const handleServerReboot = () => {
    if (rebooting) return;
    setRebooting(true);
    setRebootProgress(0);
    setRebootSuccess(false);

    const logTime = new Date().toLocaleTimeString();
    setServerConsoleLogs((prev) => [
      ...prev,
      `SYSTEM [${logTime}] REBOOT SIGNAL INITIATED BY ADMIN Sofía Altamirano.`
    ]);

    const interval = setInterval(() => {
      setRebootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setRebooting(false);
          setRebootSuccess(true);
          const endLogTime = new Date().toLocaleTimeString();
          setServerConsoleLogs((p) => [
            ...p,
            `SYSTEM [${endLogTime}] REBOOT COMPLETED. All services online.`
          ]);
          setTimeout(() => setRebootSuccess(false), 4000);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  // --- STATS ---
  const totalStudents = db.users.filter(u => u.role === "estudiante").length;
  const totalTeachers = db.users.filter(u => u.role === "profesor").length;
  const totalCourses = db.courses.length;
  
  // Calculate average of all system grades
  const allGrades = db.grades;
  const globalAverage = allGrades.length > 0
    ? (allGrades.reduce((sum, g) => sum + g.nota, 0) / allGrades.length).toFixed(2)
    : "4.15";

  // License capacity radial gauge config
  const capacityRate = 83; // 83% of licenses used
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (capacityRate / 100) * circumference;

  // --- SVG ANALYTICS CHART FOR INSTITUTION ---
  const facultyPerformanceData = [
    { name: "Ingenierías", avg: 4.35, code: "ING" },
    { name: "Ciencias Sociales", avg: 4.10, code: "CS" },
    { name: "Bellas Artes", avg: 3.90, code: "BA" },
    { name: "Administración", avg: 4.25, code: "ADM" }
  ];

  const renderFacultyChart = () => {
    const width = 460;
    const height = 140;
    const paddingX = 40;
    const paddingY = 20;

    const points = facultyPerformanceData.map((f, index) => {
      const x = paddingX + (index / (facultyPerformanceData.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (f.avg / 5.0) * (height - paddingY * 2);
      return { x, y, code: f.code, avg: f.avg };
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
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} className="svg-chart-grid" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} className="svg-chart-grid" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="svg-chart-grid" />

          {fillD && <path d={fillD} className="svg-chart-fill" />}
          {d && <path d={d} className="svg-chart-line" />}

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
                {p.avg.toFixed(2)}
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

  // Filter users list based on search query
  const filteredUsers = db.users.filter(u => {
    return (
      u.nombre.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="dashboard-container admin-theme">
      {/* Background Glows (Glassmorphic Dark Neon Theme) */}
      <div className="dashboard-glow-container" aria-hidden="true">
        <div className="glow-sphere glow-primary"></div>
        <div className="glow-sphere glow-secondary"></div>
        <div className="glow-sphere glow-tertiary"></div>
        <div className="dashboard-grid-pattern"></div>
      </div>

      {/* Definición global de gradientes SVG */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Sidebar navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Shield size={26} className="brand-icon-admin" />
          <div className="brand-text">
            <h2>EduPerformance</h2>
            <span>Consola Administrativa</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar-wrapper">
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}
              alt={currentUser.nombre}
              className="user-avatar"
            />
            <div className="status-indicator online"></div>
          </div>
          <div className="user-details">
            <h3>{currentUser.nombre}</h3>
            <span className="user-code">DIR-2026-CESDE</span>
            <span className="user-tag">Rectora CESDE</span>
          </div>
        </div>

        {/* Capacity Radial Gauge */}
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
                stroke="url(#adminGrad)"
              />
            </svg>
            <div className="sidebar-radial-center-card">
              <span className="sidebar-radial-percentage">{capacityRate}%</span>
              <span className="sidebar-radial-label">Licencias Usadas</span>
            </div>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="sidebar-stats-grid">
          <div className="sidebar-stat-card">
            <span className="sidebar-stat-val">{totalStudents + totalTeachers}</span>
            <span className="sidebar-stat-lbl">Usuarios</span>
          </div>
          <div className="sidebar-stat-card">
            <span className="sidebar-stat-val">{totalCourses}</span>
            <span className="sidebar-stat-lbl">Asignaturas</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`nav-item ${activeTab === "resumen" ? "active" : ""}`}
          >
            <Activity size={18} />
            <span>Panel General</span>
          </button>
          <button
            onClick={() => setActiveTab("usuarios")}
            className={`nav-item ${activeTab === "usuarios" ? "active" : ""}`}
          >
            <Users size={18} />
            <span>Gestión de Usuarios</span>
          </button>
          <button
            onClick={() => setActiveTab("ajustes")}
            className={`nav-item ${activeTab === "ajustes" ? "active" : ""}`}
          >
            <Sliders size={18} />
            <span>Ajustes del Sistema</span>
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
              Consola Institucional
              <Shield size={28} className="welcome-icon welcome-icon-admin" />
            </h1>
            <p className="welcome-date">
              Sistema de Auditoría y Control de Plataforma
              <span className={`connection-badge ${isOnline ? "online" : "offline"}`} style={{ marginLeft: "12px", fontSize: "0.75rem", padding: "3px 8px", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: "bold", background: isOnline ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: isOnline ? "#10b981" : "#ef4444", border: isOnline ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isOnline ? "#10b981" : "#ef4444", display: "inline-block" }}></span>
                {isOnline ? "En Línea" : "Sin Conexión"}
              </span>
            </p>
          </div>
          <div className="header-info-badge">
            <span className="departamento-badge">Administración CESDE</span>
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
                        <span className="metric-title">Licencias Asignadas</span>
                        <span className="metric-icon-box courses-color">
                          <Sliders size={22} />
                        </span>
                      </div>
                      <div className="metric-value">{capacityRate}%</div>
                      <div className="metric-footer">
                        <div className="linear-progress-track" style={{ height: "6px" }}>
                          <div
                            className="linear-progress-bar"
                            style={{
                              width: `${capacityRate}%`,
                              background: "linear-gradient(90deg, #8b5cf6, #ec4899)"
                            }}
                          ></div>
                        </div>
                        <span className="metric-trend" style={{ fontSize: "0.75rem", marginTop: "8px", display: "block" }}>
                          12,450 de 15,000 licencias activas
                        </span>
                      </div>
                    </div>

                    <div className="metric-card glass-panel">
                      <div className="metric-header">
                        <span className="metric-title">Promedio Académico CESDE</span>
                        <span className="metric-icon-box grade-color">
                          <Users size={22} style={{ color: "#ffd166" }} />
                        </span>
                      </div>
                      <div className="metric-value">{globalAverage}</div>
                      <div className="metric-footer">
                        <span className="metric-trend positive">★ Nivel Institucional Excelente</span>
                      </div>
                    </div>

                    <div className="metric-card glass-panel">
                      <div className="metric-header">
                        <span className="metric-title">Servidores Cloud</span>
                        <span className="metric-icon-box" style={{ background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.25)", color: "#4ade80" }}>
                          <Server size={22} />
                        </span>
                      </div>
                      <div className="metric-value">100%</div>
                      <div className="metric-footer" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="sync-pulse" style={{ display: "inline-block", position: "static", width: "8px", height: "8px" }}></span>
                        <span style={{ color: "#4ade80" }}>Todos los servicios estables</span>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-double-columns mt-6">
                    <div className="dashboard-column glass-panel">
                      <h3>Rendimiento Académico por Facultad</h3>
                      {renderFacultyChart()}
                    </div>

                    <div className="dashboard-column glass-panel">
                      <h3>Distribución de Usuarios Activos</h3>
                      <div className="simple-list mt-4">
                        <div className="recent-item">
                          <div className="recent-item-info">
                            <h4>Estudiantes Registrados</h4>
                            <p>Acceso activo al portal de alumnos</p>
                          </div>
                          <span className="recent-item-badge high" style={{ background: "rgba(139, 92, 246, 0.12)", borderColor: "rgba(139, 92, 246, 0.25)", color: "#c084fc" }}>
                            {totalStudents} Est.
                          </span>
                        </div>

                        <div className="recent-item">
                          <div className="recent-item-info">
                            <h4>Cuerpo Docente Activo</h4>
                            <p>Profesores con cursos a cargo</p>
                          </div>
                          <span className="recent-item-badge high" style={{ background: "rgba(236, 72, 153, 0.12)", borderColor: "rgba(236, 72, 153, 0.25)", color: "#f472b6" }}>
                            {totalTeachers} Doc.
                          </span>
                        </div>

                        <div className="recent-item">
                          <div className="recent-item-info">
                            <h4>Asignaturas Programadas</h4>
                            <p>En el periodo académico actual</p>
                          </div>
                          <span className="recent-item-badge medium">
                            {totalCourses} Cursos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === "usuarios" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <TableSkeleton rows={5} cols={5} />
              ) : (
                <>
                  <div className="tab-actions-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Consola de Gestión de Cuentas</h3>
                      <p className="sub-text" style={{ margin: "4px 0 0 0" }}>Crea, edita, audita o elimina los perfiles académicos de la institución.</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                      <div className="search-filter-shell" style={{ width: "240px", position: "relative", margin: 0 }}>
                        <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255, 255, 255, 0.4)" }} />
                        <input
                          type="text"
                          placeholder="Buscar por nombre, correo..."
                          className="input-shell"
                          style={{ paddingLeft: "38px", width: "100%", height: "40px" }}
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                      </div>
                      <button
                        className="premium-btn action-add-btn"
                        onClick={() => handleOpenUserModal(null)}
                        style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", borderColor: "#a78bfa", height: "40px", display: "inline-flex", alignItems: "center", gap: "8px", margin: 0 }}
                      >
                        <Plus size={18} />
                        <span>Agregar Perfil</span>
                      </button>
                    </div>
                  </div>

                  <div className="glass-panel overflow-hidden-x">
                    <div className="table-responsive">
                      <table className="premium-table">
                        <thead>
                          <tr>
                            <th>Usuario / Perfil</th>
                            <th>Contacto</th>
                            <th>Rol / Cargo</th>
                            <th>Detalle Académico</th>
                            <th style={{ textAlign: "right" }}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-8">
                                No se encontraron usuarios con ese criterio.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((u) => {
                              const uProfile = getUserProfile(u.id) || {};
                              const isStudent = u.role === "estudiante";
                              const isTeacher = u.role === "profesor";
                              const isAdmin = u.role === "administrativo";
                              
                              let code = "N/A";
                              let detailText = "Administración y Auditoría";
                              
                              if (isStudent) {
                                const stud = db.students.find(s => s.usuarioId === u.id) || {};
                                code = stud.codigo || `EST-2026-00${u.id}`;
                                detailText = `${stud.carrera || "Ingeniería de Sistemas"} (Sem. ${stud.semestre || 1})`;
                              } else if (isTeacher) {
                                const teach = db.teachers.find(t => t.usuarioId === u.id) || {};
                                code = teach.codigo || `DOC-2026-00${u.id}`;
                                detailText = `${teach.departamento || "Sistemas"} (${teach.especialidad || "Frontend"})`;
                              } else if (isAdmin) {
                                code = "DIR-2026-CESDE";
                                detailText = "Dirección y Calidad CESDE";
                              }

                              return (
                                <tr key={u.id}>
                                  <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                      <img
                                        src={uProfile.avatarUrl || `https://images.unsplash.com/photo-${u.id % 2 === 0 ? "1544005313-94ddf0286df2" : "1534528741775-53994a69daeb"}?w=150`}
                                        alt={u.nombre}
                                        style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.15)" }}
                                      />
                                      <div>
                                        <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>{u.nombre}</div>
                                        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                          <span>{code}</span>
                                          <span>|</span>
                                          <span>{u.email}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: "0.85rem" }}>{uProfile.telefono || "Sin teléfono"}</div>
                                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{uProfile.direccion || "Sin dirección"}</div>
                                  </td>
                                  <td>
                                    <span
                                      className={`recent-item-badge ${
                                        isTeacher
                                          ? "medium"
                                          : isAdmin
                                          ? "high"
                                          : "low"
                                      }`}
                                      style={
                                        isAdmin
                                          ? { background: "rgba(139, 92, 246, 0.12)", borderColor: "rgba(139, 92, 246, 0.25)", color: "#c084fc", textShadow: "0 0 10px rgba(139, 92, 246, 0.4)" }
                                          : isTeacher
                                          ? { background: "rgba(236, 72, 153, 0.12)", borderColor: "rgba(236, 72, 153, 0.25)", color: "#f472b6", textShadow: "0 0 10px rgba(236, 72, 153, 0.4)" }
                                          : { background: "rgba(6, 182, 212, 0.12)", borderColor: "rgba(6, 182, 212, 0.25)", color: "#22d3ee", textShadow: "0 0 10px rgba(6, 182, 212, 0.4)" }
                                      }
                                    >
                                      {u.role.toUpperCase()}
                                    </span>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>{detailText}</div>
                                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>Pass: {u.password}</div>
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {isAdmin ? (
                                      <span className="badge-desc" style={{ color: "#a78bfa", fontWeight: 700, fontSize: "0.75rem", background: "rgba(167, 139, 250, 0.1)", padding: "4px 8px", borderRadius: "12px", border: "1px solid rgba(167, 139, 250, 0.2)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                        <Shield size={12} />
                                        Protegido
                                      </span>
                                    ) : (
                                      <div style={{ display: "inline-flex", gap: "8px" }}>
                                        <button
                                          className="action-btn-edit"
                                          onClick={() => handleOpenUserModal(u)}
                                          title="Editar Perfil"
                                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "#38bdf8", padding: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", transition: "all 0.2s" }}
                                        >
                                          <Edit2 size={14} />
                                        </button>
                                        <button
                                          className="action-btn-delete"
                                          onClick={() => handleDeleteUserClick(u.id)}
                                          title="Eliminar Perfil"
                                          style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "6px", color: "#f87171", padding: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", transition: "all 0.2s" }}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    )}
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

          {/* TAB 3: ADJUSTMENTS & SETTINGS */}
          {activeTab === "ajustes" && (
            <div className="tab-pane fadeIn">
              {isLoading ? (
                <div className="courses-grid">
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : (
                <div className="dashboard-double-columns">
                  {/* Console Logs & Database backups */}
                  <div className="dashboard-column glass-panel">
                    <h3>Auditoría y Respaldos del Sistema</h3>
                    <p className="sub-text mt-2">
                      Registro de auditoría institucional y herramientas de salvaguarda de información para base de datos.
                    </p>

                    {/* Console Terminal */}
                    <h4 className="section-title mt-4" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: "bold" }}>Registro de Auditoría en Vivo</h4>
                    <div
                      style={{
                        background: "rgba(2, 6, 12, 0.8)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        padding: "16px",
                        fontFamily: "monospace",
                        fontSize: "0.82rem",
                        height: "220px",
                        overflowY: "auto",
                        color: "#a7f3d0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        marginTop: "8px"
                      }}
                    >
                      {serverConsoleLogs.map((log, idx) => (
                        <div key={idx} style={{ lineBreak: "anywhere" }}>
                          <span style={{ color: log.includes("WARN") ? "#fcd34d" : log.includes("SYSTEM") ? "#a78bfa" : "#34d399", fontWeight: "bold" }}>
                            {log.split(" ")[0]}
                          </span>
                          {log.slice(log.indexOf(" "))}
                        </div>
                      ))}
                    </div>

                    {/* Backups Panel */}
                    <h4 className="section-title mt-6" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: "bold" }}>Copias de Seguridad</h4>
                    {backupSuccessMessage && (
                      <div className="form-success-banner mt-2" style={{ marginBottom: "12px" }}>
                        <CheckCircle2 size={16} />
                        <span style={{ fontSize: "0.8rem" }}>{backupSuccessMessage}</span>
                      </div>
                    )}
                    <div className="flex gap-4 mt-2">
                      <button
                        type="button"
                        className="premium-btn"
                        onClick={handleDownloadBackup}
                        style={{ flex: 1, justifyContent: "center", gap: "8px", background: "rgba(139, 92, 246, 0.12)", border: "1px solid rgba(139, 92, 246, 0.3)", color: "#c084fc", height: "40px", fontSize: "0.82rem" }}
                      >
                        <Database size={16} />
                        <span>Exportar Base de Datos (JSON)</span>
                      </button>
                      <button
                        type="button"
                        className="premium-btn"
                        onClick={handleResetDatabase}
                        style={{ flex: 1, justifyContent: "center", gap: "8px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#f87171", height: "40px", fontSize: "0.82rem" }}
                      >
                        <RefreshCw size={16} />
                        <span>Restablecer Fábrica</span>
                      </button>
                    </div>
                  </div>

                  {/* Academic Period Settings & Details */}
                  <div className="dashboard-column glass-panel">
                    <h3>Configuración del Periodo Académico</h3>
                    <p className="sub-text mt-2">
                      Establezca las directrices de cierre y visibilidad para los reportes de calificaciones institucionales.
                    </p>

                    <form onSubmit={(e) => { e.preventDefault(); alert("Configuración del periodo académico guardada correctamente."); }} className="premium-form mt-4">
                      <div className="form-group">
                        <label htmlFor="sys-semester" style={{ fontSize: "0.8rem" }}>Semestre Académico Corriente</label>
                        <select
                          id="sys-semester"
                          value={currentSemester}
                          onChange={(e) => {
                            setCurrentSemester(e.target.value);
                            setServerConsoleLogs(prev => [
                              ...prev.slice(-8),
                              `SYSTEM [${new Date().toLocaleTimeString()}] Ajustes: Periodo académico actualizado a ${e.target.value}.`
                            ]);
                          }}
                          style={{ fontSize: "0.85rem", height: "40px", width: "100%", background: "rgba(0, 0, 0, 0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", padding: "0 10px" }}
                        >
                          <option value="2026-I">Semestre 2026 - I (Actual)</option>
                          <option value="2026-II">Semestre 2026 - II</option>
                          <option value="2027-I">Semestre 2027 - I</option>
                        </select>
                      </div>

                      <div className="form-group mt-4">
                        <label htmlFor="sys-closing-date" style={{ fontSize: "0.8rem" }}>Fecha Límite para Carga de Notas</label>
                        <input
                          type="date"
                          id="sys-closing-date"
                          value={closingDate}
                          onChange={(e) => setClosingDate(e.target.value)}
                          style={{ fontSize: "0.85rem", height: "40px" }}
                        />
                      </div>

                      <div className="form-group mt-6">
                        <label className="premium-toggle-label" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            className="premium-toggle-input"
                            checked={gradesLocked}
                            onChange={(e) => {
                              setGradesLocked(e.target.checked);
                              setServerConsoleLogs(prev => [
                                ...prev.slice(-8),
                                `WARN [${new Date().toLocaleTimeString()}] Seguridad: ${e.target.checked ? "Bloqueo central de modificación de notas ACTIVADO." : "Bloqueo central de notas DESACTIVADO."}`
                              ]);
                            }}
                          />
                          <span className="premium-toggle-switch"></span>
                          <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Bloquear modificación de notas central</span>
                        </label>
                        <p className="sub-text mt-1" style={{ fontSize: "0.72rem", paddingLeft: "42px" }}>
                          Impide a los docentes modificar calificaciones ya publicadas en el sistema.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="form-submit-btn mt-6"
                        style={{ height: "44px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", borderColor: "#c084fc", justifyContent: "center" }}
                      >
                        <Save size={18} />
                        <span>Aplicar Directivas del Periodo</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* --- ADAPTIVE USER MODAL (CREATION / EDITING) --- */}
        {userModalOpen && (
          <div className="modal-backdrop fadeIn" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(2, 6, 12, 0.8)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" }}>
            <div className="modal-content glass-panel bounceIn" style={{ width: "100%", maxWidth: "760px", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)", borderRadius: "12px", padding: "24px", position: "relative" }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {editingUser ? "Editar Perfil Institucional" : "Crear Nuevo Perfil Institucional"}
                </h2>
                <button
                  onClick={() => setUserModalOpen(false)}
                  style={{ background: "none", border: "none", color: "rgba(255, 255, 255, 0.5)", fontSize: "1.5rem", cursor: "pointer", padding: "4px" }}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="premium-form">
                {/* ROLE SWITCH */}
                {!editingUser && (
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label>Tipo de Perfil</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                      <button
                        type="button"
                        onClick={() => setRole("estudiante")}
                        className={`premium-btn ${role === "estudiante" ? "active" : ""}`}
                        style={{
                          height: "44px",
                          background: role === "estudiante" ? "rgba(6, 182, 212, 0.15)" : "rgba(255,255,255,0.03)",
                          borderColor: role === "estudiante" ? "#22d3ee" : "rgba(255,255,255,0.1)",
                          color: role === "estudiante" ? "#22d3ee" : "#ffffff",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          margin: 0
                        }}
                      >
                        <User size={16} />
                        <span>Estudiante</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("profesor")}
                        className={`premium-btn ${role === "profesor" ? "active" : ""}`}
                        style={{
                          height: "44px",
                          background: role === "profesor" ? "rgba(236, 72, 153, 0.15)" : "rgba(255,255,255,0.03)",
                          borderColor: role === "profesor" ? "#f472b6" : "rgba(255,255,255,0.1)",
                          color: role === "profesor" ? "#f472b6" : "#ffffff",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          margin: 0
                        }}
                      >
                        <Briefcase size={16} />
                        <span>Profesor</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* FIELDS GRID SECTION 1: CREDENTIALS */}
                <h3 style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "6px" }}>1. Credenciales y Datos de Usuario</h3>
                
                <div className="form-group-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group">
                    <label htmlFor="user-name">Nombre</label>
                    <div className="input-shell">
                      <User size={16} />
                      <input
                        type="text"
                        id="user-name"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Carlos"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="user-lastname">Apellido</label>
                    <div className="input-shell">
                      <User size={16} />
                      <input
                        type="text"
                        id="user-lastname"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        placeholder="Ej. Mendoza"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group">
                    <label htmlFor="user-email">Correo Electrónico</label>
                    <div className="input-shell">
                      <Mail size={16} />
                      <input
                        type="email"
                        id="user-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@edu.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="user-age">Edad</label>
                    <div className="input-shell">
                      <input
                        type="number"
                        id="user-age"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                        placeholder="22"
                        min="15"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label htmlFor="user-password">Contraseña {editingUser && "(Dejar igual para no cambiar)"}</label>
                  <div className="input-shell">
                    <input
                      type="text"
                      id="user-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password123"
                      required
                    />
                  </div>
                </div>

                {/* FIELDS GRID SECTION 2: CONTACT & PROFILE */}
                <h3 style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "6px" }}>2. Perfil e Información de Contacto</h3>
                
                <div className="form-group-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group">
                    <label htmlFor="user-phone">Teléfono de Contacto</label>
                    <div className="input-shell">
                      <Phone size={16} />
                      <input
                        type="text"
                        id="user-phone"
                        value={telefonoForm}
                        onChange={(e) => setTelefonoForm(e.target.value)}
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="user-address">Dirección Física</label>
                    <div className="input-shell">
                      <MapPin size={16} />
                      <input
                        type="text"
                        id="user-address"
                        value={direccionForm}
                        onChange={(e) => setDireccionForm(e.target.value)}
                        placeholder="Calle 10 # 20-30"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group">
                    <label htmlFor="user-avatar">URL de la Foto de Perfil (Avatar)</label>
                    <div className="input-shell">
                      <input
                        type="url"
                        id="user-avatar"
                        value={avatarUrlForm}
                        onChange={(e) => setAvatarUrlForm(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label htmlFor="user-bio">Biografía / Presentación Corta</label>
                  <textarea
                    id="user-bio"
                    value={biografiaForm}
                    onChange={(e) => setBiografiaForm(e.target.value)}
                    placeholder="Breve reseña sobre el usuario..."
                    rows="3"
                    style={{ background: "rgba(5, 11, 22, 0.42)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "10px", color: "white", outline: "none", width: "100%", resize: "vertical" }}
                  ></textarea>
                </div>

                {/* FIELDS GRID SECTION 3: ACADEMIC DETAILS */}
                <h3 style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "6px" }}>3. Datos Académicos Específicos ({role.toUpperCase()})</h3>
                
                {role === "estudiante" ? (
                  <div className="form-group-row fadeIn" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    <div className="form-group">
                      <label htmlFor="stud-career">Programa Académico / Carrera</label>
                      <div className="input-shell">
                        <input
                          type="text"
                          id="stud-career"
                          value={carrera}
                          onChange={(e) => setCarrera(e.target.value)}
                          placeholder="Ej. Ingeniería de Sistemas"
                          required={role === "estudiante"}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="stud-semester">Semestre</label>
                      <div className="input-shell">
                        <input
                          type="number"
                          id="stud-semester"
                          value={semestre}
                          onChange={(e) => setSemestre(e.target.value)}
                          min="1"
                          max="16"
                          required={role === "estudiante"}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="form-group-row fadeIn" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    <div className="form-group">
                      <label htmlFor="teach-dept">Departamento Académico</label>
                      <div className="input-shell">
                        <input
                          type="text"
                          id="teach-dept"
                          value={departamento}
                          onChange={(e) => setDepartamento(e.target.value)}
                          placeholder="Ej. Ciencias de la Computación"
                          required={role === "profesor"}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="teach-specialty">Especialidad Principal</label>
                      <div className="input-shell">
                        <input
                          type="text"
                          id="teach-specialty"
                          value={especialidad}
                          onChange={(e) => setEspecialidad(e.target.value)}
                          placeholder="Ej. Inteligencia Artificial y Cloud"
                          required={role === "profesor"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px", marginTop: "24px" }}>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setUserModalOpen(false)}
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", padding: "10px 20px", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="form-submit-btn"
                    style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", borderColor: "#a78bfa", border: "1px solid", borderRadius: "8px", color: "white", padding: "10px 24px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: "bold", transition: "all 0.2s" }}
                  >
                    <Save size={16} />
                    <span>{editingUser ? "Actualizar Perfil" : "Crear Perfil"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- PREMIUM TOAST FEEDBACK NOTIFICATION --- */}
        {toast.show && (
          <div
            className={`fadeIn`}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: toast.type === "success" ? "rgba(16, 185, 129, 0.16)" : "rgba(239, 68, 68, 0.16)",
              backdropFilter: "blur(12px)",
              border: toast.type === "success" ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "10px",
              padding: "14px 20px",
              color: toast.type === "success" ? "#a7f3d0" : "#fca5a5",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              zIndex: 1100,
              fontWeight: "600",
              fontSize: "0.9rem"
            }}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} style={{ color: "#34d399" }} /> : <Info size={18} style={{ color: "#f87171" }} />}
            <span>{toast.message}</span>
          </div>
        )}
      </main>
    </div>
  );
}
