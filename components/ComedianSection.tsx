"use client";

import { useState, useEffect } from "react";
import { Mic2, Ticket, X, Loader2 } from "lucide-react";

type Comedian = {
  id: number;
  name: string;
  tagline: string | null;
  genre: string | null;
  bio: string | null;
  image: string | null;
  status: "active" | "inactive";
};

const TAG_COLORS = ["#ff2d9b", "#00d4ff", "#b94fff"];

function getTagColor(index: number) {
  return TAG_COLORS[index % TAG_COLORS.length];
}



/* ─── Comedian Modal ─── */
function ComedianModal({
  comedian,
  tagColor,
  onClose,
}: {
  comedian: Comedian;
  tagColor: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div
          style={{
            padding: "20px 20px 0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: "16px 20px 24px", textAlign: "center" }}>
          <img
            src={comedian.image || "/images/default-avatar.png"}
            alt={comedian.name}
            className="modal-avatar"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(185,79,255,0.5)",
              boxShadow: "0 0 40px rgba(185,79,255,0.3)",
              marginBottom: 20,
            }}
          />
          <h3
            className="modal-title"
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 6,
            }}
          >
            {comedian.name}
          </h3>
          {comedian.tagline && (
            <div
              className="modal-tagline"
              style={{
                fontSize: 16,
                fontStyle: "italic",
                color: tagColor,
                marginBottom: 12,
              }}
            >
              {comedian.tagline}
            </div>
          )}
          {comedian.genre && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 50,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.5)",
                marginBottom: 20,
              }}
            >
              <Mic2 size={11} />
              {comedian.genre}
            </div>
          )}
          {comedian.bio && (
            <p
              className="modal-description"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              {comedian.bio}
            </p>
          )}
          <a
            href="#events"
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 50,
              background: "linear-gradient(135deg,#b94fff,#ff2d9b)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.3s",
              boxShadow: "0 0 20px rgba(185,79,255,0.3)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(185,79,255,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(185,79,255,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Ticket size={14} /> See Their Next Show
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Comedians Section ─── */
export function ComedianSection() {
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Comedian | null>(null);

  useEffect(() => {
    fetchComedians();
  }, []);

  async function fetchComedians() {
    setLoading(true);
    try {
      const res = await fetch("/api/comedians?status=active&per_page=6");
      if (!res.ok) return;

      const json = await res.json();
      // Laravel controller wraps the paginated list as data.data
      const list = json?.data?.data ?? [];
      setComedians(list);
    } catch {
      // network error — leave the grid empty rather than break the page
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="comedians"
      className="section-glow-bg"
      style={{ padding: "60px 20px" }}
    >
      {active && (
        <ComedianModal
          comedian={active}
          tagColor={getTagColor(comedians.findIndex((c) => c.id === active.id))}
          onClose={() => setActive(null)}
        />
      )}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          className="comedian-section-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 12,
              }}
            >
              Meet the Talent
            </div>
            <h2
              className="comedian-section-title"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#fff",
              }}
            >
              Featured
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#b94fff,#ff2d9b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Comedians
              </span>
            </h2>
          </div>
          <a
            className="comedian-section-link"
            href="comedians"
            style={{
              padding: "10px 22px",
              borderRadius: 50,
              border: "1px solid rgba(185,79,255,0.5)",
              color: "#b94fff",
              fontWeight: 600,
              fontSize: 13,
              textDecoration: "none",
              background: "rgba(185,79,255,0.07)",
              whiteSpace: "nowrap",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "rgba(185,79,255,0.8)";
              e.currentTarget.style.background = "rgba(185,79,255,0.12)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(185,79,255,0.5)";
              e.currentTarget.style.background = "rgba(185,79,255,0.07)";
            }}
          >
            View All Comedians →
          </a>
        </div>

        {/* Grid */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px 0",
            }}
          >
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "#b94fff" }}
            />
          </div>
        ) : comedians.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
            }}
          >
            No comedians to show right now — check back soon.
          </div>
        ) : (
          <div
            className="comedian-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 16,
            }}
          >
            {comedians.map((c, i) => (
              <div
                key={c.id}
                className="comedian-card"
                onClick={() => setActive(c)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={ c.image || "/images/default-avatar.png"}
                  alt={c.name}
                  className="comedian-avatar"
                />
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  {c.name}
                </h3>
                {c.tagline && (
                  <div
                    style={{
                      fontSize: 14,
                      fontStyle: "italic",
                      color: getTagColor(i),
                      marginBottom: 10,
                    }}
                  >
                    {c.tagline}
                  </div>
                )}
                {c.genre && (
                  <div className="comedian-category">
                    <Mic2 size={10} />
                    {c.genre}
                  </div>
                )}
                {c.bio && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.65,
                      textAlign: "left",
                    }}
                  >
                    {c.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
