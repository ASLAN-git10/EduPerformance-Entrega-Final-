import { useState, useEffect } from "react";
import { 
  BookOpenCheck, 
  ChartNoAxesCombined, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  ArrowRight,
  LayoutDashboard,
  Users,
  CheckCircle2,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Sparkles
} from "lucide-react";
import EduPerformanceLogo from "@/components/ui/EduPerformanceLogo";
import ScrollReveal from "@/components/ui/ScrollReveal";
import eduAnalytics from "@/assets/edu_analytics.png";
import eduHero from "@/assets/edu_hero.png";

// ==========================================
// INTERACTIVE TAB MOCKUPS FOR "CÓMO FUNCIONA"
// ==========================================

function StudentTabMockup() {
  const courses = [
    { name: "Ingeniería de Software II", grade: "4.8", comment: "Excelente entrega del sprint, buena arquitectura." },
    { name: "Cálculo Multivariable", grade: "4.2", comment: "Buen desempeño en el examen parcial de derivadas." },
    { name: "Física Mecánica II", grade: "3.9", comment: "Entregar taller de recuperación de cinemática." }
  ];

  return (
    <div className="tab-mockup student-tab-mockup">
      <div className="tab-mockup-header">
        <span className="tab-mockup-badge">CALIFICACIONES Y OBSERVACIONES</span>
        <h4>Periodo Académico: 2026-I</h4>
      </div>
      <div className="tab-mockup-list">
        {courses.map((course, idx) => (
          <div key={idx} className="tab-mockup-list-item course-row">
            <div className="course-info">
              <span className="course-name">{course.name}</span>
              <p className="course-comment">💬 "{course.comment}"</p>
            </div>
            <div className="course-grade-badge">
              <span className={`grade-val ${parseFloat(course.grade) >= 4.0 ? "high" : "med"}`}>
                {course.grade}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherTabMockup() {
  const [attendance, setAttendance] = useState([
    { id: 1, name: "Ana María Silva", status: "presente" },
    { id: 2, name: "Juan David Pérez", status: "presente" },
    { id: 3, name: "Mateo Restrepo", status: "falta" },
    { id: 4, name: "Laura Sofía Gómez", status: "presente" }
  ]);

  const toggleStatus = (id) => {
    setAttendance(prev => prev.map(student => {
      if (student.id === id) {
        return {
          ...student,
          status: student.status === "presente" ? "falta" : "presente"
        };
      }
      return student;
    }));
  };

  const presentCount = attendance.filter(s => s.status === "presente").length;
  const rate = Math.round((presentCount / attendance.length) * 100);

  return (
    <div className="tab-mockup teacher-tab-mockup">
      <div className="tab-mockup-header">
        <span className="tab-mockup-badge">PASE DE LISTA RÁPIDO</span>
        <h4>Grupo: Ingeniería de Software II</h4>
      </div>
      <div className="tab-mockup-metrics">
        <div className="tab-mockup-metric-item">
          <span className="metric-label">Asistencia Hoy</span>
          <span className="metric-val">{rate}%</span>
        </div>
        <div className="tab-mockup-metric-item">
          <span className="metric-label">Alumnos Presentes</span>
          <span className="metric-val">{presentCount}/{attendance.length}</span>
        </div>
      </div>
      <div className="tab-mockup-list">
        {attendance.map(student => (
          <div key={student.id} className="tab-mockup-list-item student-row">
            <span className="student-name">{student.name}</span>
            <div className="student-actions">
              <button 
                type="button" 
                className={`attendance-btn pres ${student.status === "presente" ? "active" : ""}`}
                onClick={() => toggleStatus(student.id)}
                title="Marcar Presente"
              >
                P
              </button>
              <button 
                type="button" 
                className={`attendance-btn abs ${student.status === "falta" ? "active" : ""}`}
                onClick={() => toggleStatus(student.id)}
                title="Marcar Falta"
              >
                F
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTabMockup() {
  const faculties = [
    { name: "Facultad de Ingeniería", score: "4.4", percentage: 88, color: "#8ef0db" },
    { name: "Facultad de Ciencias", score: "4.1", percentage: 82, color: "#ffd166" },
    { name: "Facultad de Artes", score: "4.5", percentage: 90, color: "#c084fc" }
  ];

  return (
    <div className="tab-mockup admin-tab-mockup">
      <div className="tab-mockup-header">
        <span className="tab-mockup-badge">DESEMPEÑO INSTITUCIONAL</span>
        <h4>Promedio General por Facultad</h4>
      </div>
      <div className="tab-mockup-faculties">
        {faculties.map((fac, idx) => (
          <div key={idx} className="faculty-row">
            <div className="faculty-info">
              <span className="faculty-name">{fac.name}</span>
              <span className="faculty-score">{fac.score} / 5.0</span>
            </div>
            <div className="faculty-bar-bg">
              <div 
                className="faculty-bar-fill" 
                style={{ 
                  width: `${fac.percentage}%`, 
                  background: fac.color,
                  boxShadow: `0 0 10px ${fac.color}33` 
                }} 
              />
            </div>
          </div>
        ))}
      </div>
      <div className="admin-status-footer">
        <div className="licence-info">
          <span>Licencias activas: <strong>12,450</strong> / 15,000</span>
        </div>
        <div className="sys-status">
          <div className="sys-pulse-dot" />
          <span>Servidor: 100% Ok</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onLoginClick }) {
  const [activeTab, setActiveTab] = useState("estudiante");
  const [scrolled, setScrolled] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const TABS_CONTENT = {
    estudiante: {
      title: "Monitorea tu avance en tiempo real",
      description: "Accede a un panel personalizado donde podrás seguir de cerca tu rendimiento académico, inasistencias y retroalimentaciones directas de tus profesores.",
      bullets: [
        "Visualización inmediata de calificaciones por periodo.",
        "Registro histórico de asistencia clase por clase.",
        "Comentarios constructivos y observaciones de docentes."
      ],
      buttonText: "Ingresar como Estudiante",
      image: eduAnalytics
    },
    profesor: {
      title: "Simplifica la gestión de tus clases",
      description: "Reduce el tiempo administrativo. Registra notas, controla la asistencia de tus alumnos y genera informes de rendimiento en pocos clics.",
      bullets: [
        "Calificación rápida con ponderaciones configurables.",
        "Toma de asistencia masiva en interfaz optimizada.",
        "Acceso instantáneo a perfiles y estadísticas de alumnos."
      ],
      buttonText: "Ingresar como Docente",
      image: eduHero
    },
    administrador: {
      title: "Toma decisiones basadas en datos reales",
      description: "Obtén una visión global del desempeño institucional. Supervisa estadísticas agregadas por materias, semestres o departamentos académicos.",
      bullets: [
        "Consola de administración de usuarios y docentes.",
        "Reportes de rendimiento institucional comparativos.",
        "Respaldos de información y configuraciones seguras."
      ],
      buttonText: "Ingresar al Portal General",
      image: eduAnalytics
    }
  };

  const TESTIMONIALS = [
    {
      name: "Ana María Silva",
      role: "Estudiante de Ingeniería",
      quote: "EduPerformance me ha permitido estar al tanto de mis notas y entregas en tiempo real. Ya no tengo que esperar a fin de semestre para saber cómo voy. ¡Visualmente es increíble!",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    },
    {
      name: "Prof. Carlos Mendoza",
      role: "Docente de Ingeniería de Software",
      quote: "Calificar los talleres y pasar asistencia era una tarea pesada. Con esta interfaz premium, lo hago en minutos. Las estadísticas me ayudan a apoyar a los estudiantes a tiempo.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      name: "Dra. Laura Gómez",
      role: "Directora de Departamento",
      quote: "La analítica de datos en tiempo real nos ha ayudado a identificar áreas críticas de rendimiento institucional y tomar medidas oportunas. Es una herramienta indispensable.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
    }
  ];

  return (
    <div className="home-page-container">
      {/* 1. Sticky Header */}
      <header className={`home-header ${scrolled ? "scrolled" : ""}`}>
        <div className="home-header-logo">
          <EduPerformanceLogo size={42} />
          <span>EduPerformance</span>
        </div>
        <nav className="home-navbar">
          <a href="#inicio" className="home-nav-link">Inicio</a>
          <a href="#caracteristicas" className="home-nav-link">Características</a>
          <a href="#como-funciona" className="home-nav-link">Cómo Funciona</a>
          <a href="#testimonios" className="home-nav-link">Testimonios</a>
        </nav>
        <button type="button" className="home-nav-btn" onClick={onLoginClick}>
          Ingresar
        </button>
      </header>

      {/* 2. Hero Section */}
      <section id="inicio" className="home-hero">
        {/* Atmosphere Background (CSS Grid and Glow Orbs) */}
        <div className="hero-atmosphere" aria-hidden="true">
          <div className="hero-grid-pattern" />
          <div className="hero-glow-orb orb-1" />
          <div className="hero-glow-orb orb-2" />
          <div className="hero-glow-orb orb-3" />
        </div>

        <div className="home-hero-layout">
          <div className="home-hero-text">
            <ScrollReveal delay={100} duration={800}>
              <span className="home-hero-eyebrow">
                <Sparkles size={14} style={{ color: "#ffd166", marginRight: "4px" }} />
                EduPerformance v2.4 • Inteligencia Educativa
              </span>
            </ScrollReveal>
            
            <ScrollReveal delay={200} duration={800}>
              <h1 className="home-hero-title">
                Gestión académica simplificada, analítica potente.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={300} duration={800}>
              <p className="home-hero-copy">
                Centraliza el seguimiento de notas, el control de asistencia y el rendimiento institucional en un entorno premium de alta fidelidad. Diseñado para potenciar el éxito educativo.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400} duration={800}>
              <div className="home-hero-actions">
                <button type="button" className="btn-primary" onClick={onLoginClick}>
                  Ingresar al Portal <ArrowRight size={18} />
                </button>
                <a href="#caracteristicas" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                  Conocer Beneficios
                </a>
              </div>
            </ScrollReveal>

            {/* Quick role-based login portals in the Hero section (UX improvement) */}
            <ScrollReveal delay={480} duration={800}>
              <div className="hero-quick-portals">
                <span className="quick-portals-label">Acceso directo por rol:</span>
                <div className="quick-portals-grid">
                  <button type="button" className="quick-portal-item" onClick={onLoginClick}>
                    <div className="portal-item-icon student-bg">
                      <GraduationCap size={16} />
                    </div>
                    <span>Estudiantes</span>
                  </button>
                  <button type="button" className="quick-portal-item" onClick={onLoginClick}>
                    <div className="portal-item-icon teacher-bg">
                      <Briefcase size={16} />
                    </div>
                    <span>Docentes</span>
                  </button>
                  <button type="button" className="quick-portal-item" onClick={onLoginClick}>
                    <div className="portal-item-icon admin-bg">
                      <ShieldCheck size={16} />
                    </div>
                    <span>Directivos</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={550} duration={800}>
              <div className="home-hero-stats">
                <div className="stat-item">
                  <span className="stat-val">99.8%</span>
                  <span className="stat-label">Disponibilidad</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">+10k</span>
                  <span className="stat-label">Usuarios Activos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">Tiempo Real</span>
                  <span className="stat-label">Reporte de Notas</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="home-hero-image-wrapper">
            <ScrollReveal delay={350} duration={1000}>
              {/* Beautiful, High-Fidelity HTML/CSS Glass Dashboard Mockup */}
              <div className="hero-dashboard-mockup">
                <div className="mock-dashboard">
                  {/* Dashboard Sidebar */}
                  <div className="mock-sidebar">
                    <div className="mock-sidebar-header">
                      <div className="mock-dot red" />
                      <div className="mock-dot yellow" />
                      <div className="mock-dot green" />
                    </div>
                    <ul className="mock-sidebar-menu">
                      <li className="active"><LayoutDashboard size={14} /></li>
                      <li><Users size={14} /></li>
                      <li><BookOpenCheck size={14} /></li>
                      <li><ChartNoAxesCombined size={14} /></li>
                      <li><ShieldCheck size={14} /></li>
                    </ul>
                  </div>

                  {/* Dashboard Main Content */}
                  <div className="mock-main">
                    {/* Header */}
                    <div className="mock-header">
                      <div className="mock-header-title">
                        <span className="mock-badge">VISTA GLOBAL</span>
                        <h3>Panel de Analítica</h3>
                      </div>
                      <div className="mock-sync">
                        <div className="sync-pulse" />
                        <span>Sincronizado</span>
                      </div>
                    </div>

                    {/* KPIs Grid */}
                    <div className="mock-kpis">
                      <div className="mock-kpi-card">
                        <span className="kpi-label">Promedio General</span>
                        <div className="kpi-value-row">
                          <span className="kpi-value">4.8</span>
                          <span className="kpi-trend positive">↑ 4.2%</span>
                        </div>
                        <div className="kpi-bar-bg"><div className="kpi-bar-fill progress-blue" style={{ width: '85%' }} /></div>
                      </div>

                      <div className="mock-kpi-card">
                        <span className="kpi-label">Asistencia Promedio</span>
                        <div className="kpi-value-row">
                          <span className="kpi-value">96.5%</span>
                          <span className="kpi-trend positive">↑ 1.8%</span>
                        </div>
                        <div className="kpi-bar-bg"><div className="kpi-bar-fill progress-teal" style={{ width: '96%' }} /></div>
                      </div>

                      <div className="mock-kpi-card active-alerts">
                        <span className="kpi-label">Alertas Académicas</span>
                        <div className="kpi-value-row">
                          <span className="kpi-value">0</span>
                          <span className="kpi-tag green">ÓPTIMO</span>
                        </div>
                        <div className="kpi-bar-bg"><div className="kpi-bar-fill progress-green" style={{ width: '100%' }} /></div>
                      </div>
                    </div>

                    {/* Analytics Chart */}
                    <div className="mock-chart-container">
                      <div className="chart-header">
                        <span>Rendimiento del Periodo (Promedio Mensual)</span>
                        <span className="chart-legend">
                          <span className="legend-dot current" /> Actual
                        </span>
                      </div>
                      <div className="chart-visualization">
                        {/* Dynamic SVG graph lines */}
                        <svg viewBox="0 0 320 100" className="svg-chart">
                          <defs>
                            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgba(80, 222, 198, 0.4)" />
                              <stop offset="100%" stopColor="rgba(80, 222, 198, 0)" />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="20" x2="320" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          <line x1="0" y1="50" x2="320" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          
                          {/* Area under curve */}
                          <path d="M 0 90 Q 40 70 80 50 T 160 30 T 240 45 T 320 20 L 320 100 L 0 100 Z" fill="url(#chartGlow)" />
                          
                          {/* Curve line */}
                          <path d="M 0 90 Q 40 70 80 50 T 160 30 T 240 45 T 320 20" fill="none" stroke="#8ef0db" strokeWidth="2.5" strokeLinecap="round" />
                          
                          {/* Interactive data points */}
                          <circle cx="80" cy="50" r="4.5" fill="#ffd166" stroke="#040812" strokeWidth="1.5" className="chart-node pulse-yellow" />
                          <circle cx="160" cy="30" r="4.5" fill="#8ef0db" stroke="#040812" strokeWidth="1.5" className="chart-node pulse-cyan" />
                          <circle cx="240" cy="45" r="4.5" fill="#ffd166" stroke="#040812" strokeWidth="1.5" className="chart-node pulse-yellow" />
                          <circle cx="320" cy="20" r="4.5" fill="#8ef0db" stroke="#040812" strokeWidth="1.5" className="chart-node pulse-cyan" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="floating-badge badge-1">
                  <div className="badge-icon"><Sparkles size={12} fill="#ffd166" stroke="#ffd166" /></div>
                  <div className="badge-text">
                    <span className="badge-title">Calificaciones en Vivo</span>
                    <span className="badge-desc">99% de inmediatez</span>
                  </div>
                </div>

                <div className="floating-badge badge-2">
                  <div className="badge-icon student-bg"><Users size={12} /></div>
                  <div className="badge-text">
                    <span className="badge-title">Docente del Mes</span>
                    <span className="badge-desc">Prof. Carlos Mendoza</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="caracteristicas" className="home-section">
        {/* Subtle section glow atmosphere */}
        <div className="section-atmosphere" aria-hidden="true">
          <div className="section-glow-orb orb-teal" />
          <div className="section-glow-orb orb-indigo" />
        </div>

        <div className="home-section-container">
          <div className="home-section-header">
            <ScrollReveal duration={800}>
              <p className="home-section-subtitle">Características Clave</p>
              <h2 className="home-section-title">Optimiza la Experiencia Educativa</h2>
            </ScrollReveal>
          </div>

          <div className="home-features-grid">
            {/* Card 1 */}
            <ScrollReveal delay={50}>
              <div className="home-feature-card card-teal">
                <div className="feature-card-icon">
                  <BookOpenCheck size={24} />
                </div>
                <h3 className="feature-card-title">Gestión de Calificaciones</h3>
                <p className="feature-card-desc">
                  Registro de notas parametrizable, cálculo ponderado automático y retroalimentación interactiva alumno-docente.
                </p>
                <a href="#como-funciona" className="feature-card-link">Saber más <ArrowRight size={14} /></a>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={150}>
              <div className="home-feature-card card-gold">
                <div className="feature-card-icon">
                  <Users size={24} />
                </div>
                <h3 className="feature-card-title">Control de Asistencia</h3>
                <p className="feature-card-desc">
                  Pase de lista simplificado con estadísticas integradas para detectar alertas de deserción escolar tempranas.
                </p>
                <a href="#como-funciona" className="feature-card-link">Saber más <ArrowRight size={14} /></a>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={250}>
              <div className="home-feature-card card-indigo">
                <div className="feature-card-icon">
                  <ChartNoAxesCombined size={24} />
                </div>
                <h3 className="feature-card-title">Analítica en Tiempo Real</h3>
                <p className="feature-card-desc">
                  Visualización de curvas de rendimiento, promedios grupales e históricos de desempeño de forma automática.
                </p>
                <a href="#como-funciona" className="feature-card-link">Saber más <ArrowRight size={14} /></a>
              </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal delay={100}>
              <div className="home-feature-card card-teal">
                <div className="feature-card-icon">
                  <GraduationCap size={24} />
                </div>
                <h3 className="feature-card-title">Portal del Estudiante</h3>
                <p className="feature-card-desc">
                  Entorno personalizado donde los alumnos consultan su progreso, notas finales, parciales y asistencia al instante.
                </p>
                <a href="#como-funciona" className="feature-card-link">Saber más <ArrowRight size={14} /></a>
              </div>
            </ScrollReveal>

            {/* Card 5 */}
            <ScrollReveal delay={200}>
              <div className="home-feature-card card-gold">
                <div className="feature-card-icon">
                  <Briefcase size={24} />
                </div>
                <h3 className="feature-card-title">Portal del Docente</h3>
                <p className="feature-card-desc">
                  Herramientas ágiles para administrar materias, estudiantes a cargo, programar evaluaciones y realizar tutorías virtuales.
                </p>
                <a href="#como-funciona" className="feature-card-link">Saber más <ArrowRight size={14} /></a>
              </div>
            </ScrollReveal>

            {/* Card 6 */}
            <ScrollReveal delay={300}>
              <div className="home-feature-card card-indigo">
                <div className="feature-card-icon">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="feature-card-title">Seguridad Avanzada</h3>
                <p className="feature-card-desc">
                  Resguardo cifrado de credenciales, autenticación robusta y cumplimiento con políticas de privacidad institucional.
                </p>
                <a href="#como-funciona" className="feature-card-link">Saber más <ArrowRight size={14} /></a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. Interactive How It Works Section */}
      <section id="como-funciona" className="home-section home-how-works">
        {/* Subtle section glow atmosphere */}
        <div className="section-atmosphere" aria-hidden="true">
          <div className="section-glow-orb orb-orange" />
        </div>

        <div className="home-section-container">
          <div className="home-section-header">
            <ScrollReveal duration={800}>
              <p className="home-section-subtitle">Flujo de Trabajo</p>
              <h2 className="home-section-title">¿Cómo Funciona la Plataforma?</h2>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={100} duration={800}>
            <div className="tabs-container">
              <button 
                type="button" 
                className={`tab-pill ${activeTab === "estudiante" ? "active" : ""}`}
                onClick={() => setActiveTab("estudiante")}
              >
                Portal Estudiante
              </button>
              <button 
                type="button" 
                className={`tab-pill ${activeTab === "profesor" ? "active" : ""}`}
                onClick={() => setActiveTab("profesor")}
              >
                Portal Docente
              </button>
              <button 
                type="button" 
                className={`tab-pill ${activeTab === "administrador" ? "active" : ""}`}
                onClick={() => setActiveTab("administrador")}
              >
                Portal Administrativo
              </button>
            </div>
          </ScrollReveal>

          <div className="how-works-split">
            <div className="how-works-image-wrapper">
              <ScrollReveal delay={200} duration={800}>
                <div className="how-works-dashboard-container">
                  {activeTab === "estudiante" && <StudentTabMockup />}
                  {activeTab === "profesor" && <TeacherTabMockup />}
                  {activeTab === "administrador" && <AdminTabMockup />}
                </div>
              </ScrollReveal>
            </div>
            
            <div className="how-works-content">
              <ScrollReveal delay={300} duration={800}>
                <h3 className="how-works-heading">{TABS_CONTENT[activeTab].title}</h3>
                <p className="how-works-p">{TABS_CONTENT[activeTab].description}</p>
                
                <div className="how-works-list">
                  {TABS_CONTENT[activeTab].bullets.map((bullet, idx) => (
                    <div key={idx} className="how-works-list-item">
                      <CheckCircle2 size={20} />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={onLoginClick}
                  style={{ width: 'fit-content' }}
                >
                  {TABS_CONTENT[activeTab].buttonText} <ArrowRight size={18} />
                </button>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section id="testimonios" className="home-section">
        {/* Subtle section glow atmosphere */}
        <div className="section-atmosphere" aria-hidden="true">
          <div className="section-glow-orb orb-teal" />
          <div className="section-glow-orb orb-indigo" />
        </div>

        <div className="home-section-container">
          <div className="home-section-header">
            <ScrollReveal duration={800}>
              <p className="home-section-subtitle">Opiniones</p>
              <h2 className="home-section-title">Voces de Nuestra Comunidad</h2>
            </ScrollReveal>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((testi, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} duration={800}>
                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    {[...Array(testi.stars)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="testimonial-quote">
                    "{testi.quote}"
                  </p>
                  <div className="testimonial-user">
                    <div className="testimonial-avatar-wrapper">
                      <img 
                        src={testi.avatar} 
                        alt={testi.name} 
                        className="testimonial-avatar" 
                      />
                    </div>
                    <div className="testimonial-info">
                      <h4>{testi.name}</h4>
                      <p className={`testimonial-role ${testi.role.toLowerCase().includes("estudiante") ? "role-student" : testi.role.toLowerCase().includes("docente") ? "role-teacher" : "role-admin"}`}>
                        {testi.role}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer Expanded */}
      <footer className="home-footer-expanded">
        {/* Subtle section glow atmosphere */}
        <div className="section-atmosphere" aria-hidden="true">
          <div className="section-glow-orb orb-footer" />
        </div>

        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <EduPerformanceLogo size={42} />
              <span style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff' }}>EduPerformance</span>
            </div>
            <p className="footer-brand-desc">
              Innovación y analítica para potenciar los resultados académicos de instituciones líderes.
            </p>
            <div className="footer-socials">
              <a href="#facebook" className="social-circle" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#twitter" className="social-circle" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#linkedin" className="social-circle" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="#instagram" className="social-circle" aria-label="Instagram"><Instagram size={18} /></a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Plataforma</h4>
            <ul className="footer-links-list">
              <li><a href="#inicio" className="footer-link">Inicio</a></li>
              <li><a href="#caracteristicas" className="footer-link">Características</a></li>
              <li><a href="#como-funciona" className="footer-link">Cómo Funciona</a></li>
              <li><a href="#testimonios" className="footer-link">Testimonios</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Portales</h4>
            <ul className="footer-links-list">
              <li><a href="#login" className="footer-link" onClick={onLoginClick}>Portal Estudiantes</a></li>
              <li><a href="#login" className="footer-link" onClick={onLoginClick}>Portal Profesores</a></li>
              <li><a href="#login" className="footer-link" onClick={onLoginClick}>Portal Directivos</a></li>
              <li><a href="#ayuda" className="footer-link">Soporte Técnico</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Suscripción Institucional</h4>
            <p className="footer-newsletter-desc">
              Mantente al tanto de las actualizaciones académicas y boletines institucionales.
            </p>
            {subscribed ? (
              <div className="newsletter-success-card">
                <div className="success-icon-wrapper">
                  <CheckCircle2 size={20} className="success-icon-check" />
                </div>
                <div className="success-text">
                  <span className="success-title">¡Suscrito con éxito!</span>
                  <span className="success-desc">Te hemos registrado en el canal institucional.</span>
                </div>
              </div>
            ) : (
              <form 
                className="footer-newsletter-form" 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) setSubscribed(true);
                }}
              >
                <input 
                  type="email" 
                  placeholder="correo@institucion.edu" 
                  required 
                  aria-label="Correo institucional para newsletter" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit">Suscribir</button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copy">
            &copy; 2026 EduPerformance. Todos los derechos reservados.
          </p>
          <div className="footer-signature">
            Desarrollado por el <span>Equipo CESDE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
