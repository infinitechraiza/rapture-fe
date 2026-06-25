"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Download,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "shows", label: "Shows" },
  { href: "commedians", label: "Commedians" },
  { href: "gallery", label: "Gallery" },
  { href: "contact", label: "Find Us" },
  { href: "myreservations", label: "My reservations" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, loading, logout } = useAuth();

  const getProfileImageUrl = (profileUrl?: string | null): string | null => {
    if (!profileUrl || profileUrl.trim() === "") return null;
    try {
      if (
        profileUrl.startsWith("http://") ||
        profileUrl.startsWith("https://")
      ) {
        new URL(profileUrl);
        return profileUrl;
      }
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const cleanPath = profileUrl.startsWith("/")
        ? profileUrl
        : `/${profileUrl}`;
      const fullUrl = `${baseUrl}${cleanPath}`;
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.error("Invalid profile URL:", {
        profileUrl,
        error: error instanceof Error ? error.message : "Unknown error",
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
      });
      return null;
    }
  };

  const profileImageUrl = getProfileImageUrl(user?.profile_url);
  const showProfileImage = Boolean(profileImageUrl) && !imageError;

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash || "/");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const OFFSET = 100;
    const onScroll = () => {
      let current = "";
      NAV_LINKS.forEach(({ href }) => {
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - OFFSET) {
          current = href;
        }
      });
      setActiveHash((prev) => (prev !== current ? current : prev));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [user?.profile_url]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Already Installed",
        description:
          "The app is already installed or not installable on this device",
      });
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      toast({
        variant: "success",
        title: "App Installed!",
        description: "RAPTURE has been added to your home screen",
      });
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);

    try {
      await logout();
      toast({
        variant: "success",
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (err) {
      console.error("Logout error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to logout. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = useCallback((href: string) => {
    setActiveHash(href);
    setIsMenuOpen(false);
  }, []);

  return (
    <header
      className="site-header sticky top-0 z-50"
      style={{
        // Forces this header into its own top-level stacking context
        // with a very high z-index, so no descendant of any sibling
        // section (e.g. a hero canvas) can ever paint above it,
        // regardless of that section's own internal z-index values.
        isolation: "isolate",
        zIndex: 9999,
        position: "sticky",
        top: 0,
      }}
    >
      <nav className="nav flex items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="nav-logo flex items-center gap-2 shrink-0"
          onClick={() => handleNavClick("/")}
        >
          <div className="logo-icon" />
          <div>
            <div className="logo-text">RAPTURE</div>
            <div className="logo-sub text-xs sm:text-sm">
              Comedy Bar &amp; Café
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="nav-links hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={activeHash === link.href ? "active" : ""}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions hidden lg:flex items-center gap-3">
          <a
            href="booking"
            className="nav-cta"
            onClick={() => handleNavClick("booking")}
          >
            Book a Table
          </a>
          {isInstallable && (
            <button onClick={handleInstallClick} className="nav-install">
              <Download className="w-4 h-4" />
              Install App
            </button>
          )}

          {loading ? (
            <div className="nav-spinner" aria-label="Loading" />
          ) : user ? (
            <div className="nav-user relative">
              <button
                className="nav-user-trigger flex items-center gap-2"
                onClick={() => setIsUserMenuOpen((v) => !v)}
                aria-expanded={isUserMenuOpen}
              >
                <span className="user-avatar inline-flex items-center justify-center overflow-hidden rounded-full">
                  {showProfileImage && profileImageUrl ? (
                    <Image
                      width={32}
                      height={32}
                      src={profileImageUrl}
                      alt="Profile"
                      onError={() => setImageError(true)}
                      unoptimized
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </span>
                <span className="nav-user-name">{user.first_name}</span>
                <ChevronDown
                  className={`chevron w-4 h-4 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown absolute right-0 top-full mt-2 min-w-[220px] z-50">
                  <div className="user-dropdown-header">
                    <p className="user-dropdown-name">{user.name}</p>
                    <p className="user-dropdown-email truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    className="user-dropdown-link flex items-center gap-2"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>

                  <Link
                    href="/admin"
                    className="user-dropdown-link flex items-center gap-2"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <button
                    className="user-dropdown-logout flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? "Logging out…" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="nav-login">
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="nav-toggle lg:hidden p-2"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile navigation panel */}
      {isMenuOpen && (
        <div className="nav-mobile lg:hidden flex flex-col gap-4 px-4 pb-4 sm:px-6">
          <ul className="nav-mobile-links flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={activeHash === link.href ? "active" : ""}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="nav-install nav-install-mobile flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          )}

          <div className="nav-mobile-actions flex flex-col gap-3">
            <Link
              href="booking"
              className="nav-cta text-center"
              onClick={() => handleNavClick("booking")}
            >
              Book a Table
            </Link>

            {loading ? (
              <div className="nav-spinner" aria-label="Loading" />
            ) : user ? (
              <div className="nav-mobile-user flex flex-col gap-3">
                <div className="nav-mobile-user-info flex items-center gap-3">
                  <span className="user-avatar inline-flex items-center justify-center overflow-hidden rounded-full">
                    {showProfileImage && profileImageUrl ? (
                      <Image
                        width={40}
                        height={40}
                        src={profileImageUrl}
                        alt="Profile"
                        onError={() => setImageError(true)}
                        unoptimized
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="user-dropdown-name">{user.name}</p>
                    <p className="user-dropdown-email truncate">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="user-dropdown-link flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </Link>

                <Link
                  href="/admin"
                  className="user-dropdown-link flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <button
                  className="user-dropdown-logout flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? "Logging out…" : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="nav-login text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}