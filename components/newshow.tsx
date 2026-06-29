"use client";

export function Show() {
  return (
    <section id="events">
      <div className="events-inner">
        <div className="events-header">
          <div>
            <div className="section-eyebrow">What's On</div>
            <h2 className="section-title">
              Upcoming
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Events & Shows
              </span>
            </h2>
          </div>
          <a href="shows" className="btn-outline">
            View All Events →
          </a>
        </div>

        
        <div className="events-grid">
          <div className="event-card">
            <div className="event-img drag">
              <div className="event-badge badge-tonight">Tonight</div>
              💃
            </div>
            <div className="event-body">
              <div className="event-date">Mon, June 15 · 9PM</div>
              <div className="event-title">Drag Extravaganza Night</div>
              <div className="event-desc">
                The Philippines' most fabulous drag queens take the stage for a
                night of glam, shade, and laughter.
              </div>
            </div>
          </div>

          <div className="event-card">
            <div className="event-img dj">
              <div className="event-badge badge-weekly">Weekly</div>
              🎧
            </div>
            <div className="event-body">
              <div className="event-date">Tue–Sat · 10PM–4AM</div>
              <div className="event-title">DJ Night: Neon Dreams</div>
              <div className="event-desc">
                House, dance pop, and BPM bangers curated by QC's top LGBTQ+
                DJs. Dance floor opens at 10.
              </div>
            </div>
          </div>

          <div className="event-card">
            <div className="event-img brunch">
              <div className="event-badge badge-weekly">Weekends</div>
              🥂
            </div>
            <div className="event-body">
              <div className="event-date">Sat & Sun · 11AM–3PM</div>
              <div className="event-title">Rainbow Brunch</div>
              <div className="event-desc">
                Free-flowing mimosas, bottomless pancakes, and live acoustic
                sets every Saturday and Sunday morning.
              </div>
            </div>
          </div>

          <div className="event-card">
            <div className="event-img pride">
              <div className="event-badge badge-special">Special</div>
              🏳️‍🌈
            </div>
            <div className="event-body">
              <div className="event-date">Sat, June 28 · All Day</div>
              <div className="event-title">Pride Month Closing Party</div>
              <div className="event-desc">
                A massive all-day celebration with local artists, pride parade
                viewing, and an electrifying night concert.
              </div>
            </div>
          </div>

          <div className="event-card">
            <div className="event-img karaoke">
              <div className="event-badge badge-weekly">Weekly</div>
              🎤
            </div>
            <div className="event-body">
              <div className="event-date">Every Wednesday · 8PM</div>
              <div className="event-title">Karaoke Chaos Night</div>
              <div className="event-desc">
                Sing your heart out — or watch others do it. Prizes for best
                performance and most dramatic exit.
              </div>
            </div>
          </div>

          <div className="event-card">
            <div className="event-img comedy">
              <div className="event-badge badge-special">Monthly</div>
              😂
            </div>
            <div className="event-body">
              <div className="event-date">Last Friday · 9:30PM</div>
              <div className="event-title">Queer Comedy Night</div>
              <div className="event-desc">
                Stand-up comedy by and for the community. Expect sharp wit,
                personal stories, and ugly crying (from laughter).
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Show;