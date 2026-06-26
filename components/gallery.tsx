"use client";

import { useEffect, useRef } from "react";

export function Gallery() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const track = scroller.querySelector(".gallery-masonry");
    const firstSet = scroller.querySelector(".gallery-set");
    if (!firstSet) return;

    let setWidth = 0;

    function measure() {
      setWidth = firstSet!.getBoundingClientRect().width + 16;
    }
    measure();
    window.addEventListener("resize", measure);

    scroller.scrollLeft = 1;

    function wrapScroll() {
      if (!scroller || setWidth <= 0) return;
      if (scroller.scrollLeft >= setWidth) scroller.scrollLeft -= setWidth;
      if (scroller.scrollLeft <= 0) scroller.scrollLeft += setWidth;
    }

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      scroller.classList.add("dragging");
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    };

    const onMouseUp = () => {
      isDown = false;
      scroller.classList.remove("dragging");
    };

    const onMouseLeave = () => {
      isDown = false;
      scroller.classList.remove("dragging");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scroller.offsetLeft;
      scroller.scrollLeft = scrollLeft - (x - startX) * 1.4;
      wrapScroll();
    };

    const onTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - scroller.offsetLeft;
      scroller.scrollLeft = scrollLeft - (x - startX) * 1.4;
      wrapScroll();
    };

    const onTouchEnd = () => { isDown = false; };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) || Math.abs(e.deltaX) > 0) {
        e.preventDefault();
        scroller.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
        wrapScroll();
      }
    };

    scroller.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    scroller.addEventListener("mouseleave", onMouseLeave);
    scroller.addEventListener("mousemove", onMouseMove);
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: true });
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", wrapScroll);

    return () => {
      window.removeEventListener("resize", measure);
      scroller.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      scroller.removeEventListener("mouseleave", onMouseLeave);
      scroller.removeEventListener("mousemove", onMouseMove);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", wrapScroll);
    };
  }, []);

  return (
    <section id="gallery">
      <div className="gallery-header">
        <div className="section-eyebrow">Memories</div>
        <h2 className="section-title">
          The{" "}   Vibe at {" "}
          <span
            style={{
              background:
                "linear-gradient(90deg, var(--neon-blue), var(--neon-pink))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
          RAPTURE
          </span>{" "}
        
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "15px",
            marginTop: "12px",
          }}
        >
          Every night a different story. Every guest a different light. Drag to
          explore.
        </p>
      </div>

      <div className="gallery-scroll" id="galleryScroll" ref={scrollerRef}>
        <div className="gallery-masonry">
          <div className="gallery-set">
            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "280px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1571266028243-d220c9c3b31e?w=600&q=80"
                  alt="Drag performance"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Live Show</div>
                  <div className="gallery-title">Drag Extravaganza</div>
                  <div className="gallery-desc">
                    Glam, shade & laughter every Monday night.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "170px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"
                  alt="DJ booth neon"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Weekly</div>
                  <div className="gallery-title">Neon Dreams DJ Set</div>
                  <div className="gallery-desc">
                    House & dance pop till 4AM.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "160px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1561485132-59468cb2adee?w=600&q=80"
                  alt="Pride flag"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Community</div>
                  <div className="gallery-title">Pride All Year</div>
                  <div className="gallery-desc">
                    A flag for every guest who walks in.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "300px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80"
                  alt="Cocktail glow"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Signature</div>
                  <div className="gallery-title">Neon Blue Lagoon</div>
                  <div className="gallery-desc">
                    Our glow-in-the-dark cocktail favorite.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "340px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1485872299829-c673f5194813?w=600&q=80"
                  alt="Karaoke singer"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Wednesdays</div>
                  <div className="gallery-title">Karaoke Chaos Night</div>
                  <div className="gallery-desc">
                    Sing your heart out, win fabulous prizes.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "120px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80"
                  alt="Champagne toast"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Brunch</div>
                  <div className="gallery-title">Bottomless Mimosas</div>
                  <div className="gallery-desc">
                    Weekend brunch with the squad.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "200px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80"
                  alt="Dance floor crowd"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Friday</div>
                  <div className="gallery-title">Dance Floor Energy</div>
                  <div className="gallery-desc">
                    Where the night really comes alive.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "260px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80"
                  alt="Rainbow lights"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Safe Space</div>
                  <div className="gallery-title">Every Color Welcome</div>
                  <div className="gallery-desc">
                    A home for the whole community.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "300px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1496843916299-590492c751f4?w=600&q=80"
                  alt="Party celebration"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Special</div>
                  <div className="gallery-title">Pride Closing Party</div>
                  <div className="gallery-desc">
                    An all-day celebration to remember.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "160px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1546171753-97d61d67f3f6?w=600&q=80"
                  alt="Cocktail bar drinks"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Bar</div>
                  <div className="gallery-title">Pink Goddess</div>
                  <div className="gallery-desc">
                    Pretty, powerful, just like you.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "180px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1571935441005-15de8c5e3eba?w=600&q=80"
                  alt="People dancing"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Vibe</div>
                  <div className="gallery-title">Late Night Moves</div>
                  <div className="gallery-desc">No judgment, just rhythm.</div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "280px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80"
                  alt="Live music performance"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Monthly</div>
                  <div className="gallery-title">Live Music Sessions</div>
                  <div className="gallery-desc">
                    Acoustic sets that hit different.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "260px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80"
                  alt="Drag queen glam"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Stage</div>
                  <div className="gallery-title">Queens Take Over</div>
                  <div className="gallery-desc">
                    Fabulous, fierce, unforgettable.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "200px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1566417713940-fe7c737a9d96?w=600&q=80"
                  alt="Bar lounge interior"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Lounge</div>
                  <div className="gallery-title">VIP Lounge Vibes</div>
                  <div className="gallery-desc">
                    Where the regulars become family.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "320px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1542406775-d4be12cb6019?w=600&q=80"
                  alt="Drag performance stage"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Tonight</div>
                  <div className="gallery-title">Center Stage</div>
                  <div className="gallery-desc">
                    Every spotlight tells a story.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "140px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80"
                  alt="Celebration crowd"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Always</div>
                  <div className="gallery-title">Made With Love</div>
                  <div className="gallery-desc">
                    For the community, by the community.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  DUPLICATE SET for seamless infinite loop */}
          <div className="gallery-set" aria-hidden="true">
            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "280px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1571266028243-d220c9c3b31e?w=600&q=80"
                  alt="Drag performance"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Live Show</div>
                  <div className="gallery-title">Drag Extravaganza</div>
                  <div className="gallery-desc">
                    Glam, shade & laughter every Monday night.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "170px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"
                  alt="DJ booth neon"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Weekly</div>
                  <div className="gallery-title">Neon Dreams DJ Set</div>
                  <div className="gallery-desc">
                    House & dance pop till 4AM.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "160px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1561485132-59468cb2adee?w=600&q=80"
                  alt="Pride flag"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Community</div>
                  <div className="gallery-title">Pride All Year</div>
                  <div className="gallery-desc">
                    A flag for every guest who walks in.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "300px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80"
                  alt="Cocktail glow"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Signature</div>
                  <div className="gallery-title">Neon Blue Lagoon</div>
                  <div className="gallery-desc">
                    Our glow-in-the-dark cocktail favorite.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "340px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1485872299829-c673f5194813?w=600&q=80"
                  alt="Karaoke singer"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Wednesdays</div>
                  <div className="gallery-title">Karaoke Chaos Night</div>
                  <div className="gallery-desc">
                    Sing your heart out, win fabulous prizes.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "120px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80"
                  alt="Champagne toast"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Brunch</div>
                  <div className="gallery-title">Bottomless Mimosas</div>
                  <div className="gallery-desc">
                    Weekend brunch with the squad.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "200px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80"
                  alt="Dance floor crowd"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Friday</div>
                  <div className="gallery-title">Dance Floor Energy</div>
                  <div className="gallery-desc">
                    Where the night really comes alive.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "260px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80"
                  alt="Rainbow lights"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Safe Space</div>
                  <div className="gallery-title">Every Color Welcome</div>
                  <div className="gallery-desc">
                    A home for the whole community.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "300px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1496843916299-590492c751f4?w=600&q=80"
                  alt="Party celebration"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Special</div>
                  <div className="gallery-title">Pride Closing Party</div>
                  <div className="gallery-desc">
                    An all-day celebration to remember.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "160px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1546171753-97d61d67f3f6?w=600&q=80"
                  alt="Cocktail bar drinks"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Bar</div>
                  <div className="gallery-title">Pink Goddess</div>
                  <div className="gallery-desc">
                    Pretty, powerful, just like you.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "180px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1571935441005-15de8c5e3eba?w=600&q=80"
                  alt="People dancing"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Vibe</div>
                  <div className="gallery-title">Late Night Moves</div>
                  <div className="gallery-desc">No judgment, just rhythm.</div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "280px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80"
                  alt="Live music performance"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Monthly</div>
                  <div className="gallery-title">Live Music Sessions</div>
                  <div className="gallery-desc">
                    Acoustic sets that hit different.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "260px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80"
                  alt="Drag queen glam"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Stage</div>
                  <div className="gallery-title">Queens Take Over</div>
                  <div className="gallery-desc">
                    Fabulous, fierce, unforgettable.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "200px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1566417713940-fe7c737a9d96?w=600&q=80"
                  alt="Bar lounge interior"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Lounge</div>
                  <div className="gallery-title">VIP Lounge Vibes</div>
                  <div className="gallery-desc">
                    Where the regulars become family.
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column">
              <div className="gallery-item" style={{ height: "320px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1542406775-d4be12cb6019?w=600&q=80"
                  alt="Drag performance stage"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Tonight</div>
                  <div className="gallery-title">Center Stage</div>
                  <div className="gallery-desc">
                    Every spotlight tells a story.
                  </div>
                </div>
              </div>
              <div className="gallery-item" style={{ height: "140px" }}>
                <img
                  className="gallery-img"
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80"
                  alt="Celebration crowd"
                />
                <div className="gallery-overlay">
                  <div className="gallery-tag">Always</div>
                  <div className="gallery-title">Made With Love</div>
                  <div className="gallery-desc">
                    For the community, by the community.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery-footer">
        <a href="#gallery" className="btn-full-gallery">
          Full Gallery
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>

      
    </section>
  );
}