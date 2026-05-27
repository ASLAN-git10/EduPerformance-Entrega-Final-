export function CardSkeleton() {
  return (
    <div style={{
      background: "rgba(248, 252, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      borderRadius: "16px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      backdropFilter: "blur(12px)"
    }}>
      <div className="skeleton-pulse" style={{ width: "40%", height: "16px", borderRadius: "4px" }} />
      <div className="skeleton-pulse" style={{ width: "70%", height: "28px", borderRadius: "4px" }} />
      <div className="skeleton-pulse" style={{ width: "50%", height: "14px", borderRadius: "4px" }} />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div style={{
      background: "rgba(248, 252, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "16px",
      padding: "24px",
      display: "flex",
      gap: "20px",
      alignItems: "center"
    }}>
      <div className="skeleton-pulse" style={{ width: "80px", height: "80px", borderRadius: "50%", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
        <div className="skeleton-pulse" style={{ width: "50%", height: "20px", borderRadius: "4px" }} />
        <div className="skeleton-pulse" style={{ width: "30%", height: "14px", borderRadius: "4px" }} />
        <div className="skeleton-pulse" style={{ width: "80%", height: "14px", borderRadius: "4px" }} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4, cols = 5 }) {
  return (
    <div style={{
      background: "rgba(248, 252, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      borderRadius: "12px",
      padding: "20px",
      width: "100%",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "12px" }}>
        {[...Array(cols)].map((_, i) => (
          <div key={i} className="skeleton-pulse" style={{ flex: 1, height: "18px", borderRadius: "4px" }} />
        ))}
      </div>
      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[...Array(rows)].map((_, rIdx) => (
          <div key={rIdx} style={{ display: "flex", gap: "16px" }}>
            {[...Array(cols)].map((_, cIdx) => (
              <div key={cIdx} className="skeleton-pulse" style={{ flex: 1, height: "16px", borderRadius: "4px" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
