import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, ChevronDown, Clock3, MapPin, Music, Music2, Navigation, Sparkles } from "lucide-react";
import "./styles.css";

// ─────────────────────────────────────────────────────────────────────────────
// EDIT ONLY THIS OBJECT TO UPDATE THE INVITATION.
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  couple: { groom: "Subin", bride: "Sajitha" },
  parents: {
    groom: "Mr. Sudhevan & Mrs. Ambika Sudhevan",
    bride: "Mr. Sathanandhan & Mrs. Shiji Sathanandhan",
  },
  date: { display: "Sunday, 22 November 2026", countdown: "2026-11-22T10:00:00+05:30" },
  events: [
    { label: "Marriage solemnization", time: "10:00 am — 11:00 am", venue: "Sree Badra Auditorium", place: "Mannuthi, Thrissur", map: "https://maps.google.com/?q=Sree+Badra+Auditorium+Mannuthi+Thrissur" },
    { label: "Wedding reception", time: "4:00 pm — 7:00 pm", venue: "Mangalya Auditorium", place: "Kannambra", map: "https://maps.google.com/?q=Mangalya+Auditorium+Kannambra" },
  ],
  message: "With hearts full of joy, we invite you to share in the beginning of our beautiful forever. Your love and blessings will make our celebration complete.",
  photos: ["/images/hero.jpg", "/images/pillar.jpg", "/images/steps.jpg", "/images/window.jpg", "/images/stage.jpg"],
  music: "/audio/wedding-music.mp3", // Add your track at this path, or replace with any audio URL.
  sharing: { title: "Subin & Sajitha | Wedding Invitation", description: "Join us as we celebrate our forever — 22 November 2026.", image: "/images/hero.jpg" },
};

const petals = Array.from({ length: 18 }, (_, i) => ({ id: i, left: `${(i * 29) % 100}%`, delay: i * 0.38, size: 8 + (i % 4) * 3 }));
const revealPetals = Array.from({ length: 28 }, (_, i) => ({ id: i, x: ((i * 47) % 320) - 160, y: ((i * 71) % 270) - 135, rotate: i * 43 }));

function Countdown() {
  const [left, setLeft] = useState({ Days: "000", Hours: "00", Minutes: "00", Seconds: "00" });
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, new Date(CONFIG.date.countdown).getTime() - Date.now());
      setLeft({ Days: String(Math.floor(d / 86400000)).padStart(3, "0"), Hours: String(Math.floor(d / 3600000) % 24).padStart(2, "0"), Minutes: String(Math.floor(d / 60000) % 60).padStart(2, "0"), Seconds: String(Math.floor(d / 1000) % 60).padStart(2, "0") });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return <div className="countdown" aria-label="Countdown to wedding">{Object.entries(left).map(([unit, value]) => <div className="time-unit" key={unit}><strong>{value}</strong><span>{unit}</span></div>)}</div>;
}

function Section({ children, className = "", ...props }) { return <motion.section {...props} className={`section ${className}`} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .75 }}>{children}</motion.section>; }

function App() {
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [muted, setMuted] = useState(true);
  const audio = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, .25], [0, 110]);
  const toggleSound = () => { if (!audio.current) return; if (muted) audio.current.play().catch(() => {}); else audio.current.pause(); setMuted(!muted); };
  const open = () => { setOpened(true); setTimeout(() => document.querySelector("#date")?.scrollIntoView({ behavior: "smooth" }), 700); };
  return <main>
    <audio ref={audio} src={CONFIG.music} loop preload="none" />
    <button className="sound" onClick={toggleSound} aria-label={muted ? "Play background music" : "Pause background music"}>{muted ? <Music2 size={18} /> : <Music size={18} />}<span>{muted ? "Music off" : "Music on"}</span></button>
    <AnimatePresence>
      {!opened && <motion.div className="cover" exit={{ opacity: 0, scale: 1.06, transition: { duration: .9 } }}>
        <div className="cover-photo" /> <div className="cover-veil" />
        {petals.map(p => <i key={p.id} className="falling-petal" style={{ left: p.left, animationDelay: `${p.delay}s`, width: p.size, height: p.size * .62 }} />)}
        <motion.div className="cover-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>
          <span className="eyebrow">Together with their families</span><p className="script">The wedding of</p><h1 className="gold">{CONFIG.couple.groom}<em>&</em>{CONFIG.couple.bride}</h1><p className="cover-date">22 · 11 · 2026</p>
          <button onClick={open} className="open-button">Tap to open <Sparkles size={15} /></button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
    <header className="hero" aria-label="Wedding invitation hero">
      <motion.div className="hero-image" style={{ y: heroY }} /> <div className="hero-shade" />
      {petals.slice(0, 11).map(p => <i key={p.id} className="falling-petal" style={{ left: p.left, animationDelay: `${p.delay}s`, width: p.size, height: p.size * .62 }} />)}
      <div className="hero-content"><span className="eyebrow light">Save our date</span><h1 className="gold">{CONFIG.couple.groom}<em>&</em>{CONFIG.couple.bride}</h1><p>{CONFIG.date.display}</p></div>
      <a className="scroll-cue" href="#date" aria-label="Scroll to date"><span>Scroll to discover</span><ChevronDown size={22} /></a>
    </header>
    <Section className="date-section" id="date">
      <span className="eyebrow">A date to remember</span><h2>Save the <i>date</i></h2>
      <div className="reveal-wrap">
        <div className="date-card"><span>Sunday</span><strong>22</strong><small>November · 2026</small></div>
        <motion.button className="scratch" onClick={() => setRevealed(true)} animate={revealed ? { opacity: 0, scale: 1.18 } : {}} transition={{ duration: .55 }} aria-label="Reveal wedding date"><span>Tap to reveal</span><b>✦</b></motion.button>
        <AnimatePresence>{revealed && <>{revealPetals.map(p => <motion.i key={p.id} className="pop-petal" initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: .5 }} animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate, scale: 1.25 }} transition={{ duration: .8, ease: "easeOut" }} />)}</>}</AnimatePresence>
      </div>
      <p className="reveal-caption">{revealed ? "We cannot wait to celebrate with you." : "A little touch uncovers a lifetime of joy."}</p>
      <Countdown />
    </Section>
    <Section className="story-section"><span className="eyebrow">With love</span><h2>Two souls,<br /><i>one beautiful story.</i></h2><p className="lead">{CONFIG.message}</p>
      <div className="portrait-grid"><article><img src={CONFIG.photos[3]} alt="Sajitha in traditional attire" loading="lazy" /><div><span>The bride</span><h3>{CONFIG.couple.bride}</h3><p>Daughter of {CONFIG.parents.bride}</p></div></article><article><img src={CONFIG.photos[2]} alt="Subin in traditional attire" loading="lazy" /><div><span>The groom</span><h3>{CONFIG.couple.groom}</h3><p>Son of {CONFIG.parents.groom}</p></div></article></div>
    </Section>
    <Section className="events-section"><span className="eyebrow">The celebration</span><h2>Come celebrate <i>with us</i></h2><div className="events">{CONFIG.events.map((event, i) => <motion.article className="event-card" key={event.label} whileHover={{ y: -6 }} whileTap={{ scale: .98 }}><span className="event-number">0{i + 1}</span><h3>{event.label}</h3><p className="event-time"><Clock3 size={16} />{event.time}</p><p><MapPin size={16} />{event.venue}<br /><small>{event.place}</small></p><a href={event.map} target="_blank" rel="noreferrer">Open map <Navigation size={15} /></a></motion.article>)}</div></Section>
    <Section className="gallery-section"><span className="eyebrow">A few moments</span><h2>Our little <i>gallery</i></h2><div className="gallery">{CONFIG.photos.map((photo, i) => <motion.figure key={photo} whileHover={{ scale: 1.025 }} transition={{ duration: .35 }}><img src={photo} alt={`Subin and Sajitha, moment ${i + 1}`} loading="lazy" /></motion.figure>)}</div></Section>
    <footer><div className="footer-photo" /><div className="footer-shade" /><div className="footer-content"><p className="script">With grateful hearts</p><h2 className="gold">{CONFIG.couple.groom}<em>&</em>{CONFIG.couple.bride}</h2><p>We look forward to celebrating with you.</p><span><CalendarDays size={16} />{CONFIG.date.display}</span></div></footer>
  </main>;
}
createRoot(document.getElementById("root")).render(<App />);
