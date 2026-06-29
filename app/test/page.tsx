"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const SPRITE = "1781586840019_image.png";

const row1 = [
  { label: "Fresh Bathroom Tissue", x: 118, y: 32, w: 110, h: 84 },
  { label: "Kami", x: 258, y: 42, w: 106, h: 72 },
  { label: "Smart Choice", x: 380, y: 28, w: 112, h: 88 },
  { label: "Vanitá Premium", x: 500, y: 30, w: 132, h: 86 },
  { label: "Fresh (Recycled)", x: 645, y: 38, w: 126, h: 72 },
  { label: "Harmony Napkins", x: 780, y: 44, w: 132, h: 64 },
  { label: "Fresh by Eco Hygiene", x: 914, y: 34, w: 142, h: 78 },
];
const row2 = [
  { label: "Sweetbaby Diapers", x: 252, y: 152, w: 186, h: 62 },
  { label: "Prime Care Adult Diaper", x: 495, y: 148, w: 178, h: 72 },
  { label: "Life Defender Masks", x: 728, y: 154, w: 216, h: 60 },
];
const row3 = [
  { label: "Fresh Toothpaste", x: 388, y: 252, w: 128, h: 82 },
  { label: "TeaBiotic", x: 625, y: 264, w: 162, h: 66 },
];

const GRID_W = 82,
  GRID_H = 52;
const FOOT1_W = 100,
  FOOT1_H = 56;
const FOOT2_W = 130,
  FOOT2_H = 56;
const FOOT3_W = 110,
  FOOT3_H = 62;

interface Brand {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface BrandCanvasProps {
  brand: Brand;
  outW: number;
  outH: number;
  spriteImg: HTMLImageElement;
  className?: string;
}

function drawCrop(
  canvas: HTMLCanvasElement,
  brand: Brand,
  outW: number,
  outH: number,
  img: HTMLImageElement
) {
  const iw = img.naturalWidth,
    ih = img.naturalHeight;
  const sx = brand.x * (iw / 1192),
    sy = brand.y * (ih / 590);
  const sw = brand.w * (iw / 1192),
    sh = brand.h * (ih / 590);
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, outW, outH);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
}

function BrandCanvas({ brand, outW, outH, spriteImg, className = "" }: BrandCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current && spriteImg)
      drawCrop(ref.current, brand, outW, outH, spriteImg);
  }, [spriteImg, brand, outW, outH]);
  return <canvas ref={ref} title={brand.label} className={className} />;
}

// ── SVG Icons ──────────────────────────────────────────────────────────────
const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="10" stroke="#1B4D2E" strokeWidth="1.5" />
    <path d="M11 4 Q16 8 14 14 Q11 18 8 14 Q6 8 11 4Z" fill="#2E7D4F" />
    <circle cx="11" cy="11" r="3" fill="#1B4D2E" />
  </svg>
);

const LeafIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2 Q16 6 14 12 Q11 17 6 12 Q4 6 10 2Z" fill="#52A870" />
    <line x1="10" y1="12" x2="10" y2="18" stroke="#A8D5B5" strokeWidth="1.5" />
  </svg>
);

const CircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7" stroke="#52A870" strokeWidth="1.5" />
    <path d="M10 6 L12 10 L10 14 L8 10 Z" fill="#52A870" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect
      x="3"
      y="3"
      width="14"
      height="14"
      rx="3"
      stroke="#52A870"
      strokeWidth="1.5"
    />
    <path
      d="M7 10 L9 12 L13 8"
      stroke="#52A870"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const TreeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M4 16 L10 4 L16 16 Z"
      stroke="#52A870"
      strokeWidth="1.5"
      fill="none"
    />
    <line x1="7" y1="12" x2="13" y2="12" stroke="#52A870" strokeWidth="1.5" />
  </svg>
);

// ── Component ───────────────────────────────────────────────────────────────
export default function Home() {
  const trackRef = useRef<HTMLDivElement>(null);

  const spriteRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const trustItems = [
    { icon: "ti-leaf", label: "FSC Certified Pulp" },
    { icon: "ti-certificate", label: "ISO 9001:2015 Certified" },
    { icon: "ti-truck-delivery", label: "Nationwide Distribution" },
    { icon: "ti-tree", label: "Carbon-Offset Program" },
    { icon: "ti-shield-check", label: "BFAD Compliant" },
    { icon: "ti-recycle", label: "Zero-Waste Production" },
    { icon: "ti-award", label: "ISO 14001:2015 Certified" },
    { icon: "ti-plant-2", label: "Biodegradable Packaging" },
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let paused = false;
    let raf: number;

    const tick = () => {
      if (!paused) {
        x -= 0.6;
        if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
        track.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    track.addEventListener("mouseenter", () => (paused = true));
    track.addEventListener("mouseleave", () => (paused = false));
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      spriteRef.current = img;
      setLoaded(true);
    };
    img.onerror = () => setLoaded(false);
    img.src = SPRITE;
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* ── Navigation ── */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 42,
              height: 42,
              background: "#fff",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle
                cx="13"
                cy="13"
                r="12"
                stroke="#1B4D2E"
                strokeWidth="1.5"
              />
              <path
                d="M13 3 Q20 8 17 16 Q13 22 9 16 Q6 8 13 3Z"
                fill="#2E7D4F"
              />
              <circle cx="13" cy="13" r="4" fill="#1B4D2E" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#fff",
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              Rapture Cafe Bar
            </div>
            <div
              style={{
                fontSize: 9.5,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.22em",
                marginTop: 3,
              }}
            >
              CORPORATION
            </div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {["About Us", "Brands", "Our Group of Companies"].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                color: "rgba(255,255,255,0.75)",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: "0.05em",
              }}
            >
              {l}
            </a>
          ))}
          {/* Separator */}
          <div
            style={{
              width: 1,
              height: 18,
              background: "rgba(255,255,255,0.15)",
            }}
          />
          <a
            href="#"
            style={{
              color: "rgba(255,255,255,0.75)",
              textDecoration: "none",
              fontSize: 13,
              letterSpacing: "0.05em",
            }}
          >
            Work With Us
          </a>
          <button
            style={{
              background: "rgba(82,168,112,0.9)",
              color: "#fff",
              padding: "9px 22px",
              borderRadius: 3,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
            }}
          >
            Contact
          </button>
        </div>
      </nav>

      {/* ── Hero — video background ── */}
      <section
        style={{
          position: "relative",
          height: 800,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Video BG */}
        <div style={{ position: "absolute", inset: 0 }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/videos/nature-thumb.jpg"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src="/videos/nature.mp4" type="video/mp4" />
            <img
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&h=1000&fit=crop&auto=format&q=85"
              alt="Forest"
            />
          </video>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,28,16,0.52)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(5,18,9,0.6) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 200,
              background:
                "linear-gradient(to top, rgba(10,28,16,0.75), transparent)",
            }}
          />
        </div>

        {/* Hero Content */}
        <div
          className={styles.heroContent}
          style={{ maxWidth: 680, textAlign: "center", padding: "0 2rem" }}
        >
          <div
            className={styles.heroEyebrow}
            style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                width: 28,
                height: 1,
                background: "rgba(168,213,181,0.6)",
                display: "block",
              }}
            />
            Philippine Manufacturing Excellence
            <span
              style={{
                width: 28,
                height: 1,
                background: "rgba(168,213,181,0.6)",
                display: "block",
              }}
            />
          </div>
          <h1 className={styles.heroTitle} style={{ fontSize: 54 }}>
            Over 20 years of
            <br />
            <strong>high-quality, affordable,</strong>
            <br />
            hygienic &amp; environment-
            <br />
            friendly products.
          </h1>
          <p
            className={styles.heroSub}
            style={{ maxWidth: 500, margin: "0 auto 2rem" }}
          >
            Crafted from nature, trusted by institutions. Rapture Cafe Bar delivers
            premium tissue solutions to homes, hotels, hospitals, and
            corporations across the Philippines.
          </p>
          <div
            className={styles.heroActions}
            style={{ justifyContent: "center" }}
          >
            <button className={styles.btnPrimary}>Explore Our Brands</button>
            <button className={styles.btnGhost}>Work With Us ›</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: "rgba(255,255,255,0.45)",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 1,
              height: 36,
              background: "rgba(255,255,255,0.25)",
              animation: "scrollpulse 2s ease-in-out infinite",
            }}
          />
          <span>Scroll</span>
        </div>

        <style>{`
    @keyframes scrollpulse {
      0%,100% { opacity: 0.3; transform: scaleY(0.6); }
      50%      { opacity: 1;   transform: scaleY(1);   }
    }
  `}</style>
      </section>

      {/* ── Trust / Stats Bar ── */}
      {/* ── Trust Bar — infinite carousel ── */}
      <div
        className={styles.trustBar}
        style={{
          padding: 0,
          overflow: "hidden",
          position: "relative",
          height: 56,
        }}
      >
        {/* Fade edges */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 60,
            background: "linear-gradient(to right, #2E7D4F, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 60,
            background: "linear-gradient(to left, #2E7D4F, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Scrolling track — items duplicated for seamless loop */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          {[...trustItems, ...trustItems].map((item, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0 2.5rem",
                borderRight: "1px solid rgba(168,213,181,0.2)",
                height: 56,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "1px solid rgba(168,213,181,0.35)",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className={`ti ${item.icon}`}
                  aria-hidden="true"
                  style={{ fontSize: 15, color: "#A8D5B5" }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#E8F5EE",
                  letterSpacing: "0.06em",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* ── Why Choose Rapture Cafe Bar ── */}
      <section
        style={{
          backgroundColor: "#f5f9f2",
          backgroundImage: `
    repeating-linear-gradient(0deg, rgba(168,213,181,0.13) 0px, rgba(168,213,181,0.13) 1px, transparent 1px, transparent 18px),
    repeating-linear-gradient(90deg, rgba(168,213,181,0.13) 0px, rgba(168,213,181,0.13) 1px, transparent 1px, transparent 18px),
    repeating-linear-gradient(45deg, rgba(200,230,210,0.07) 0px, rgba(200,230,210,0.07) 1px, transparent 1px, transparent 12px),
    repeating-linear-gradient(-45deg, rgba(200,230,210,0.07) 0px, rgba(200,230,210,0.07) 1px, transparent 1px, transparent 12px)
  `,
          padding: "5rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient light blobs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle at 20% 50%, rgba(82,168,112,0.06) 0%, transparent 55%),
                 radial-gradient(circle at 80% 30%, rgba(27,77,46,0.05) 0%, transparent 50%)`,
          }}
        />

        {/* Header */}
        <div
          className={styles.sectionLabel}
          style={{ textAlign: "center", position: "relative" }}
        >
          Our Promise
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 40,
            fontWeight: 300,
            color: "#1B4D2E",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: "4rem",
            position: "relative",
          }}
        >
          Why choose{" "}
          <em style={{ fontStyle: "italic", color: "#2E7D4F" }}>
          Rapture Cafe Bar?
          </em>
        </div>

        {/* Three pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            position: "relative",
          }}
        >
          {/* Dividers */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              bottom: "10%",
              left: "33.33%",
              width: 1,
              background: "rgba(168,213,181,0.4)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10%",
              bottom: "10%",
              left: "66.66%",
              width: 1,
              background: "rgba(168,213,181,0.4)",
            }}
          />

          {[
            {
              num: "01",
              icon: "ti-leaf",
              title: "Committed to\nSustainability",
              body: "We focus not only on being economically viable but on being socially responsible and environmentally sensible — ensuring products meet the needs of present and future generations.",
              statVal: "100%",
              statLabel: "FSC Certified Pulp",
            },
            {
              num: "02",
              icon: "ti-bulb",
              title: "We Provide\nSolutions",
              body: "Our customers are our inspiration. We listen and understand their needs. Our wide portfolio enables us to create options and customize products to ensure complete satisfaction.",
              statVal: "500+",
              statLabel: "Corporate Clients",
            },
            {
              num: "03",
              icon: "ti-heart-handshake",
              title: "We Help the\nCommunity",
              body: "We immerse ourselves in communities dedicated to bettering the world, gaining a unique sense of purpose by serving those around us — reflected in every area of our lives and work.",
              statVal: "120K+",
              statLabel: "Trees Planted Nationwide",
            },
          ].map((p) => (
            <div
              key={p.num}
              style={{
                padding: "0 2.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Icon ring */}
              <div style={{ position: "relative", marginBottom: "2rem" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: "1px solid rgba(168,213,181,0.5)",
                    outline: "1px dashed rgba(82,168,112,0.25)",
                    outlineOffset: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.6)",
                  }}
                >
                  <i
                    className={`ti ${p.icon}`}
                    aria-hidden="true"
                    style={{ fontSize: 28, color: "#2E7D4F" }}
                  />
                </div>
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -14,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#A8D5B5",
                    letterSpacing: "0.12em",
                  }}
                >
                  {p.num}
                </span>
              </div>

              {/* Title */}
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#1B4D2E",
                  lineHeight: 1.2,
                  marginBottom: "1rem",
                  whiteSpace: "pre-line",
                }}
              >
                {p.title}
              </div>

              {/* Body */}
              <p
                style={{
                  fontSize: 12,
                  color: "#4a7a5a",
                  lineHeight: 1.85,
                  maxWidth: 240,
                  margin: 0,
                }}
              >
                {p.body}
              </p>

              {/* Stat */}
              <div
                style={{
                  marginTop: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ width: 20, height: 1, background: "#52A870" }} />
                <div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 28,
                      fontWeight: 300,
                      color: "#52A870",
                      lineHeight: 1,
                    }}
                  >
                    {p.statVal}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#7aaa8a",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: 3,
                    }}
                  >
                    {p.statLabel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <section className={styles.productsSection} id="products">
        <div className={styles.sectionLabel}>Our Products</div>
        <div className={styles.sectionTitle}>
          Tissue solutions for
          <br />
          <strong>every environment</strong>
        </div>
        <p className={styles.sectionSub}>
          From hospitality suites to corporate washrooms, our range delivers the
          gentle strength that nature intended.
        </p>

        <div className={styles.productsGrid}>
          {/* Facial Tissue */}
          <div className={styles.productCard}>
            <div className={`${styles.productVisual} ${styles.pv1}`}>
              <div className={styles.productLeafBg} />
              <div className={styles.productIconWrap}>
                <div className={styles.tissueMini}>
                  <div className={styles.tmBack} />
                  <div className={styles.tmFront}>
                    <div className={styles.tmWave} />
                    <div className={styles.tmLines}>
                      <div className={styles.tmLine} />
                      <div className={styles.tmLine} />
                      <div className={styles.tmLine} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.productName}>Facial Tissue</div>
              <div className={styles.productDesc}>
                Ultra-soft 2-ply sheets infused with botanical extracts. Gentle
                on skin, gentle on the earth.
              </div>
              {/* <div className={styles.productTags}>
                <span className={styles.productTag}>2-PLY</span>
                <span className={styles.productTag}>ALOE VERA</span>
                <span className={styles.productTag}>HYPOALLERGENIC</span>
              </div> */}
            </div>
          </div>

          {/* Bathroom Tissue */}
          <div className={styles.productCard}>
            <div className={`${styles.productVisual} ${styles.pv2}`}>
              <div className={styles.productLeafBg} />
              <div className={styles.productIconWrap}>
                <div className={styles.rollMini}>
                  <div className={styles.rollInner} />
                </div>
              </div>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.productName}>Bathroom Tissue</div>
              <div className={styles.productDesc}>
                High-performance rolls engineered for commercial and household
                use. Dissolves naturally, sewage-safe.
              </div>
              {/* <div className={styles.productTags}>
                <span className={styles.productTag}>JUMBO ROLL</span>
                <span className={styles.productTag}>SEPTIC SAFE</span>
                <span className={styles.productTag}>3-PLY OPTION</span>
              </div> */}
            </div>
          </div>

          {/* Table Napkins */}
          <div className={styles.productCard}>
            <div className={`${styles.productVisual} ${styles.pv3}`}>
              <div className={styles.productLeafBg} />
              <div className={styles.productIconWrap}>
                <div className={styles.napkinMini}>
                  <div className={styles.napkinFold} />
                  <div
                    className={styles.napkinFold}
                    style={{ marginLeft: "6px", width: "60px" }}
                  />
                  <div
                    className={styles.napkinFold}
                    style={{ marginLeft: "3px", width: "65px" }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.productName}>Table Napkins</div>
              <div className={styles.productDesc}>
                Food-safe, lint-free napkins for restaurants, catering, and
                corporate dining. Available in custom sizes.
              </div>
              {/* <div className={styles.productTags}>
                <span className={styles.productTag}>FOOD-SAFE</span>
                <span className={styles.productTag}>LINT-FREE</span>
                <span className={styles.productTag}>CUSTOM SIZE</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── Nature / Sustainability ── */}
      <section
        id="sustainability"
        style={{
          background: "#0f2b19",
          padding: "5rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=60&fit=crop"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.28,
          }}
        />
        <div
          className={styles.natureBgLeaf}
          style={{
            width: 400,
            height: 600,
            background: "#50c177",
            top: -100,
            right: -80,
            transform: "rotate(15deg)",
            borderRadius: "50% 0 50% 0",
          }}
        />
        <div
          className={styles.natureBgLeaf}
          style={{
            width: 300,
            height: 400,
            background: "#A8D5B5",
            bottom: -80,
            left: -60,
            transform: "rotate(-20deg)",
            borderRadius: "0 50% 0 50%",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className={styles.sectionLabel} style={{ color: "#A8D5B5" }}>
            Our Commitment
          </div>
          <div className={styles.sectionTitle} style={{ color: "#E8F5EE" }}>
            Grown from nature,
            <br />
            <strong style={{ color: "#a7e667" }}>returned to nature</strong>
          </div>
        </div>

        <div className={styles.natureGrid}>
          {[
            {
              icon: <LeafIcon />,
              title: "Sustainable Sourcing",
              body: "All pulp sourced from FSC-certified forests. We partner exclusively with suppliers who uphold responsible forestry standards.",
              stat: "100%",
              unit: "certified pulp",
            },
            {
              icon: <CircleIcon />,
              title: "Zero-Waste Production",
              body: "Our manufacturing facilities operate on closed-loop water systems. Production waste is composted or repurposed into packaging materials.",
              stat: "82%",
              unit: "waste diverted from landfill",
            },
            {
              icon: <CheckIcon />,
              title: "Biodegradable Packaging",
              body: "Every product leaves our facility wrapped in plant-based packaging. No single-use plastics — period.",
              stat: "2027",
              unit: "full plastic-free target",
            },
            {
              icon: <TreeIcon />,
              title: "Carbon Offset Program",
              body: "Every order placed contributes to the Quanta Reforestation Initiative. We've planted over 120,000 trees in partnership with DENR.",
              stat: "120K+",
              unit: "trees planted nationwide",
            },
          ].map(({ icon, title, body, stat, unit }) => (
            <div className={styles.natureCard} key={title}>
              <div className={styles.natureIcon}>{icon}</div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className={styles.natureStat}>
                {stat} <span>{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Corporate ── */}
      <section className={styles.corpSection} id="corporate">
        <div className={styles.sectionLabel}>Corporate Profile</div>
        <div className={styles.sectionTitle}>
          Built on trust,
          <br />
          <strong>scaled for enterprise</strong>
        </div>

        <div className={styles.corpGrid}>
          <div className={styles.corpFacts}>
            {[
              {
                num: "25+",
                label:
                  "Years of manufacturing excellence in the Philippine tissue industry",
              },
              {
                num: "500+",
                label:
                  "Corporate and institutional clients across Luzon, Visayas, and Mindanao",
              },
              {
                num: "12M+",
                label:
                  "Units produced monthly at our ISO-certified production facility",
              },
            ].map(({ num, label }) => (
              <div className={styles.corpFact} key={num}>
                <div className={styles.corpFactNum}>{num}</div>
                <div className={styles.corpFactLabel}>{label}</div>
              </div>
            ))}
          </div>

          <div>
            <p
              style={{
                fontSize: 14,
                color: "#52A870",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              Rapture Cafe Bar Corporation has been a trusted name in the Philippine
              tissue industry for over two decades. We serve hotel chains,
              hospital networks, restaurant groups, and government offices with
              consistent quality, reliable logistics, and corporate-scale
              supply.
            </p>
            <div className={styles.corpCertGrid}>
              {[
                { label: "Quality", val: "ISO 9001:2015" },
                { label: "Environment", val: "ISO 14001:2015" },
                { label: "Forestry", val: "FSC Certified" },
                { label: "Food Safety", val: "BFAD Compliant" },
              ].map(({ label, val }) => (
                <div className={styles.corpCert} key={label}>
                  <div className={styles.certLabel}>{label}</div>
                  <div className={styles.certVal}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaLeafL} />
        <div className={styles.ctaLeafR} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className={styles.ctaTitle}>
            Ready to bring <strong>nature's softness</strong>
            <br />
            to your business?
          </div>
          <div className={styles.ctaSub}>
            Bulk orders · Custom branding · Nationwide delivery · Corporate
            accounts
          </div>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaBtnWhite}>Request a Quote</button>
            <button className={styles.ctaBtnOutline}>Download Catalog</button>
          </div>
        </div>
      </section>

      {/* ── AFH Section ── */}
      <section
        className="relative overflow-hidden px-8 pt-20 pb-16"
        style={{
          background:
            "linear-gradient(160deg, #eaf6ef 0%, #d6eedf 50%, #e8f5ee 100%)",
        }}
      >
        {/* White arch */}
        <div
          className="absolute top-0 left-0 right-0 h-16 bg-white"
          style={{ borderRadius: "0 0 50% 50% / 0 0 44px 44px" }}
        />

        <div className="relative z-[2] max-w-[960px] mx-auto">
          {/* Eyebrow pill */}
          <div className="text-center mb-5 pt-4">
            <div
              className="inline-flex items-center gap-2 text-white text-[11px] font-bold tracking-[0.20em] uppercase px-6 py-[7px] rounded-[40px]"
              style={{ background: "#1b4d2e" }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-[15px] h-[15px] flex-shrink-0"
                style={{
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 1.6,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                }}
                aria-hidden="true"
              >
                <path d="M3 9l1-5h16l1 5" />
                <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" />
                <path d="M9 21V12h6v9" />
              </svg>
              Away From Home
            </div>
          </div>

          {/* Heading */}
          <h2
            className="text-center font-bold mb-2 leading-snug"
            style={{ fontSize: "clamp(18px, 2.4vw, 26px)", color: "#1b4d2e" }}
          >
            Tissue and hygiene essentials for your business needs
          </h2>

          {/* Subhead — #a7e667 removed, now muted green */}
          <p
            className="text-center text-[13px] font-medium leading-[1.9] mb-12"
            style={{ color: "#52a870" }}
          >
            Crafted from nature. Trusted by institutions across the Philippines.
          </p>

          {/* Divider — #a7e667 removed, solid green */}
          <div
            className="w-12 h-[3px] rounded-sm mx-auto mb-11"
            style={{ background: "#1b4d2e" }}
          />

          {/* Brand grid */}
          <div className="grid grid-cols-5 gap-x-[1.2rem] gap-y-8 mb-4 max-[780px]:grid-cols-3 max-[480px]:grid-cols-2">
            {[...row1, ...row2, ...row3].map((b, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-[0.65rem] cursor-pointer group"
              >
                <div
                  className="w-[116px] h-[116px] rounded-full bg-white flex items-center justify-center overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-[3px]"
                  style={{
                    border: "2px solid #b8dfc8",
                    boxShadow: "0 3px 12px rgba(27,77,46,0.09)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 22px rgba(27,77,46,0.20)";
                    e.currentTarget.style.borderColor = "#52a870";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 3px 12px rgba(27,77,46,0.09)";
                    e.currentTarget.style.borderColor = "#b8dfc8";
                  }}
                >
                  {loaded && spriteRef.current ? (
                    <BrandCanvas
                      brand={b}
                      outW={GRID_W}
                      outH={GRID_H}
                      spriteImg={spriteRef.current}
                    />
                  ) : (
                    <span
                      className="text-[10px] font-semibold text-center p-2"
                      style={{ color: "#1b4d2e" }}
                    >
                      {b.label}
                    </span>
                  )}
                </div>
                <span
                  className="text-[11.5px] font-semibold text-center leading-[1.45]"
                  style={{ color: "#1b4d2e" }}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative"
        style={{ background: "#1b4d2e" }}
      >
        {/* Subtle leaf decorations */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: -60,
            top: 40,
            width: 260,
            height: 380,
            background: "rgba(82,168,112,0.07)",
            borderRadius: "50% 0 50% 0",
            transform: "rotate(15deg)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            left: -50,
            bottom: 20,
            width: 200,
            height: 300,
            background: "rgba(168,213,181,0.06)",
            borderRadius: "0 50% 0 50%",
            transform: "rotate(-20deg)",
          }}
        />

        {/* Curved arch at top — matches AFH section colour above */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: -1,
            height: 64,
            background: "#e8f5ee",
            borderRadius: "0 0 50% 50% / 0 0 56px 56px",
            zIndex: 3,
          }}
        />

        <div className="relative z-[2] max-w-[1100px] mx-auto px-10 pt-14">
          {/* Brand row 1 */}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 pb-10 mb-10">
            {loaded &&
              spriteRef.current &&
              row1.map((b, i) => (
                <BrandCanvas
                  key={i}
                  brand={b}
                  outW={FOOT1_W}
                  outH={FOOT1_H}
                  spriteImg={spriteRef.current}
                  className="block opacity-90 cursor-pointer transition-all duration-200 hover:opacity-100 hover:scale-[1.06]"
                />
              ))}
          </div>

          {/* Brand row 2 */}
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 pb-8 mb-8">
            {loaded &&
              spriteRef.current &&
              row2.map((b, i) => (
                <BrandCanvas
                  key={i}
                  brand={b}
                  outW={FOOT2_W}
                  outH={FOOT2_H}
                  spriteImg={spriteRef.current}
                  className="block opacity-90 cursor-pointer transition-all duration-200 hover:opacity-100 hover:scale-[1.06]"
                />
              ))}
          </div>

          {/* Brand row 3 */}
          <div className="flex justify-center items-center gap-12 pb-10 mb-11">
            {loaded &&
              spriteRef.current &&
              row3.map((b, i) => (
                <BrandCanvas
                  key={i}
                  brand={b}
                  outW={FOOT3_W}
                  outH={FOOT3_H}
                  spriteImg={spriteRef.current}
                  className="block opacity-90 cursor-pointer transition-all duration-200 hover:opacity-100 hover:scale-[1.06]"
                />
              ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(168,213,181,0.15)", marginBottom: "2.5rem" }} />

          {/* Nav */}
          <nav
            className="grid gap-8 items-start pb-10 max-[780px]:grid-cols-2 max-[480px]:grid-cols-1"
            style={{ gridTemplateColumns: "200px 1fr 1fr 1fr auto" }}
          >
            {/* Logo block */}
            <div className="flex flex-col items-start gap-[10px]">
              <div
                className="w-[62px] h-[62px] rounded-lg flex items-center justify-center"
                style={{
                  border: "2px solid rgba(168,213,181,0.4)",
                  background: "rgba(255,255,255,0.12)",
                }}
              >
                <svg width="34" height="34" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <circle cx="13" cy="13" r="12" stroke="#A8D5B5" strokeWidth="1.5" />
                  <path d="M13 3 Q20 8 17 16 Q13 22 9 16 Q6 8 13 3Z" fill="#52A870" />
                  <circle cx="13" cy="13" r="4" fill="#1B4D2E" />
                </svg>
              </div>
              <div>
                <div
                  className="text-[13px] font-bold tracking-[0.08em] uppercase leading-tight"
                  style={{ color: "#E8F5EE" }}
                >
                  Rapture Cafe Bar
                </div>
                {/* #a7e667 removed — now muted green */}
                <div
                  className="text-[9.5px] tracking-[0.22em] uppercase font-semibold"
                  style={{ color: "#52a870" }}
                >
                  Corporation
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col gap-1">
              {["Explore Sweet Baby", "Shop From Home"].map((label, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-[13px] font-medium inline-flex items-center gap-1.5 py-1 no-underline transition-colors duration-200 hover:opacity-70"
                  style={{ color: "#C5E0CC" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[13px] h-[13px] flex-shrink-0 opacity-70"
                    style={{
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: 2,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                    }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  {label}
                </a>
              ))}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-1.5">
              {/* #a7e667 removed — now muted green */}
              <h4
                className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1"
                style={{ color: "#52a870" }}
              >
                Company
              </h4>
              {["Careers", "What's New", "Contact Us"].map((l, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-[13px] font-normal no-underline py-0.5 transition-all duration-200 hover:text-white hover:font-semibold"
                  style={{ color: "#C5E0CC" }}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1.5">
              {/* #a7e667 removed — now muted green */}
              <h4
                className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1"
                style={{ color: "#52a870" }}
              >
                Info
              </h4>
              {["About Us", "Brands"].map((l, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-[13px] font-normal no-underline py-0.5 transition-all duration-200 hover:text-white hover:font-semibold"
                  style={{ color: "#C5E0CC" }}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="flex flex-col gap-2.5 items-end max-[780px]:items-start">
              {/* #a7e667 removed — now muted green */}
              <h4
                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: "#52a870" }}
              >
                Follow Us!
              </h4>
              <div className="flex gap-2.5 flex-wrap justify-end">
                {[
                  {
                    label: "Facebook",
                    d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                  },
                  {
                    label: "Twitter",
                    d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
                  },
                  {
                    label: "LinkedIn",
                    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
                    extra: (
                      <>
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </>
                    ),
                  },
                  { label: "TikTok", d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" },
                ].map(({ label, d, extra }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center no-underline cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1.5px solid rgba(168,213,181,0.35)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#52A870";
                      e.currentTarget.style.borderColor = "#52A870";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.borderColor = "rgba(168,213,181,0.35)";
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 transition-all duration-200"
                      style={{
                        fill: "none",
                        stroke: "#A8D5B5",
                        strokeWidth: 1.8,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }}
                    >
                      <path d={d} />
                      {extra}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Copyright */}
        <div
          className="relative z-[2] text-center text-[11.5px] font-medium tracking-[0.06em] px-10 py-4 opacity-70"
          style={{ color: "rgba(168,213,181,0.6)" }}
        >
          COPYRIGHT 2026 RAPITURE COMEDY BAR & CAFE CORPORATION
        </div>
      </footer>

      
    </div>
  );
}
