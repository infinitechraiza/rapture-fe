"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Ticket,
} from "lucide-react";

const STATS = [
  { num: "6+", label: "Shows\nweekly" },
  { num: "6PM", label: "Open\ndaily" },
  { num: "18+", label: "Strictly\nadult" },
  { num: "100%", label: "Safe\nspace" },
];

const FEATURED = [
  {
    tag: "Tonight",
    title: "Drag Extravaganza Night",
    subtitle:
      "The most fabulous queens in Quezon City — all in one unforgettable night.",
    date: "Mon, June 15",
    time: "9:00 PM",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80",
    accent: "#ff2d9b",
    accentRgb: "255,45,155",
  },
  {
    tag: "This Saturday",
    title: "Pride Month Closing Party",
    subtitle:
      "An all-day celebration — live acts, parade viewing & electrifying concert.",
    date: "Sat, June 28",
    time: "All Day",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=80",
    accent: "#00d4ff",
    accentRgb: "0,212,255",
  },
  {
    tag: "Every Friday",
    title: "Queer Comedy Night",
    subtitle:
      "Sharp wit, personal stories, and ugly crying — guaranteed to be from laughter.",
    date: "Every Last Friday",
    time: "9:30 PM",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
    accent: "#b94fff",
    accentRgb: "185,79,255",
  },
];

export function HeroSection() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setIdx((next + FEATURED.length) % FEATURED.length);
      setAnimating(false);
    }, 180);
  };

  useEffect(() => {
    const t = setInterval(() => go(idx + 1), 2500);
    return () => clearInterval(t);
  }, [idx]);

  const ev = FEATURED[idx];

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "100px 24px 80px",
        overflow: "hidden",
      }}
    >
      {/* ── Lava lamp blobs — visible animated color clouds ─── */}
      <div className="lava-lamp" aria-hidden="true">
        <div className="lava-blob lb1" />
        <div className="lava-blob lb2" />
        <div className="lava-blob lb3" />
        <div className="lava-blob lb4" />
      </div>

      {/* ── All 28 party orbs ────────────────────────────────── */}
      <div className="hero-neon-orbs" aria-hidden="true">
       
        <div
          className="hero-orb ob1"
          style={{
            left: "38.5%",
            top: "66.5%",
            width: 680,
            height: 680,
            animationDuration: "11.9s",
            animationDelay: "4.2s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "39.2%",
            top: "89.8%",
            width: 450,
            height: 450,
            animationDuration: "14.7s",
            animationDelay: "0.9s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "62.0%",
            top: "59.1%",
            width: 320,
            height: 320,
            animationDuration: "8.1s",
            animationDelay: "5.0s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "62.0%",
            top: "34.8%",
            width: 320,
            height: 320,
            animationDuration: "10.9s",
            animationDelay: "2.2s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "50.5%",
            top: "18.2%",
            width: 600,
            height: 600,
            animationDuration: "14.0s",
            animationDelay: "5.7s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "51.1%",
            top: "65.5%",
            width: 450,
            height: 450,
            animationDuration: "14.3s",
            animationDelay: "4.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "38.4%",
            top: "16.2%",
            width: 450,
            height: 450,
            animationDuration: "10.8s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "21.3%",
            top: "11.3%",
            width: 320,
            height: 320,
            animationDuration: "8.5s",
            animationDelay: "1.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "90.4%",
            top: "60.5%",
            width: 260,
            height: 260,
            animationDuration: "8.7s",
            animationDelay: "3.4s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "78.8%",
            top: "43.1%",
            width: 520,
            height: 520,
            animationDuration: "8.2s",
            animationDelay: "5.2s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "65.1%",
            top: "8.1%",
            width: 380,
            height: 380,
            animationDuration: "14.7s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "49.8%",
            top: "32.7%",
            width: 450,
            height: 450,
            animationDuration: "15.0s",
            animationDelay: "2.8s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "96.0%",
            top: "86.5%",
            width: 600,
            height: 600,
            animationDuration: "8.5s",
            animationDelay: "3.3s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "52.1%",
            top: "91.5%",
            width: 380,
            height: 380,
            animationDuration: "12.9s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "93.4%",
            top: "37.0%",
            width: 680,
            height: 680,
            animationDuration: "8.7s",
            animationDelay: "1.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "65.7%",
            top: "82.1%",
            width: 600,
            height: 600,
            animationDuration: "12.9s",
            animationDelay: "3.9s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "25.0%",
            top: "66.5%",
            width: 380,
            height: 380,
            animationDuration: "13.0s",
            animationDelay: "5.3s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "6.1%",
            top: "93.0%",
            width: 380,
            height: 380,
            animationDuration: "9.2s",
            animationDelay: "0.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "4.0%",
            top: "15.9%",
            width: 320,
            height: 320,
            animationDuration: "13.2s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "95.8%",
            top: "12.5%",
            width: 320,
            height: 320,
            animationDuration: "11.1s",
            animationDelay: "3.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "38.5%",
            top: "66.5%",
            width: 680,
            height: 680,
            animationDuration: "11.9s",
            animationDelay: "4.2s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "39.2%",
            top: "89.8%",
            width: 450,
            height: 450,
            animationDuration: "14.7s",
            animationDelay: "0.9s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "62.0%",
            top: "59.1%",
            width: 320,
            height: 320,
            animationDuration: "8.1s",
            animationDelay: "5.0s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "62.0%",
            top: "34.8%",
            width: 320,
            height: 320,
            animationDuration: "10.9s",
            animationDelay: "2.2s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "50.5%",
            top: "18.2%",
            width: 600,
            height: 600,
            animationDuration: "14.0s",
            animationDelay: "5.7s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "51.1%",
            top: "65.5%",
            width: 450,
            height: 450,
            animationDuration: "14.3s",
            animationDelay: "4.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "38.4%",
            top: "16.2%",
            width: 450,
            height: 450,
            animationDuration: "10.8s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "21.3%",
            top: "11.3%",
            width: 320,
            height: 320,
            animationDuration: "8.5s",
            animationDelay: "1.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "90.4%",
            top: "60.5%",
            width: 260,
            height: 260,
            animationDuration: "8.7s",
            animationDelay: "3.4s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "78.8%",
            top: "43.1%",
            width: 520,
            height: 520,
            animationDuration: "8.2s",
            animationDelay: "5.2s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "65.1%",
            top: "8.1%",
            width: 380,
            height: 380,
            animationDuration: "14.7s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "49.8%",
            top: "32.7%",
            width: 450,
            height: 450,
            animationDuration: "15.0s",
            animationDelay: "2.8s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "96.0%",
            top: "86.5%",
            width: 600,
            height: 600,
            animationDuration: "8.5s",
            animationDelay: "3.3s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "52.1%",
            top: "91.5%",
            width: 380,
            height: 380,
            animationDuration: "12.9s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "93.4%",
            top: "37.0%",
            width: 680,
            height: 680,
            animationDuration: "8.7s",
            animationDelay: "1.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "65.7%",
            top: "82.1%",
            width: 600,
            height: 600,
            animationDuration: "12.9s",
            animationDelay: "3.9s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "25.0%",
            top: "66.5%",
            width: 380,
            height: 380,
            animationDuration: "13.0s",
            animationDelay: "5.3s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "6.1%",
            top: "93.0%",
            width: 380,
            height: 380,
            animationDuration: "9.2s",
            animationDelay: "0.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "4.0%",
            top: "15.9%",
            width: 320,
            height: 320,
            animationDuration: "13.2s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "95.8%",
            top: "12.5%",
            width: 320,
            height: 320,
            animationDuration: "11.1s",
            animationDelay: "3.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "38.5%",
            top: "66.5%",
            width: 680,
            height: 680,
            animationDuration: "11.9s",
            animationDelay: "4.2s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "39.2%",
            top: "89.8%",
            width: 450,
            height: 450,
            animationDuration: "14.7s",
            animationDelay: "0.9s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "62.0%",
            top: "59.1%",
            width: 320,
            height: 320,
            animationDuration: "8.1s",
            animationDelay: "5.0s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "62.0%",
            top: "34.8%",
            width: 320,
            height: 320,
            animationDuration: "10.9s",
            animationDelay: "2.2s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "50.5%",
            top: "18.2%",
            width: 600,
            height: 600,
            animationDuration: "14.0s",
            animationDelay: "5.7s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "51.1%",
            top: "65.5%",
            width: 450,
            height: 450,
            animationDuration: "14.3s",
            animationDelay: "4.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "38.4%",
            top: "16.2%",
            width: 450,
            height: 450,
            animationDuration: "10.8s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "21.3%",
            top: "11.3%",
            width: 320,
            height: 320,
            animationDuration: "8.5s",
            animationDelay: "1.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "90.4%",
            top: "60.5%",
            width: 260,
            height: 260,
            animationDuration: "8.7s",
            animationDelay: "3.4s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "78.8%",
            top: "43.1%",
            width: 520,
            height: 520,
            animationDuration: "8.2s",
            animationDelay: "5.2s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "65.1%",
            top: "8.1%",
            width: 380,
            height: 380,
            animationDuration: "14.7s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "49.8%",
            top: "32.7%",
            width: 450,
            height: 450,
            animationDuration: "15.0s",
            animationDelay: "2.8s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "96.0%",
            top: "86.5%",
            width: 600,
            height: 600,
            animationDuration: "8.5s",
            animationDelay: "3.3s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "52.1%",
            top: "91.5%",
            width: 380,
            height: 380,
            animationDuration: "12.9s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "93.4%",
            top: "37.0%",
            width: 680,
            height: 680,
            animationDuration: "8.7s",
            animationDelay: "1.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "65.7%",
            top: "82.1%",
            width: 600,
            height: 600,
            animationDuration: "12.9s",
            animationDelay: "3.9s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "25.0%",
            top: "66.5%",
            width: 380,
            height: 380,
            animationDuration: "13.0s",
            animationDelay: "5.3s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "6.1%",
            top: "93.0%",
            width: 380,
            height: 380,
            animationDuration: "9.2s",
            animationDelay: "0.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "4.0%",
            top: "15.9%",
            width: 320,
            height: 320,
            animationDuration: "13.2s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "95.8%",
            top: "12.5%",
            width: 320,
            height: 320,
            animationDuration: "11.1s",
            animationDelay: "3.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "38.5%",
            top: "66.5%",
            width: 680,
            height: 680,
            animationDuration: "11.9s",
            animationDelay: "4.2s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "39.2%",
            top: "89.8%",
            width: 450,
            height: 450,
            animationDuration: "14.7s",
            animationDelay: "0.9s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "62.0%",
            top: "59.1%",
            width: 320,
            height: 320,
            animationDuration: "8.1s",
            animationDelay: "5.0s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "62.0%",
            top: "34.8%",
            width: 320,
            height: 320,
            animationDuration: "10.9s",
            animationDelay: "2.2s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "50.5%",
            top: "18.2%",
            width: 600,
            height: 600,
            animationDuration: "14.0s",
            animationDelay: "5.7s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "51.1%",
            top: "65.5%",
            width: 450,
            height: 450,
            animationDuration: "14.3s",
            animationDelay: "4.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "38.4%",
            top: "16.2%",
            width: 450,
            height: 450,
            animationDuration: "10.8s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "21.3%",
            top: "11.3%",
            width: 320,
            height: 320,
            animationDuration: "8.5s",
            animationDelay: "1.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "90.4%",
            top: "60.5%",
            width: 260,
            height: 260,
            animationDuration: "8.7s",
            animationDelay: "3.4s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "78.8%",
            top: "43.1%",
            width: 520,
            height: 520,
            animationDuration: "8.2s",
            animationDelay: "5.2s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "65.1%",
            top: "8.1%",
            width: 380,
            height: 380,
            animationDuration: "14.7s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "49.8%",
            top: "32.7%",
            width: 450,
            height: 450,
            animationDuration: "15.0s",
            animationDelay: "2.8s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "96.0%",
            top: "86.5%",
            width: 600,
            height: 600,
            animationDuration: "8.5s",
            animationDelay: "3.3s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "52.1%",
            top: "91.5%",
            width: 380,
            height: 380,
            animationDuration: "12.9s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "93.4%",
            top: "37.0%",
            width: 680,
            height: 680,
            animationDuration: "8.7s",
            animationDelay: "1.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "65.7%",
            top: "82.1%",
            width: 600,
            height: 600,
            animationDuration: "12.9s",
            animationDelay: "3.9s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "25.0%",
            top: "66.5%",
            width: 380,
            height: 380,
            animationDuration: "13.0s",
            animationDelay: "5.3s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "6.1%",
            top: "93.0%",
            width: 380,
            height: 380,
            animationDuration: "9.2s",
            animationDelay: "0.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "4.0%",
            top: "15.9%",
            width: 320,
            height: 320,
            animationDuration: "13.2s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "95.8%",
            top: "12.5%",
            width: 320,
            height: 320,
            animationDuration: "11.1s",
            animationDelay: "3.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "38.5%",
            top: "66.5%",
            width: 680,
            height: 680,
            animationDuration: "11.9s",
            animationDelay: "4.2s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "39.2%",
            top: "89.8%",
            width: 450,
            height: 450,
            animationDuration: "14.7s",
            animationDelay: "0.9s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "62.0%",
            top: "59.1%",
            width: 320,
            height: 320,
            animationDuration: "8.1s",
            animationDelay: "5.0s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "62.0%",
            top: "34.8%",
            width: 320,
            height: 320,
            animationDuration: "10.9s",
            animationDelay: "2.2s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "50.5%",
            top: "18.2%",
            width: 600,
            height: 600,
            animationDuration: "14.0s",
            animationDelay: "5.7s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "51.1%",
            top: "65.5%",
            width: 450,
            height: 450,
            animationDuration: "14.3s",
            animationDelay: "4.7s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "38.4%",
            top: "16.2%",
            width: 450,
            height: 450,
            animationDuration: "10.8s",
            animationDelay: "2.4s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "21.3%",
            top: "11.3%",
            width: 320,
            height: 320,
            animationDuration: "8.5s",
            animationDelay: "1.3s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "90.4%",
            top: "60.5%",
            width: 260,
            height: 260,
            animationDuration: "8.7s",
            animationDelay: "3.4s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "78.8%",
            top: "43.1%",
            width: 520,
            height: 520,
            animationDuration: "8.2s",
            animationDelay: "5.2s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "65.1%",
            top: "8.1%",
            width: 380,
            height: 380,
            animationDuration: "14.7s",
            animationDelay: "3.6s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "49.8%",
            top: "32.7%",
            width: 450,
            height: 450,
            animationDuration: "15.0s",
            animationDelay: "2.8s",
          }}
        />
      </div>

      {/* lighter veil so lava blobs show through */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(6,6,20,0.35)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── 2-Column content ──────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1240,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* LEFT */}
        <div>
          <div
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "var(--neon-blue)",
              background: "rgba(0,212,255,0.12)",
              border: "1px solid rgba(0,212,255,0.35)",
              borderRadius: 50,
              padding: "6px 20px",
              marginBottom: 28,
            }}
          >
            Quezon City's Premier LGBTQ+ Venue
          </div>
          <h1
            style={{
              fontSize: "clamp(56px,7vw,96px)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: -3,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            RAPTURE
          </h1>
          <p
            style={{
              fontSize: "clamp(20px,2.6vw,30px)",
              fontWeight: 700,
              marginBottom: 24,
              background:
                "linear-gradient(90deg,var(--neon-blue),var(--neon-purple),var(--neon-pink))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Comedy Bar & Café
          </p>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.8,
              maxWidth: 480,
              marginBottom: 40,
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            }}
          >
            The heart of Quezon City's LGBTQ+ community. Come for the laughs,
            stay for the love. Where every night is a celebration of exactly who
            you are.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 52,
            }}
          >
            <a
              href="/booking"
              style={{
                padding: "14px 32px",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 15,
                background:
                  "linear-gradient(135deg,var(--neon-blue),var(--neon-purple))",
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 0 36px rgba(0,212,255,0.38)",
              }}
            >
              Book a Table
            </a>
            <a
              href="/shows"
              style={{
                padding: "14px 32px",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 15,
                color: "var(--neon-blue)",
                border: "1px solid rgba(0,212,255,0.5)",
                textDecoration: "none",
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(8px)",
              }}
            >
              View Shows →
            </a>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  background: "rgba(0,0,0,0.45)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "16px 8px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(22px,3vw,34px)",
                    fontWeight: 900,
                    background:
                      "linear-gradient(135deg,var(--neon-blue),var(--neon-purple))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginTop: 6,
                    lineHeight: 1.4,
                    whiteSpace: "pre-line",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Featured show */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Star size={12} style={{ color: "var(--neon-pink)" }} /> Featured
            Show
          </div>
          <div
            key={idx}
            style={{
              position: "relative",
              borderRadius: 22,
              overflow: "hidden",
              height: 480,
              animation: animating
                ? "featuredSlideOut 0.28s ease forwards"
                : "featuredSlideIn 0.38s ease forwards",
              boxShadow: `0 32px 80px rgba(${ev.accentRgb},0.28)`,
            }}
          >
            <img
              src={ev.image}
              alt={ev.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(170deg,rgba(${ev.accentRgb},0.15) 0%,rgba(0,0,0,0.6) 40%,rgba(0,0,0,0.92) 100%)`,
              }}
            />
            <div style={{ position: "absolute", top: 20, left: 20 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  padding: "5px 14px",
                  borderRadius: 50,
                  background: ev.accent,
                  color: "#fff",
                  display: "inline-block",
                }}
              >
                {ev.tag}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "28px 28px 32px",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(20px,2vw,28px)",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  marginBottom: 10,
                }}
              >
                {ev.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.6,
                  marginBottom: 22,
                }}
              >
                {ev.subtitle}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <Calendar size={13} style={{ color: ev.accent }} /> {ev.date}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <Clock size={13} style={{ color: ev.accent }} /> {ev.time}
                </span>
                <a
                  href="/shows"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    textDecoration: "none",
                    padding: "8px 18px",
                    borderRadius: 50,
                    background: ev.accent,
                    marginLeft: "auto",
                  }}
                >
                  <Ticket size={13} /> Get Tickets
                </a>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 20,
            }}
          >
            <button
              onClick={() => go(idx - 1)}
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                width: 34,
                height: 34,
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <div style={{ display: "flex", gap: 7 }}>
              {FEATURED.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  style={{
                    width: i === idx ? 22 : 7,
                    height: 7,
                    borderRadius: 4,
                    background:
                      i === idx ? ev.accent : "rgba(255,255,255,0.22)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all .3s",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => go(idx + 1)}
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                width: 34,
                height: 34,
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){#home>div:last-child{grid-template-columns:1fr !important;gap:40px !important;}}`}</style>
    </section>
  );
}
