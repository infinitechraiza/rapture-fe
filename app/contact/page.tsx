"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  HelpCircle,
  Send,
  MessageSquare,
  Bell,
} from "lucide-react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const faqs = [
    {
      q: "Do I need to reserve?",
      a: "Walk-ins are welcome but seats fill up fast, especially on weekends. We recommend booking at least 24 hours ahead.",
    },
    {
      q: "What's included with my reservation?",
      a: "Your reservation holds your table for up to 2 hours. Drinks and food are ordered separately at the bar or through your server.",
    },
    {
      q: "What's your minimum age?",
      a: "All ages are welcome before 9PM. After 9PM, the venue is strictly 18+ and valid ID is required at the door.",
    },
    {
      q: "Can I cancel or reschedule?",
      a: "Yes — cancellations and changes are free up to 4 hours before your booking. Message us at hello@prismabar.ph.",
    },
    {
      q: "Is the venue accessible?",
      a: "Yes. We have step-free access, accessible restrooms, and staff trained to assist. Reach out ahead and we'll make sure everything's ready.",
    },
  ];

  const CardHeader = ({
    icon: Icon,
    title,
    subtitle,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
  }) => (
    <>
      <div
        style={{
          height: 4,
          background: "linear-gradient(90deg, #00d4ff, #b94fff, #ff2d9b)",
          width: "100%",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "clamp(12px, 2vw, 16px)",
          borderBottom: "1px solid rgba(0,212,255,0.1)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(255,45,155,0.1))",
            border: "1px solid rgba(0,212,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} style={{ color: "#00d4ff" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: "clamp(13px, 2.5vw, 15px)",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "clamp(9px, 1.5vw, 11px)",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.5px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <section
      id="contact"
      style={{
        minHeight: "100vh",
        background: "#070b14",
        padding: "clamp(2rem, 8vw, 5rem) clamp(1rem, 4vw, 1.5rem)",
        fontFamily: "'Space Grotesk', sans-serif",
        color: "#fff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        .contact-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(12px, 2vw, 14px);
          color: #fff;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        
        .contact-input::placeholder { 
          color: rgba(255,255,255,0.35); 
        }
        
        .contact-input:focus { 
          border-color: rgba(0,212,255,0.5); 
          box-shadow: 0 0 12px rgba(0,212,255,0.2);
          background: rgba(0,212,255,0.05);
        }
        
        textarea.contact-input { 
          resize: vertical; 
          min-height: 120px; 
        }
        
        .contact-btn {
          background: linear-gradient(135deg, #00d4ff, #ff2d9b);
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(12px, 2vw, 14px);
          font-weight: 700;
          padding: clamp(10px, 2vw, 13px) clamp(20px, 4vw, 28px);
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 0 20px rgba(255,45,155,0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        
        .contact-btn:hover { 
          opacity: 0.88; 
          transform: translateY(-1px);
          box-shadow: 0 0 30px rgba(255,45,155,0.5);
        }

        .info-card {
          background: #0d0d2b;
          border: 1px solid rgba(0, 212, 255, 0.25);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(185,79,255,0.08) 50%, transparent 80%);
          pointer-events: none;
        }

        .info-card:hover {
          border-color: rgba(0,212,255,0.35);
          box-shadow: 0 0 60px rgba(0,212,255,0.12);
        }
        
        .card-body {
          padding: clamp(1rem, 3vw, 1.5rem);
          position: relative;
          z-index: 1;
        }
        
        .faq-item {
          border-bottom: 1px solid rgba(0,212,255,0.08);
          cursor: pointer;
        }
        
        .faq-item:last-child { 
          border-bottom: none; 
        }
        
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          font-size: clamp(12px, 2vw, 14px);
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          gap: 12px;
          transition: color 0.2s;
        }
        
        .faq-question:hover {
          color: #00d4ff;
        }
        
        .faq-answer {
          font-size: clamp(11px, 1.8vw, 13px);
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          padding-bottom: 1rem;
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hours-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0,212,255,0.08);
          font-size: clamp(11px, 1.8vw, 13px);
          gap: 8px;
        }
        
        .hours-row:last-child { 
          border-bottom: none; 
        }
        
        .hours-day {
          color: rgba(255,255,255,0.65);
          font-weight: 500;
          flex: 1;
          min-width: 0;
        }
        
        .hours-time {
          color: #00d4ff;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .hours-time.special {
          color: #ff2d9b;
        }
        
        .ghost-btn {
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 999px;
          color: #00d4ff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(11px, 1.8vw, 13px);
          font-weight: 600;
          padding: clamp(8px, 2vw, 10px) clamp(14px, 3vw, 20px);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        
        .ghost-btn:hover { 
          background: rgba(0,212,255,0.15); 
          border-color: rgba(0,212,255,0.4);
          box-shadow: 0 0 16px rgba(0,212,255,0.25);
        }
        
        .neon-tag {
          font-size: clamp(9px, 1.8vw, 11px);
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #00d4ff;
        }
        
        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(0,212,255,0.08);
        }
        
        .contact-info-item:last-child {
          border-bottom: none;
        }
        
        .contact-info-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 10px;
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: clamp(2rem, 6vw, 4rem);
        }

        .section-header h2 {
          font-family: "'Playfair Display', serif";
          font-size: clamp(1.75rem, 6vw, 3rem);
          font-weight: 700;
          margin: 0 0 clamp(8px, 2vw, 12px);
          line-height: 1.15;
        }

        .section-header p {
          color: rgba(255,255,255,0.4);
          font-size: clamp(13px, 2.5vw, 15px);
          max-width: 480px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 2vw, 2rem);
        }

        .main-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: clamp(1.5rem, 4vw, 2rem);
          align-items: start;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: clamp(1rem, 2vw, 1.5rem);
        }

        /* Tablet Breakpoint */
        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr;
            gap: clamp(1.2rem, 3vw, 1.8rem);
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        /* Mobile Breakpoint */
        @media (max-width: 768px) {
          .contact-input {
            padding: 10px 14px;
          }

          .form-row {
            gap: 10px;
          }

          .button-group {
            gap: 8px;
          }

          .ghost-btn {
            flex: 1;
            justify-content: center;
            min-width: 100px;
          }

          .contact-btn {
            width: 100%;
            justify-content: center;
          }

          .contact-info-icon {
            width: 32px;
            height: 32px;
          }

          .section-header p {
            padding: 0 clamp(0.5rem, 2vw, 1rem);
          }
        }

        /* Small Mobile Breakpoint */
        @media (max-width: 480px) {
          section {
            padding: clamp(1.5rem, 5vw, 2rem) clamp(0.75rem, 3vw, 1rem) !important;
          }

          .card-body {
            padding: clamp(0.75rem, 2vw, 1rem);
          }

          .contact-input {
            padding: 10px 12px;
            font-size: 13px;
          }

          .faq-question {
            padding: 0.75rem 0;
          }

          .hours-row {
            padding: 10px 0;
            flex-wrap: wrap;
          }

          .hours-day {
            flex-basis: 100%;
            margin-bottom: 4px;
          }

          .hours-time {
            flex-basis: 100%;
            text-align: right;
          }

          .contact-info-item {
            padding: 12px 0;
            gap: 10px;
          }

          .contact-btn {
            padding: 11px clamp(16px, 3vw, 20px);
            font-size: 12px;
          }

          .ghost-btn {
            flex: 1;
            padding: 9px clamp(12px, 2vw, 14px);
            font-size: 11px;
            min-height: 36px;
          }

          .button-group {
            width: 100%;
          }

          textarea.contact-input {
            min-height: 100px;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .section-header h2 {
            font-size: clamp(1.5rem, 5vw, 2rem);
          }

          .form-row {
            gap: 8px;
          }

          .contact-input {
            padding: 9px 10px;
            border-radius: 8px;
          }

          .card-body {
            padding: clamp(0.5rem, 1.5vw, 0.75rem);
          }

          .contact-info-icon {
            width: 28px;
            height: 28px;
          }
        }

        /* Landscape Mobile */
        @media (max-height: 600px) and (max-width: 768px) {
          textarea.contact-input {
            min-height: 80px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="section-header">
        <div className="neon-tag" style={{ marginBottom: 12, display: 'inline-block' }}>
          Visit · Call · Message
        </div>
        <h2>
          Find Us in{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #ff2d9b, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tomas Morato
          </span>
        </h2>
        <p>
          Right beside the Pinoy Big Brother House and ABS-CBN compound. Doors
          open at 6PM, daily.
        </p>
      </div>

      {/* Main grid */}
      <div className="main-grid">
        {/* LEFT — Message form & FAQ */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "clamp(1.2rem, 3vw, 1.5rem)" }}
        >
          {/* Message Form Card */}
          <div className="info-card">
            <CardHeader
              icon={MessageSquare}
              title="Send us a message"
              subtitle="Private bookings, group reservations & more"
            />
            <div className="card-body">
              <div className="form-row">
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "clamp(11px, 1.8vw, 12px)",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Full Name
                  </label>
                  <input className="contact-input" placeholder="Your name" />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "clamp(11px, 1.8vw, 12px)",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </label>
                  <input
                    className="contact-input"
                    type="email"
                    placeholder="hello@email.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "clamp(11px, 1.8vw, 12px)",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Phone
                  </label>
                  <input
                    className="contact-input"
                    type="tel"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "clamp(11px, 1.8vw, 12px)",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Subject
                  </label>
                  <input
                    className="contact-input"
                    placeholder="e.g. Group Booking"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "clamp(11px, 1.8vw, 12px)",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  Message
                </label>
                <textarea
                  className="contact-input"
                  placeholder="Tell us what you need…"
                />
              </div>

              <button className="contact-btn">
                <Send size={14} />
                Send Message
              </button>
            </div>
          </div>

          {/* FAQ Card */}
          <div className="info-card">
            <CardHeader
              icon={HelpCircle}
              title="Frequently Asked Questions"
              subtitle="5 common questions answered"
            />
            <div className="card-body">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="faq-item"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <span
                      style={{
                        fontSize: "clamp(14px, 3vw, 18px)",
                        color: "rgba(255,255,255,0.3)",
                        transform: openFaq === i ? "rotate(45deg)" : "none",
                        transition: "transform 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  </div>
                  {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Info column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "clamp(1.2rem, 3vw, 1.5rem)" }}
        >
          {/* Visit Us Card */}
          <div className="info-card">
            <CardHeader
              icon={MapPin}
              title="Visit Us"
              subtitle="Our location & contact details"
            />
            <div className="card-body">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value:
                    "7 Sct. Albano, Brgy. South Triangle\nQuezon City, Philippines",
                },
                {
                  icon: Clock,
                  label: "Hours",
                  value: "Daily 6:00 PM – 4:00 AM",
                },
                { icon: Phone, label: "Phone", value: "+63 917 182 3197" },
                { icon: Phone, label: "Phone", value: "+63 995 227 5366" },
                { icon: Mail, label: "Email", value: "hello@prismabar.ph" },
              ].map((item, i) => (
                <div key={i} className="contact-info-item">
                  <div className="contact-info-icon">
                    <item.icon size={16} />
                  </div>
                  <span
                    style={{
                      fontSize: "clamp(12px, 2vw, 13px)",
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}

              <div className="button-group">
                <button className="ghost-btn">Get Directions</button>
                <button className="ghost-btn">Call</button>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="info-card">
            <CardHeader
              icon={Clock}
              title="Hours of Operation"
              subtitle="When we're open"
            />
            <div className="card-body">
              {[
                { day: "Monday – Thursday", time: "6PM – 2AM", special: false },
                { day: "Friday", time: "6PM – 4AM", special: true },
                { day: "Saturday", time: "10AM – 4AM", special: true },
                { day: "Sunday", time: "10AM – 2AM", special: false },
              ].map((row, i) => (
                <div key={i} className="hours-row">
                  <span className="hours-day">{row.day}</span>
                  <span
                    className={`hours-time ${row.special ? "special" : ""}`}
                  >
                    {row.time}
                  </span>
                </div>
              ))}

              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(0,212,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: "clamp(10px, 1.6vw, 11px)",
                  color: "#ff2d9b",
                }}
              >
                <span>☕ Café: Fri–Sun from 10AM</span>
                <span>🔞 18+ after 9PM</span>
              </div>
            </div>
          </div>

          {/* Newsletter Card */}
          <div className="info-card">
            <CardHeader
              icon={Bell}
              title="Newsletter"
              subtitle="Get updates & exclusive offers"
            />
            <div className="card-body">
              {subscribed ? (
                <div
                  style={{
                    background: "rgba(0,212,255,0.08)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontSize: "clamp(12px, 2vw, 13px)",
                    color: "#00d4ff",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span>✓</span>
                  <span>You're on the list — stay fabulous!</span>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input
                    className="contact-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ flex: 1, minWidth: "120px" }}
                  />
                  <button
                    className="contact-btn"
                    style={{ padding: "clamp(10px, 2vw, 12px) clamp(14px, 3vw, 18px)", flexShrink: 0 }}
                    onClick={() => {
                      if (email) setSubscribed(true);
                    }}
                  >
                    ⚡
                  </button>
                </div>
              )}
              <p
                style={{
                  fontSize: "clamp(11px, 1.8vw, 12px)",
                  color: "rgba(255,255,255,0.35)",
                  marginTop: 12,
                  marginBottom: 0,
                  lineHeight: 1.5,
                }}
              >
                Get show drops, promo codes, and headliner picks straight to
                your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}