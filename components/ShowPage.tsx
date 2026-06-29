import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";
interface Show {
  title: string;
  description: string;
  image: string;
}

export const SHOWS = [
  { id: 1, badge: "Tonight", badgeColor: "linear-gradient(135deg,#ff2d9b,#b94fff)", title: "Drag Extravaganza Night", desc: "The Philippines' most fabulous drag queens — one stage, one unforgettable night.", date: "Mon, June 15", time: "9:00 PM", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=80" },
  { id: 2, badge: "This Saturday", badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)", title: "Pride Month Closing Party", desc: "An all-day celebration — live acts, parade viewing & electrifying concert.", date: "Sat, June 28", time: "All Day", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80" },
  { id: 3, badge: "Weekly", badgeColor: "linear-gradient(135deg,#00d4ff,#b94fff)", title: "DJ Night: Neon Dreams", desc: "House, dance pop & BPM bangers from QC's top LGBTQ+ DJs.", date: "Tue–Sat", time: "10:00 PM – 4:00 AM", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80" },
  { id: 4, badge: "Weekends", badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)", title: "Rainbow Brunch", desc: "Free-flowing mimosas, bottomless pancakes, and live acoustic sets.", date: "Sat & Sun", time: "11:00 AM – 3:00 PM", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=700&q=80" },
  { id: 5, badge: "Weekly", badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)", title: "Karaoke Chaos Night", desc: "Sing your heart out — prizes for best performance and most dramatic exit.", date: "Every Wednesday", time: "8:00 PM", img: "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=700&q=80" },
  { id: 6, badge: "Monthly", badgeColor: "linear-gradient(135deg,#ff9d00,#ff2d9b)", title: "Queer Comedy Night", desc: "Stand-up comedy by and for the community. Expect sharp wit and ugly crying.", date: "Last Friday", time: "9:30 PM", img: "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=700&q=80" },
  { id: 7, badge: "Coming Soon", badgeColor: "rgba(255,200,0,0.9)", title: "Live Band Extravaganza", desc: "Local indie and pop bands perform live in an intimate setting.", date: "Fri, July 5", time: "8:00 PM", img: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=700&q=80" },
  { id: 8, badge: "Weekly", badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)", title: "Makeup Artist Meet & Greet", desc: "Connect with professional makeup artists, get tips, enjoy special discounts.", date: "Mon & Thu", time: "7:00 PM", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&q=80" },
  { id: 9, badge: "Weekends", badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)", title: "Happy Hour Fiesta", desc: "50% off cocktails and appetizers. Perfect for after-work hangouts.", date: "Fri, Sat & Sun", time: "5:00 PM – 8:00 PM", img: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?w=700&q=80" },
  { id: 10, badge: "Special", badgeColor: "linear-gradient(135deg,#ff9d00,#ff2d9b)", title: "Theater Workshop & Showcase", desc: "Learn from local theater actors and performers, then watch showcases.", date: "Sun, July 12", time: "6:00 PM", img: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=700&q=80" },
  { id: 11, badge: "Weekly", badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)", title: "Battle of the Bands", desc: "Local bands compete on stage for prizes and bragging rights.", date: "Tue & Fri", time: "9:00 PM", img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=700&q=80" },
  { id: 12, badge: "Special", badgeColor: "linear-gradient(135deg,#ff9d00,#ff2d9b)", title: "Celebrity Guest Night", desc: "Special performances by international LGBTQ+ artists. Limited tickets.", date: "Sat, July 19", time: "10:00 PM", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&q=80" },
];

export default function Shows() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const tabs = [
    "All",
    "Tonight",
    "Weekly",
    "Weekends",
    "Special",
    "Monthly",
    "Coming Soon",
  ];

  const filteredShows =
    filter === "All"
      ? SHOWS
      : SHOWS.filter(
          (s) =>
            s.badge === filter ||
            (filter === "Weekends" && s.badge === "Weekends"),
        );

  const totalPages = Math.ceil(filteredShows.length / itemsPerPage);
  const paginatedShows = filteredShows.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div className="w-full text-white bg-[#060614]">
      {/* SECTION 1 - Cinematic Banner */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&q=80"
            alt="Club stage at night"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#060614]/80 to-[#060614]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.4em] text-[var(--neon-blue)] font-bold mb-6 block"
          >
            What's On At Rapture
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[clamp(40px,8vw,80px)] leading-[1.1] font-black tracking-tight mb-6"
          >
            Live, Loud & <br />{" "}
            <span className="text-gradient">Unapologetic</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-white/70 font-medium max-w-2xl mx-auto mb-10"
          >
            From drag extravaganzas to intimate comedy sets — every night is an
            event.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/contact"
              className="bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(255,45,155,0.3)] hover:shadow-[0_0_35px_rgba(255,45,155,0.6)] transition-all hover:-translate-y-1"
            >
              Book a Table
            </Link>
            <button
              onClick={() =>
                document
                  .getElementById("shows-grid")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all"
              aria-label="Scroll down"
            >
              <ChevronDown size={20} />
            </button>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white" />
        </div>
      </section>

      {/* SECTION 2 - Shows Grid */}
      <section id="shows-grid" className="py-24 px-4 max-w-7xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab);
                setPage(1);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                filter === tab
                  ? "bg-white/10 border-[var(--neon-blue)] text-white shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                  : "bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 min-h-[400px]">
          {paginatedShows.map((show) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="group relative h-[360px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer neon-border hover-glow"
            >
              <img
                src={show.img}
                alt={show.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div
                className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-lg backdrop-blur-sm"
                style={{ background: show.badgeColor }}
              >
                {show.badge}
              </div>

              {/* Hover overlay that slides up */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060614] via-[#060614]/80 to-transparent translate-y-8 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-black mb-2 text-white leading-tight">
                  {show.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-[var(--neon-blue)] font-bold mb-3">
                  <span>{show.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-pink)]" />
                  <span>{show.time}</span>
                </div>
                <p className="text-sm text-white/80 line-clamp-3 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {show.desc}
                </p>
                <Link
                  href="/contact"
                  className="w-fit text-xs font-bold uppercase tracking-widest text-[var(--neon-pink)] hover:text-white transition-colors flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150"
                >
                  Book This Event <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
          {paginatedShows.length === 0 && (
            <div className="col-span-full py-20 text-center text-white/50 flex flex-col items-center">
              <span className="text-4xl mb-4">🎭</span>
              <p className="text-xl font-bold">
                No shows found for this category.
              </p>
              <button
                onClick={() => setFilter("All")}
                className="mt-4 text-[var(--neon-blue)] hover:underline"
              >
                View all shows
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mb-24">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-3 h-3 rounded-full transition-all ${page === i + 1 ? "bg-[var(--neon-pink)] scale-125" : "bg-white/20 hover:bg-white/40"}`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Newsletter Strip */}
        <div className="bg-glass rounded-3xl p-8 md:p-12 border border-[rgba(0,212,255,0.2)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--neon-pink)] rounded-full blur-[120px] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-lg text-center md:text-left">
            <h3 className="text-2xl font-black mb-2">
              Get show drops straight to your inbox
            </h3>
            <p className="text-white/60">
              We sell out fast. Be the first to know about special events, big
              headliners, and secret sets.
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-3 min-w-[320px]">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-black/50 border border-white/10 rounded-full px-6 py-4 outline-none focus:border-[var(--neon-blue)] text-white w-full transition-colors"
            />
            <button className="bg-white text-black font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full hover:bg-[var(--neon-blue)] hover:text-white transition-colors shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
