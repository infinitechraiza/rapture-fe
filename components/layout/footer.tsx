"use client";

export function Footer() {
  return (
    <footer>
      <div className="footer-inner px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="footer-grid grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="footer-brand sm:col-span-2 lg:col-span-1">
            <a href="#home" className="footer-logo-wrap flex items-center gap-2">
              <div className="logo-icon">🌈</div>
              <div>
                <div className="logo-text">PRISMA</div>
                <div className="logo-sub">Gay Bar &amp; Café</div>
              </div>
            </a>
            <p className="footer-desc mt-4 max-w-sm">
              A vibrant LGBTQ+ safe space in the heart of Quezon City. Come for
              the drinks, stay for the family. Open daily from 6PM.
            </p>
            <div className="social-links mt-4 flex flex-wrap gap-2">
              <a href="#" className="social-btn">
                📘
              </a>
              <a href="#" className="social-btn">
                📸
              </a>
              <a href="#" className="social-btn">
                🐦
              </a>
              <a href="#" className="social-btn">
                🎵
              </a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Navigate</div>
            <ul className="footer-links mt-3 flex flex-col gap-2">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#events">Events &amp; Shows</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
              <li>
                <a href="#membership">Membership</a>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links mt-3 flex flex-col gap-2">
              <li>
                <a href="#reservation">Table Reservations</a>
              </li>
              <li>
                <a href="#events">Event Tickets</a>
              </li>
              <li>
                <a href="#membership">VIP Membership</a>
              </li>
              <li>
                <a href="#reservation">Online Ordering</a>
              </li>
              <li>
                <a href="#">Private Events</a>
              </li>
              <li>
                <a href="#">Corporate Bookings</a>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Get in Touch</div>
            <div className="footer-contact-item mt-3 flex items-start gap-2">
              <span>📍</span>
              <span>123 Tomas Morato Ave., Quezon City</span>
            </div>
            <div className="footer-contact-item mt-2 flex items-start gap-2">
              <span>📞</span>
              <span>+63 917 PRISMA0</span>
            </div>
            <div className="footer-contact-item mt-2 flex items-start gap-2">
              <span>✉️</span>
              <span>hello@prismabar.ph</span>
            </div>
            <div className="footer-contact-item mt-2 flex items-start gap-2">
              <span>🕐</span>
              <span>Open Daily · 6PM–4AM</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-10 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="footer-copy">
            © 2025 PRISMA Gay Bar &amp; Café. All rights reserved. 18+ Only.
          </div>
          <div className="footer-pride">
            Made with love for the community 🏳️‍🌈
          </div>
        </div>
      </div>
    </footer>
  );
}