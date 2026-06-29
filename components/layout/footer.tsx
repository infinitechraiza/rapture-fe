import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Music } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Events & Shows", href: "/shows" },
  { label: "Comedians", href: "/commedians" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Find Us", href: "/contact" },
];
const SERVICES = [
  { label: "Table Reservations", href: "/booking" },
  { label: "Event Tickets", href: "/shows" },
  { label: "VIP Membership", href: "/vip" },
  { label: "Online Ordering", href: "/order" },
  { label: "Private Events", href: "/contact" },
  { label: "Corporate Bookings", href: "/contact" },
];

export function Footer() {
  return (
    <footer style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(170deg, #1a0a35 0%, #0e0828 35%, #0a0a28 65%, #12062a 100%)",
      borderTop: "1px solid rgba(185,79,255,0.28)",
    }}>
      {/* ambient top glow */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 3, background: "linear-gradient(90deg,transparent,var(--neon-purple),var(--neon-pink),var(--neon-blue),transparent)", opacity: 0.7, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -80, left: "20%",  width: 360, height: 360, background: "radial-gradient(circle,rgba(185,79,255,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -60, right: "15%", width: 300, height: 300, background: "radial-gradient(circle,rgba(255,45,155,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "40%", width: 400, height: 200, background: "radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 32px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 48, marginBottom: 52 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,var(--neon-blue),var(--neon-purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌈</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: 2 }}>RAPTURE</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Comedy Bar & Café</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: 250, marginBottom: 20 }}>
              A vibrant LGBTQ+ safe space in Quezon City. Open daily from 6PM. Come for the drinks, stay for the family.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { Icon: Facebook,  href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Twitter,   href: "#" },
                { Icon: Music,     href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(185,79,255,0.3)", background: "rgba(185,79,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "all .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(185,79,255,0.25)"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,79,255,0.6)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(185,79,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,79,255,0.3)"; }}
                ><Icon size={15} /></a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--neon-purple)", marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid rgba(185,79,255,0.18)" }}>Navigate</div>
            {NAV.map((item, i) => (
              <a key={i} href={item.href} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 14, textDecoration: "none", marginBottom: 11, transition: "color .2s, padding-left .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.paddingLeft = "6px"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
              >{item.label}</a>
            ))}
          </div>

          {/* Services */}
          <div>
            <div className="footer-links" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--neon-pink)", marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid rgba(255,45,155,0.18)" }}>Services</div>
            {SERVICES.map((item, i) => (
              <a key={i} href={item.href} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 14, textDecoration: "none", marginBottom: 11, transition: "color .2s, padding-left .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.paddingLeft = "6px"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
              >{item.label}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--neon-blue)", marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid rgba(0,212,255,0.18)" }}>Get in Touch</div>
            {[
              { Icon: MapPin, text: "123 Tomas Morato Ave., Quezon City, Metro Manila" },
              { Icon: Phone,  text: "+63 917 RAPTURE" },
              { Icon: Mail,   text: "hello@raptureqc.ph" },
              { Icon: Clock,  text: "Open Daily · 6PM–4AM  (Café from 10AM)" },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 14, alignItems: "flex-start", lineHeight: 1.55 }}>
                <Icon size={14} style={{ color: "var(--neon-blue)", flexShrink: 0, marginTop: 2 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(185,79,255,0.15)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>© 2025 RAPTURE Comedy Bar & Café. All rights reserved. 18+ Only.</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Made with love for the community 🏳️‍🌈</div>
        </div>
      </div>
    </footer>
  );
}
