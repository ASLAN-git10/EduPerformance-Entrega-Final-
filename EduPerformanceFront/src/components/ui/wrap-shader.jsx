import { useState } from "react";
import { Warp } from "@paper-design/shaders-react";
import {
  BookOpenCheck,
  ChartNoAxesCombined,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import EduPerformanceLogo from "./EduPerformanceLogo";
import { useApp } from "../AppContext";

export default function WarpShaderHero({ onBack }) {
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <main className="shader-hero" aria-label="Inicio de sesion EduPerformance">
      <div className="warp-background" aria-hidden="true">
        <Warp
          style={{ height: "100%", width: "100%" }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={1}
          colors={[
            "hsl(200, 100%, 20%)",
            "hsl(160, 100%, 75%)",
            "hsl(180, 90%, 30%)",
            "hsl(170, 100%, 80%)"
          ]}
        />
      </div>

      <div className="shader-overlay" />

      <div className="hero-content">
        <section className="brand-panel" aria-labelledby="app-title">
          <div className="brand-logo-container" aria-hidden="true">
            <EduPerformanceLogo size={140} />
            <div className="brand-name-logo">EduPerformance</div>
          </div>
          <p className="eyebrow">Plataforma institucional</p>
          <h1 id="app-title">Analítica inteligente para el éxito académico.</h1>
          <p className="hero-copy">
            Centraliza el seguimiento académico, el desempeño docente y los
            reportes clave de tu institución en un entorno seguro.
          </p>

          <div className="trust-row" aria-label="Beneficios principales">
            <span>
              <BookOpenCheck size={18} />
              Seguimiento académico
            </span>
            <span>
              <ShieldCheck size={18} />
              Acceso protegido
            </span>
            <span>
              <ChartNoAxesCombined size={18} />
              Indicadores en tiempo real
            </span>
          </div>
        </section>

        <div className="login-panel">
          <form onSubmit={handleSubmit}>
            {onBack && (
              <button 
                type="button" 
                onClick={onBack} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary, #a1a1aa)', cursor: 'pointer', marginBottom: '1rem', padding: 0, fontSize: '0.9rem', fontWeight: 500 }}
              >
                <ArrowLeft size={16} /> Volver al inicio
              </button>
            )}
            <div className="form-heading">
              <span className="form-icon" aria-hidden="true">
                <Lock size={20} />
              </span>
              <div>
                <h2>Iniciar sesión</h2>
                <p>Accede con tus credenciales institucionales autorizadas.</p>
              </div>
            </div>

            {error && (
              <div className="login-error-message" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <label htmlFor="email-input" className="field">
              <span>Correo institucional</span>
              <div className="input-shell">
                <Mail size={19} aria-hidden="true" />
                <input
                  id="email-input"
                  type="email"
                  placeholder="nombre@institucion.edu"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            <label htmlFor="password-input" className="field">
              <span>Contraseña</span>
              <div className="input-shell">
                <Lock size={19} aria-hidden="true" />
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Escribe tu contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="form-options">
              <label className="premium-toggle-label">
                <input type="checkbox" className="premium-toggle-input" />
                <span className="premium-toggle-switch"></span>
                <span>Mantener sesión activa</span>
              </label>
              <a href="#recuperar">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="submit-button">
              Entrar al sistema
            </button>
          </form>
        </div>
      </div>

      <footer className="app-footer">
        <span>EduPerformance</span>
        <span className="footer-dot" aria-hidden="true"></span>
        <span>Desarrollado por el <span className="author-name">Equipo CESDE</span></span>
      </footer>
    </main>
  );
}
