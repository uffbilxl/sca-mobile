const APP_URL = "https://55d2609e-a797-4448-9d89-ed22768d3f98-00-34wade63gm6in.kirk.replit.dev";
const EXPO_URL = "exp://pe_xr74-anonymous-5000.exp.direct";

const WEB_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=161b22&color=ffffff&data=${encodeURIComponent(APP_URL)}&margin=10`;
const EXPO_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=161b22&color=3fb68b&data=${encodeURIComponent(EXPO_URL)}&margin=10`;

export function PhonePreview() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 48,
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "32px 48px",
    }}>
      {/* iPhone 15 Pro frame */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 340,
          height: 720,
          background: "linear-gradient(145deg, #2a2a2e, #1a1a1e)",
          borderRadius: 52,
          padding: 10,
          boxShadow: "0 0 0 1px #3a3a3e, 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
          position: "relative",
        }}>
          <div style={{
            width: "100%", height: "100%",
            background: "#000", borderRadius: 44,
            overflow: "hidden", position: "relative",
          }}>
            {/* Dynamic Island */}
            <div style={{
              position: "absolute", top: 12, left: "50%",
              transform: "translateX(-50%)",
              width: 90, height: 28,
              background: "#000", borderRadius: 20,
              zIndex: 10, border: "1px solid #1c1c1e",
            }} />
            <iframe
              src={APP_URL}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title="SCA App"
            />
          </div>
          {/* Volume buttons */}
          {[{ top: 100, h: 32 }, { top: 148, h: 54 }, { top: 216, h: 54 }].map(({ top, h }, i) => (
            <div key={i} style={{
              position: "absolute", left: -3, top,
              width: 3, height: h,
              background: "#2a2a2e", borderRadius: "2px 0 0 2px",
              boxShadow: "-1px 0 0 #111",
            }} />
          ))}
          {/* Power button */}
          <div style={{
            position: "absolute", right: -3, top: 164,
            width: 3, height: 72,
            background: "#2a2a2e", borderRadius: "0 2px 2px 0",
            boxShadow: "1px 0 0 #111",
          }} />
        </div>
        <div style={{
          position: "absolute", bottom: -20, left: "50%",
          transform: "translateX(-50%)",
          width: 260, height: 20,
          background: "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
      </div>

      {/* Right panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start", width: 260 }}>
        {/* Header */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3fb68b", boxShadow: "0 0 8px #3fb68b" }} />
            <span style={{ fontSize: 10, color: "#3fb68b", letterSpacing: 1.6, textTransform: "uppercase" as const, fontWeight: 700 }}>
              BCUSCA · LIVE
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: 22, color: "#fff", fontWeight: 700, lineHeight: 1.25 }}>
            Student Computing<br />Association
          </h2>
        </div>

        {/* Expo Go QR — tunnel URL */}
        <div style={{
          background: "#161b22", border: "1px solid rgba(63,182,139,0.3)",
          borderRadius: 16, padding: 16,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            alignSelf: "flex-start",
          }}>
            <span style={{ fontSize: 16 }}>📱</span>
            <span style={{ fontSize: 13, color: "#e6edf3", fontWeight: 600 }}>Expo Go</span>
            <span style={{
              fontSize: 9, color: "#3fb68b", background: "rgba(63,182,139,0.1)",
              border: "1px solid rgba(63,182,139,0.25)", borderRadius: 999,
              padding: "2px 7px", fontWeight: 600, letterSpacing: 0.5,
            }}>WORKS NOW</span>
          </div>
          <img src={EXPO_QR} alt="Expo Go QR" style={{ width: 172, height: 172, borderRadius: 10 }} />
          <div style={{ textAlign: "center" as const, width: "100%" }}>
            <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 4 }}>
              Open <strong style={{ color: "#e6edf3" }}>Expo Go</strong> and scan this
            </div>
            <div style={{
              fontSize: 9, color: "#3fb68b", fontFamily: "monospace",
              background: "rgba(63,182,139,0.06)", borderRadius: 6,
              padding: "4px 8px", wordBreak: "break-all" as const,
            }}>{EXPO_URL}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
          <div style={{ flex: 1, height: 1, background: "#21262d" }} />
          <span style={{ fontSize: 10, color: "#484f58" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#21262d" }} />
        </div>

        {/* Web QR */}
        <div style={{
          background: "#161b22", border: "1px solid #30363d",
          borderRadius: 16, padding: 16,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }}>
            <span style={{ fontSize: 16 }}>🌐</span>
            <span style={{ fontSize: 13, color: "#e6edf3", fontWeight: 600 }}>Mobile Browser</span>
          </div>
          <img src={WEB_QR} alt="Web QR" style={{ width: 172, height: 172, borderRadius: 10 }} />
          <div style={{ fontSize: 11, color: "#8b949e", textAlign: "center" as const }}>
            Scan with your camera — opens web version
          </div>
        </div>

        {/* Footnote */}
        <p style={{ fontSize: 10, color: "#484f58", margin: 0, lineHeight: 1.6 }}>
          ⚠️ The Expo Go URL changes when the server restarts. If it stops working, check the Console tab for the new QR code.
        </p>
      </div>
    </div>
  );
}
