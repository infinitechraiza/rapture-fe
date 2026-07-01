"use client";
import { useState, useEffect, useCallback } from "react";

const COLORS = {
  purple: "#b94fff",
  mid: "#e040fb",
  pink: "#ff2d9b",
  blue: "#4fc3ff",
  bg: "#060614",
  darkRecess: "#160830",
  capBg: "#1e0d40",
};

function usePulse(duration = 2000) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      setPhase(((ts - start) % duration) / duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);
  return phase;
}

function useRingOffset(duration = 2400, dasharray = 340) {
  const [offset, setOffset] = useState(dasharray);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = ((ts - start) % duration) / duration;
      const filled = p < 0.65 ? p / 0.65 : 1;
      setOffset(dasharray * (1 - filled));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, dasharray]);
  return offset;
}

function usePulseRing(duration = 2400) {
  const [state, setState] = useState({ r: 36, opacity: 0 });
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = ((ts - start) % duration) / duration;
      setState({ r: 36 + p * 34, opacity: (1 - p) * 0.9 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);
  return state;
}

function useBlobDrift(duration: number, radiusX: number, radiusY: number, phaseOffset = 0) {
  const [pos, setPos] = useState({ x: 0, y: 0, scale: 1 });
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = (((ts - start) / duration) + phaseOffset) % 1;
      const angle = p * Math.PI * 2;
      setPos({
        x: Math.cos(angle) * radiusX,
        y: Math.sin(angle * 1.3) * radiusY,
        scale: 0.85 + Math.sin(angle * 2) * 0.15,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, radiusX, radiusY, phaseOffset]);
  return pos;
}

function MicSVG() {
  const ringOffset = useRingOffset(2400, 340);
  const pulseRing = usePulseRing(2400);
  const dotPhase = usePulse(2000);

  const blob1 = useBlobDrift(9000, 70, 90, 0);
  const blob2 = useBlobDrift(11000, 60, 80, 0.33);
  const blob3 = useBlobDrift(13000, 80, 60, 0.66);
  const blob4 = useBlobDrift(10000, 50, 70, 0.5);

  const dotOpacity = (delay: number) => {
    const shifted = (dotPhase + delay) % 1;
    return shifted < 0.3
      ? 0.2 + (shifted / 0.3) * 0.8
      : shifted < 0.6
        ? 1 - ((shifted - 0.3) / 0.3) * 0.8
        : 0.2;
  };

  // Taller card now: viewBox 900x920. Mic pushed down to cy=340 for a big gap below LOADING badge.
  return (
    <svg
      width="100%"
      viewBox="0 0 900 920"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <title>Rapture loading screen</title>
      <desc>Neon vintage broadcast microphone loading animation with lava lamp orbs</desc>
      <defs>
        <linearGradient id="ppG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.purple} />
          <stop offset="50%" stopColor={COLORS.mid} />
          <stop offset="100%" stopColor={COLORS.pink} />
        </linearGradient>
        <linearGradient id="ppH" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.purple} stopOpacity="0.45" />
          <stop offset="100%" stopColor={COLORS.pink} stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.purple} />
          <stop offset="50%" stopColor={COLORS.mid} />
          <stop offset="100%" stopColor={COLORS.pink} />
        </linearGradient>
        <radialGradient id="micBodyFill" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#3d1280" />
          <stop offset="60%" stopColor="#2a0e60" />
          <stop offset="100%" stopColor="#160830" />
        </radialGradient>
        <radialGradient id="blobBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.blue} stopOpacity="0.55" />
          <stop offset="100%" stopColor={COLORS.blue} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="blobPink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.pink} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.pink} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="blobPurple" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.purple} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.purple} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="blobMid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.mid} stopOpacity="0.45" />
          <stop offset="100%" stopColor={COLORS.mid} stopOpacity="0" />
        </radialGradient>
        <clipPath id="cardClip">
          <rect x="100" y="10" width="700" height="900" rx="32" />
        </clipPath>
        <clipPath id="headClip">
          <ellipse cx="450" cy="340" rx="126" ry="162" />
        </clipPath>
      </defs>

      {/* Card bg base */}
      <rect x="100" y="10" width="700" height="900" rx="32"
        fill={COLORS.bg} stroke="rgba(71, 70, 71, 0.25)" strokeWidth="1.5"
      />

      {/* Lava-lamp drifting orbs, clipped to card */}
      <g clipPath="url(#cardClip)" style={{ filter: "blur(50px)" }}>
        <circle cx={260 + blob1.x} cy={280 + blob1.y} r={150 * blob1.scale} fill="url(#blobPurple)" />
        <circle cx={620 + blob2.x} cy={330 + blob2.y} r={140 * blob2.scale} fill="url(#blobBlue)" />
        <circle cx={450 + blob3.x} cy={650 + blob3.y} r={170 * blob3.scale} fill="url(#blobPink)" />
        <circle cx={300 + blob4.x} cy={750 + blob4.y} r={120 * blob4.scale} fill="url(#blobMid)" />
        <circle cx={680 + blob1.x * -1} cy={780 + blob1.y} r={110} fill="url(#blobBlue)" />
      </g>

      {/* Loading badge — top of card */}
      <rect x="375" y="34" width="150" height="30" rx="15"
        fill="rgba(185,79,255,0.15)" stroke="rgba(185,79,255,0.5)" strokeWidth="1"
      />
      <circle cx="393" cy="49" r="4" fill={COLORS.pink}>
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="408" y="54" fontFamily="'Space Grotesk',sans-serif"
        fontSize="12" fill={COLORS.purple} letterSpacing="3">LOADING</text>

      {/* Mic head outer glow — now far below the badge */}
      <ellipse cx="450" cy="340" rx="130" ry="167" fill="none"
        stroke="rgba(185,79,255,0.35)" strokeWidth="18"
        style={{ filter: "blur(10px)" }}
      />

      {/* Mic body — purple filled */}
      <ellipse cx="450" cy="340" rx="126" ry="162"
        fill="url(#micBodyFill)" stroke="url(#ppG)" strokeWidth="3"
      />
      <ellipse cx="450" cy="340" rx="126" ry="162" fill="url(#ppH)" />

      {/* Top dome cap */}
      <path d="M356 312 Q356 198 450 194 Q544 198 544 312"
        fill={COLORS.capBg} stroke="url(#ppG)" strokeWidth="2.5"
      />
      <rect x="414" y="202" width="17" height="8" rx="4" fill="rgba(185,79,255,0.85)" />
      <rect x="441" y="197" width="17" height="8" rx="4" fill="rgba(224,64,251,0.9)" />
      <rect x="468" y="197" width="17" height="8" rx="4" fill="rgba(224,64,251,0.9)" />
      <rect x="495" y="202" width="17" height="8" rx="4" fill="rgba(255,45,155,0.85)" />
      <path d="M374 226 Q450 216 526 226" fill="none" stroke="rgba(185,79,255,0.7)" strokeWidth="6" strokeLinecap="round" />
      <path d="M364 244 Q450 232 536 244" fill="none" stroke="rgba(185,79,255,0.65)" strokeWidth="6" strokeLinecap="round" />
      <path d="M358 262 Q450 249 542 262" fill="none" stroke="rgba(185,79,255,0.6)" strokeWidth="6" strokeLinecap="round" />

      {/* Grill bars clipped */}
      <g clipPath="url(#headClip)">
        {([
          [278, "rgba(185,79,255,0.75)"],
          [300, "rgba(196,58,255,0.75)"],
          [322, "rgba(208,54,252,0.75)"],
          [344, "rgba(220,52,248,0.75)"],
          [366, "rgba(232,50,228,0.75)"],
          [388, "rgba(245,46,195,0.75)"],
          [410, "rgba(255,45,155,0.75)"],
        ] as [number, string][]).map(([y, fill]) => (
          <rect key={y} x="324" y={y} width="252" height="14" rx="7" fill={fill} />
        ))}
      </g>

      {/* Bottom dome cap */}
      <path d="M356 368 Q356 490 450 494 Q544 490 544 368"
        fill={COLORS.capBg} stroke="url(#ppG)" strokeWidth="2.5"
      />
      <path d="M374 464 Q450 474 526 464" fill="none" stroke="rgba(255,45,155,0.65)" strokeWidth="6" strokeLinecap="round" />
      <path d="M364 446 Q450 458 536 446" fill="none" stroke="rgba(255,45,155,0.6)" strokeWidth="6" strokeLinecap="round" />
      <rect x="414" y="476" width="17" height="8" rx="4" fill="rgba(185,79,255,0.8)" />
      <rect x="441" y="480" width="17" height="8" rx="4" fill="rgba(224,64,251,0.8)" />
      <rect x="468" y="480" width="17" height="8" rx="4" fill="rgba(255,45,155,0.8)" />
      <rect x="495" y="476" width="17" height="8" rx="4" fill="rgba(255,45,155,0.8)" />

      {/* Yoke knobs */}
      <circle cx="332" cy="434" r="15" fill={COLORS.capBg} stroke="url(#ppG)" strokeWidth="2.5" />
      <circle cx="332" cy="434" r="7.5" fill="url(#ppG)" opacity="0.85" />
      <circle cx="568" cy="434" r="15" fill={COLORS.capBg} stroke="url(#ppG)" strokeWidth="2.5" />
      <circle cx="568" cy="434" r="7.5" fill="url(#ppG)" opacity="0.85" />

      {/* Yoke arms */}
      <path d="M332 449 C332 512 372 550 420 560"
        fill="none" stroke="url(#ppG)" strokeWidth="11" strokeLinecap="round"
      />
      <path d="M568 449 C568 512 528 550 480 560"
        fill="none" stroke="url(#ppG)" strokeWidth="11" strokeLinecap="round"
      />

      {/* Neck */}
      <rect x="432" y="558" width="36" height="24" rx="7"
        fill={COLORS.capBg} stroke="rgba(185,79,255,0.7)" strokeWidth="2"
      />
      <path d="M436 582 L428 610 L472 610 L464 582 Z"
        fill={COLORS.capBg} stroke="rgba(185,79,255,0.5)" strokeWidth="1.5"
      />
      <rect x="420" y="608" width="60" height="24" rx="8"
        fill={COLORS.capBg} stroke="url(#ppG)" strokeWidth="2"
      />
      <rect x="430" y="615" width="40" height="10" rx="5" fill="url(#ppG)" opacity="0.8" />

      {/* Stand pole */}
      <rect x="444" y="632" width="12" height="140" rx="6"
        fill="#1a0a2e" stroke="rgba(185,79,255,0.45)" strokeWidth="1.5"
      />

      {/* Base */}
      <ellipse cx="450" cy="774" rx="90" ry="18"
        fill={COLORS.capBg} stroke="url(#ppG)" strokeWidth="2.5"
      />
      <ellipse cx="450" cy="780" rx="72" ry="12"
        fill={COLORS.darkRecess} stroke="rgba(255,45,155,0.3)" strokeWidth="1"
      />

      {/* Loading ring — centered in the open yoke area */}
      <circle cx="450" cy="520" r="54"
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round"
      />
      <circle
        cx="450" cy="520" r="54"
        fill="none" stroke="url(#rg)"
        strokeWidth="6" strokeLinecap="round"
        strokeDasharray="340" strokeDashoffset={ringOffset}
        transform="rotate(-90 450 520)"
      />
      <circle
        cx="450" cy="520" r={pulseRing.r}
        fill="none" stroke={COLORS.pink}
        strokeWidth="2" opacity={pulseRing.opacity}
      />

      {/* Divider */}
      <line x1="330" y1="824" x2="570" y2="824" stroke="url(#rg)" strokeWidth="1.5" />

      {/* 3 dots */}
      <circle cx="434" cy="850" r="6" fill={COLORS.pink} opacity={dotOpacity(0)} />
      <circle cx="450" cy="850" r="6" fill={COLORS.mid} opacity={dotOpacity(0.15)} />
      <circle cx="466" cy="850" r="6" fill={COLORS.purple} opacity={dotOpacity(0.3)} />
    </svg>
  );
}

interface RaptureLoaderProps {
  visible?: boolean;
  duration?: number;
  onDone?: () => void;
}

export default function RaptureLoader({
  visible,
  duration = 2800,
  onDone,
}: RaptureLoaderProps = {}) {
  const controlled = visible !== undefined;
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  const hide = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setShow(false);
      onDone?.();
    }, 600);
  }, [onDone]);

  useEffect(() => {
    if (controlled) return;
    if (duration > 0) {
      const t = setTimeout(hide, duration);
      return () => clearTimeout(t);
    }
  }, [controlled, duration, hide]);

  useEffect(() => {
    if (!controlled) return;
    if (visible) {
      setShow(true);
      setFading(false);
    } else {
      hide();
    }
  }, [controlled, visible, hide]);

  if (!show) return null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#000",
          display: "flex",
          padding: "20px",
          alignItems: "center",
          justifyContent: "center",
          transition: "opacity 0.6s ease",
          opacity: fading ? 0 : 1,
          pointerEvents: fading ? "none" : "all",
        }}
      >
        <div style={{ width: "100%", maxWidth: 560, padding: "20px" }}>
          <MicSVG />
        </div>
      </div>
    </>
  );
}

export function useRaptureLoader() {
  const [show, setShow] = useState(false);
  const triggerLoader = useCallback(() => {
    setShow(true);
    setTimeout(() => setShow(false), 2800);
  }, []);
  return { show, triggerLoader };
}