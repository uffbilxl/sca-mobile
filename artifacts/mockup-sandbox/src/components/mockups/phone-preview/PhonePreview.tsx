const APP_URL = "https://55d2609e-a797-4448-9d89-ed22768d3f98-00-34wade63gm6in.kirk.replit.dev";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=0d1117&color=ffffff&data=${encodeURIComponent(APP_URL)}&margin=12`;
const EXP_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=0d1117&color=3fb68b&data=${encodeURIComponent("exp://172.24.0.2:5000")}&margin=12`;

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
      {/* iPhone frame */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {/* Outer shell */}
        <div style={{
          width: 340,
          height: 720,
          background: "linear-gradient(145deg, #2a2a2e, #1a1a1e)",
          borderRadius: 52,
          padding: 10,
          boxShadow: "0 0 0 1px #3a3a3e, 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
          position: "relative",
        }}>
          {/* Screen bezel */}
          <div style={{
            width: "100%",
            height: "100%",
            background: "#000",
            borderRadius: 44,
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Dynamic Island */}
            <div style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 90,
              height: 28,
              background: "#000",
              borderRadius: 20,
              zIndex: 10,
              border: "1px solid #1c1c1e",
            }} />

            {/* App iframe */}
            <iframe
              src={APP_URL}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
              title="SCA App"
            />
          </div>

          {/* Side buttons */}
          <div style={{
            position: "absolute",
            left: -3,
            top: 100,
            width: 3,
            height: 32,
            background: "#2a2a2e",
            borderRadius: "2px 0 0 2px",
            boxShadow: "-1px 0 0 #111",
          }} />
          <div style={{
            position: "absolute",
            left: -3,
            top: 148,
            width: 3,
            height: 54,
            background: "#2a2a2e",
            borderRadius: "2px 0 0 2px",
            boxShadow: "-1px 0 0 #111",
          }} />
          <div style={{
            position: "absolute",
            left: -3,
            top: 216,
            width: 3,
            height: 54,
            background: "#2a2a2e",
            borderRadius: "2px 0 0 2px",
            boxShadow: "-1px 0 0 #111",
          }} />
          {/* Power button */}
          <div style={{
            position: "absolute",
            right: -3,
            top: 164,
            width: 3,
            height: 72,
            background: "#2a2a2e",
            borderRadius: "0 2px 2px 0",
            boxShadow: "1px 0 0 #111",
          }} />
        </div>

        {/* Reflection */}
        <div style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 260,
          height: 20,
          background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
      </div>

      {/* Right panel: QR code */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "flex-start",
        maxWidth: 260,
      }}>
        {/* Header */}
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#3fb68b",
              boxShadow: "0 0 6px #3fb68b",
            }} />
            <span style={{ fontSize: 10, color: "#3fb68b", letterSpacing: 1.6, textTransform: "uppercase", fontWeight: 600 }}>
              BCUSCA · LIVE
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: 22, color: "#fff", fontWeight: 700, lineHeight: 1.25 }}>
            Student Computing<br />Association
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6e7681", lineHeight: 1.6 }}>
            Scan to open on your phone
          </p>
        </div>

        {/* Web QR */}
        <div style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}>
          <img
            src={QR_URL}
            alt="Web QR Code"
            style={{ width: 160, height: 160, borderRadius: 8 }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 2 }}>Open in mobile browser</div>
            <div style={{ fontSize: 9, color: "#58a6ff", fontFamily: "monospace" }}>bcusca.replit.dev</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
          <div style={{ flex: 1, height: 1, background: "#21262d" }} />
          <span style={{ fontSize: 10, color: "#484f58" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#21262d" }} />
        </div>

        {/* Expo Go QR */}
        <div style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}>
          <img
            src={EXP_QR_URL}
            alt="Expo Go QR"
            style={{ width: 160, height: 160, borderRadius: 8 }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 2 }}>Open in Expo Go app</div>
            <div style={{ fontSize: 9, color: "#3fb68b", fontFamily: "monospace" }}>exp://172.24.0.2:5000</div>
          </div>
        </div>

        <p style={{ fontSize: 10, color: "#484f58", margin: 0, lineHeight: 1.6 }}>
          Need the native Expo Go QR? Open the Console tab in Replit and scan from there for full native rendering.
        </p>
      </div>
    </div>
  );
}
