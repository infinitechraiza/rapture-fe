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
        background: "linear-gradient(135deg, #0a1a4e, #4e0a2d)",
        padding: "clamp(2rem, 8vw, 5rem) clamp(1rem, 4vw, 1.5rem)",
        fontFamily: "'Space Grotesk', sans-serif",
        color: "#fff",
      }}
    >
      

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