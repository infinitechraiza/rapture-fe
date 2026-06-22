"use client";

import { useState } from "react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const faqs = [
    { q: "Do I need to reserve?", a: "Walk-ins are welcome but seats fill up fast, especially on weekends. We recommend booking at least 24 hours ahead." },
    { q: "What's included with my reservation?", a: "Your reservation holds your table for up to 2 hours. Drinks and food are ordered separately at the bar or through your server." },
    { q: "What's your minimum age?", a: "All ages are welcome before 9PM. After 9PM, the venue is strictly 18+ and valid ID is required at the door." },
    { q: "Can I cancel or reschedule?", a: "Yes — cancellations and changes are free up to 4 hours before your booking. Message us at hello@prismabar.ph." },
    { q: "Is the venue accessible?", a: "Yes. We have step-free access, accessible restrooms, and staff trained to assist. Reach out ahead and we'll make sure everything's ready." },
  ];

  return (
    <section id="contact" style={{
      minHeight: "100vh",
      background: "#070b14",
      padding: "5rem 1.5rem",
      fontFamily: "'Space Grotesk', sans-serif",
      color: "#fff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .contact-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          color: #fff;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.25); }
        .contact-input:focus { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 0 3px rgba(0,212,255,0.08); }
        textarea.contact-input { resize: vertical; min-height: 120px; }
        .contact-btn {
          background: linear-gradient(135deg, #00d4ff, #ff2d9b);
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 700;
          padding: 13px 28px;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 0 20px rgba(255,45,155,0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .contact-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .info-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.5rem;
        }
        .icon-pill {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
        }
        .faq-item:last-child { border-bottom: none; }
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          gap: 12px;
        }
        .faq-answer {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          padding-bottom: 1rem;
        }
        .hours-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 13px;
        }
        .hours-row:last-child { border-bottom: none; }
        .ghost-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          color: rgba(255,255,255,0.75);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 9px 18px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s, border-color 0.2s;
        }
        .ghost-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .neon-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #00d4ff;
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div className="neon-tag" style={{ marginBottom: 12 }}>Visit · Call · Message</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700,
          margin: "0 0 12px",
          lineHeight: 1.15,
        }}>
          Find Us in{" "}
          <span style={{
            background: "linear-gradient(90deg, #ff2d9b, #00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Tomas Morato
          </span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
          Right beside the Pinoy Big Brother House and ABS-CBN compound. Doors open at 6PM, daily.
        </p>
      </div>

      {/* Main grid */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: "2rem",
        alignItems: "start",
      }}>

        {/* LEFT — Message form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="info-card">
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 17, fontWeight: 700 }}>Send us a message</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                For private bookings, group reservations, sponsorships, and press inquiries.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Full Name</label>
                <input className="contact-input" placeholder="Your name" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Email</label>
                <input className="contact-input" type="email" placeholder="hello@email.com" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Phone</label>
                <input className="contact-input" type="tel" placeholder="+63 9XX XXX XXXX" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Subject</label>
                <input className="contact-input" placeholder="e.g. Group Booking" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Message</label>
              <textarea className="contact-input" placeholder="Tell us what you need…" />
            </div>

            <button className="contact-btn">
              Send Message
            </button>
          </div>

          {/* FAQ */}
          <div className="info-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>FAQ</span>
            </div>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span style={{
                    fontSize: 18,
                    color: "rgba(255,255,255,0.3)",
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}>+</span>
                </div>
                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Info column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Visit us */}
          <div className="info-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>Visit Us</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "📌", label: "7 Sct. Albano, Brgy. South Triangle\nQuezon City, Philippines" },
                { icon: "🕐", label: "Daily 6:00 PM – 4:00 AM" },
                { icon: "📞", label: "+63 917 182 3197" },
                { icon: "📞", label: "+63 995 227 5366" },
                { icon: "📧", label: "hello@prismabar.ph" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div className="icon-pill">{item.icon}</div>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, paddingTop: 8, whiteSpace: "pre-line" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: "1.25rem" }}>
              <button className="ghost-btn">Get Directions</button>
              <button className="ghost-btn">Call</button>
            </div>
          </div>

          {/* Hours */}
          <div className="info-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>Hours of Operation</span>
            </div>

            {[
              { day: "Monday – Thursday", time: "6PM – 2AM", special: false },
              { day: "Friday", time: "6PM – 4AM", special: true },
              { day: "Saturday", time: "10AM – 4AM", special: true },
              { day: "Sunday", time: "10AM – 2AM", special: false },
            ].map((row, i) => (
              <div key={i} className="hours-row">
                <span style={{ color: "rgba(255,255,255,0.55)" }}>{row.day}</span>
                <span style={{
                  fontWeight: 600,
                  color: row.special ? "#ff2d9b" : "rgba(255,255,255,0.85)",
                  fontSize: 13,
                }}>
                  {row.time}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#ff2d9b" }}>
              <span>Café: Fri–Sun from 10AM</span>
              <span>18+ after 9PM</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="info-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>Newsletter</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 1rem" }}>
              Get show drops, promo codes, and headliner picks straight to your inbox.
            </p>

            {subscribed ? (
              <div style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 13,
                color: "#00d4ff",
              }}>
                ✓ You're on the list — stay fabulous!
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="contact-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  className="contact-btn"
                  style={{ padding: "12px 18px" }}
                  onClick={() => { if (email) setSubscribed(true); }}
                >
                  ⚡
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}