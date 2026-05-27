import EduPerformanceLogo from "./EduPerformanceLogo";

export default function LoadingScreen() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      width: "100%",
      height: "100vh",
      background: "#040812",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      gap: "24px"
    }}>
      {/* Glow background */}
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(80, 222, 198, 0.15) 0%, transparent 70%)",
        filter: "blur(30px)",
        pointerEvents: "none"
      }} />

      <div style={{
        animation: "pulseSpinner 2s infinite ease-in-out",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px"
      }}>
        <EduPerformanceLogo size={90} />
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px"
      }}>
        <h3 style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          fontWeight: 700,
          margin: 0,
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }}>
          Cargando Portal
        </h3>
        <div style={{
          width: "140px",
          height: "3px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "3px",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "50%",
            background: "linear-gradient(90deg, #8ef0db, #ffd166)",
            borderRadius: "3px",
            animation: "progressAnim 1.5s infinite ease-in-out"
          }} />
        </div>
      </div>

      {/* Styled inline keyframes to prevent need for external stylesheet imports */}
      <style>{`
        @keyframes pulseSpinner {
          0%, 100% { transform: scale(0.95); filter: drop-shadow(0 0 15px rgba(80, 222, 198, 0.25)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 35px rgba(80, 222, 198, 0.65)); }
        }
        @keyframes progressAnim {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
