import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Game {
  title: string;
  desc: string;
  img: string;
  tag: string;
  tagColor: string;
  accentFrom: string;
  accentTo: string;
  link: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const GAMES: Game[] = [
  {
    title: "Race and Race",
    desc: "Drive fast and beat the clock in this exciting Roblox racing game.",
    img: "https://spawnifygames.win/race.png",
    tag: "Racing",
    tagColor: "bg-orange-500/80",
    accentFrom: "#b91c1c",
    accentTo: "#ea580c",
    link: "https://www.roblox.com/games/100126264513823/Race-and-race",
  },
  {
    title: "Islands of Work and Wonder",
    desc: "Work as hard as you can, sell your loot, and explore the islands.",
    img: "https://spawnifygames.win/image.jpg",
    tag: "Adventure",
    tagColor: "bg-cyan-500/80",
    accentFrom: "#0e7490",
    accentTo: "#2563eb",
    link: "https://www.roblox.com/games/92743955973030/islands-of-work-and-wonder",
  },
  {
    title: "The Bob [Horror]",
    desc: "Find the safe house and try to survive.",
    img: "https://spawnifygames.win/image-(2).jpg",
    tag: "Horror",
    tagColor: "bg-green-600/80",
    accentFrom: "#14532d",
    accentTo: "#16a34a",
    link: "https://www.roblox.com/games/104156688515752/The-Bob",
  },
  {
    title: "Tower of Heights",
    desc: "Get to the top of the tower and decide where you will go next.",
    img: "https://spawnifygames.win/image-(3).jpg",
    tag: "Obby",
    tagColor: "bg-violet-500/80",
    accentFrom: "#5b21b6",
    accentTo: "#7c3aed",
    link: "https://www.roblox.com/games/101953228803213/Tower-of-Heights",
  },
  {
    title: "Five Nights at Fredih",
    desc: "FNAF parody. Hide from Fredih and survive 5 nights — and if you dare, tackle the bonus shift.",
    img: "https://spawnifygames.win/undefined%20-%20Imgur.jpg",
    tag: "Horror",
    tagColor: "bg-yellow-600/80",
    accentFrom: "#92400e",
    accentTo: "#d97706",
    link: "http://spawnifygames.win/fnafredih/",
  },
];

const ROLES = [
  { title: "Owner", desc: "Leads the group and sets the vision.", icon: "👑", glow: "#6366f1" },
  { title: "Developers", desc: "Create scripts and game systems.", icon: "💻", glow: "#3b82f6" },
  { title: "Builders", desc: "Design maps and environments.", icon: "🏗️", glow: "#10b981" },
  { title: "UI / Designers", desc: "Create interfaces and visuals.", icon: "🎨", glow: "#ec4899" },
  { title: "Testers", desc: "Find bugs and improve quality.", icon: "🔍", glow: "#f59e0b" },
  { title: "Community", desc: "Support and share ideas.", icon: "🌐", glow: "#8b5cf6" },
];

// ─── Scroll Reveal ───────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        if (entry.isIntersecting) {
          timerRef.current = setTimeout(() => setVisible(true), delay);
        } else {
          // Reset off-screen content so the entrance animation replays.
          setVisible(false);
        }
      },
      { threshold: 0.08, rootMargin: "-4% 0px -4% 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-[0.92]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────────

function Counter({ target, label, suffix = "+" }: { target: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          const duration = 1400;
          const steps = 60;
          const stepTime = duration / steps;
          let current = 0;
          const increment = target / steps;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-black text-white tabular-nums">
        {count.toLocaleString()}
        <span className="text-indigo-400">{suffix}</span>
      </div>
      <div className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-1 font-medium">{label}</div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "What We Do", href: "#what-we-do" },
    { label: "Roles", href: "#roles" },
    { label: "Games", href: "#games" },
    { label: "Join", href: "#join" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080b14]/90 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/40 rounded-xl blur-md group-hover:bg-indigo-400/50 transition-all" />
            <SpawnifyLogo className="relative w-8 h-8 rounded-xl border border-white/10" />
          </div>
          <span className="font-black text-white tracking-tight">
            Spawnify <span className="text-indigo-400 font-light">Games</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#join"
            className="ml-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5"
          >
            Join Us →
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-[#080b14]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Game Card ───────────────────────────────────────────────────────────────

function GameCard({ game, index }: { game: Game; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Reveal delay={index * 80}>
      <div className="group relative bg-[#0f1220] rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-950/60 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {!imgError ? (
            <img
              src={game.img}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-5xl"
              style={{ background: `linear-gradient(135deg, ${game.accentFrom}, ${game.accentTo})` }}
            >
              🎮
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1220] via-transparent to-transparent" />
          {/* Tag */}
          <span className={`absolute top-3 right-3 ${game.tagColor} backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-semibold`}>
            {game.tag}
          </span>
          {/* Hover play overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={game.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-full text-sm hover:bg-indigo-100 transition-colors shadow-xl transform -translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Now
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-indigo-300 transition-colors">
            {game.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">{game.desc}</p>
          <a
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-indigo-600/30"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Now
          </a>
        </div>
      </div>
    </Reveal>
  );
}

// ─── Section Heading ─────────────────────────────────────────────────────────

function SectionHeading({
  title,
  sub,
  color = "#6366f1",
}: {
  title: string;
  sub?: string;
  color?: string;
}) {
  return (
    <Reveal>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 rounded-full" style={{ backgroundColor: color }} />
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{title}</h2>
        </div>
        {sub && <p className="text-slate-500 ml-4 text-base">{sub}</p>}
      </div>
    </Reveal>
  );
}

function SpawnifyLogo({ className = "" }: { className?: string }) {
  return <img src="https://i.imgur.com/EUd9DBS.jpeg" alt="Spawnify Games logo" className={className} />;
}

function RobloxIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <g transform="rotate(18 12 12)">
        <rect x="5" y="5" width="14" height="14" rx="1.6" fill="currentColor" />
        <rect x="10" y="10" width="4" height="4" rx="0.4" fill="white" />
      </g>
    </svg>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white antialiased">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gradient center glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
          {/* Animated blobs */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" />
          <div
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-[32px] blur-2xl" />
              <SpawnifyLogo className="relative w-28 h-28 rounded-3xl border border-white/10 shadow-2xl shadow-indigo-900/40" />
            </div>
          </div>

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Roblox Development Group · Since 2025
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-9xl font-black leading-none tracking-tighter mb-4">
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Spawnify
            </span>
            <span className="block text-white/90">Games</span>
          </h1>

          <p className="text-slate-400 text-xl md:text-2xl font-light tracking-wide mb-12">
            where every idea{" "}
            <span className="text-indigo-400 font-semibold italic">spawns</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#games"
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-600/40 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Explore Games
            </a>
            <a
              href="#join"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 text-white font-bold rounded-2xl transition-all hover:-translate-y-1 text-sm"
            >
              Join the Group
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600 text-xs">
          <span className="uppercase tracking-widest text-[10px]">Scroll</span>
          <div className="w-5 h-8 border border-slate-700 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-slate-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#0a0d18] py-12">
        <Reveal className="max-w-3xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <Counter target={5} label="Games" />
          <Counter target={100} label="Ideas Spawned" />
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black text-white whitespace-nowrap">
              Since <span className="text-indigo-400">2025</span>
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-1 font-medium">
              Creating on Roblox
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── About ─────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 px-6 max-w-6xl mx-auto">
        <SectionHeading title="About Us" color="#6366f1" />
        <Reveal delay={100}>
          <div className="relative p-8 md:p-10 rounded-3xl bg-[#0f1220] border border-white/5 overflow-hidden">
            {/* Decorative corner glow */}
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
            <p className="relative text-slate-300 text-lg md:text-xl leading-relaxed">
              <span className="text-white font-bold">Spawnify Games</span> is a Roblox development group
              dedicated to creating fun, original, and creative experiences. We turn ideas into playable
              worlds and encourage{" "}
              <span className="text-indigo-400">innovation</span>,{" "}
              <span className="text-violet-400">teamwork</span>, and{" "}
              <span className="text-blue-400">learning</span>.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── What We Do ────────────────────────────────────────────────── */}
      <section id="what-we-do" className="pb-28 px-6 max-w-6xl mx-auto">
        <SectionHeading title="What We Do" color="#8b5cf6" />
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: "🎮",
              title: "Develop Original Games",
              desc: "Build unique Roblox experiences from scratch — mechanics, worlds, and stories that are entirely our own.",
              color: "#6366f1",
            },
            {
              icon: "🧠",
              title: "Experiment with Ideas",
              desc: "We push boundaries and explore concepts that challenge what Roblox games can be.",
              color: "#8b5cf6",
            },
            {
              icon: "🚀",
              title: "Grow Real Skills",
              desc: "Every project sharpens scripting, building, and design abilities through hands-on creation.",
              color: "#3b82f6",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="group relative p-7 rounded-3xl bg-[#0f1220] border border-white/5 hover:border-indigo-500/20 transition-all hover:-translate-y-1 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${item.color}12, transparent 60%)`,
                  }}
                />
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Team Roles ────────────────────────────────────────────────── */}
      <section id="roles" className="pb-28 px-6 max-w-6xl mx-auto">
        <SectionHeading
          title="Team Roles"
          sub="Everyone has a place in Spawnify Games."
          color="#3b82f6"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((role, i) => (
            <Reveal key={role.title} delay={i * 60}>
              <div className="group flex items-start gap-4 p-6 rounded-2xl bg-[#0f1220] border border-white/5 hover:border-white/10 hover:bg-[#111628] transition-all">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${role.glow}15` }}
                >
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-indigo-300 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{role.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Games ─────────────────────────────────────────────────────── */}
      <section id="games" className="pb-28 px-6 max-w-6xl mx-auto">
        <SectionHeading
          title="Games"
          sub={`${GAMES.length} experiences and growing.`}
          color="#10b981"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game, i) => (
            <GameCard key={game.title} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* ── Join ──────────────────────────────────────────────────────── */}
      <section id="join" className="pb-28 px-6 max-w-6xl mx-auto">
        <SectionHeading title="Join Spawnify" color="#ec4899" />
        <Reveal delay={100}>
          <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden border border-indigo-500/15">
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0f1220 0%, #130f28 50%, #0f1220 100%)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />

            <div className="relative z-10">
              <p className="text-white text-xl font-semibold mb-2">
                Join our Roblox group and help turn ideas into games.
              </p>
              <p className="text-slate-500 text-sm mb-8 max-w-lg">
                Whether you build, script, design, test, or just love playing — there's a place for you in
                Spawnify Games.
              </p>

              <div className="flex flex-wrap gap-4">
                {/* Roblox */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-xl text-sm"
                >
                  <RobloxIcon className="w-5 h-5" />
                  Join Our Roblox Group
                </a>

                {/* Discord */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#5865F2]/25 text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Join Discord
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#FF0000] hover:bg-[#cc0000] text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/25 text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Subscribe
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#060810]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <SpawnifyLogo className="w-9 h-9 rounded-xl border border-white/10" />
            <div>
              <div className="text-white font-bold text-sm">Spawnify Games</div>
              <div className="text-slate-600 text-xs">where every idea spawns</div>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-5 text-sm">
            {["About", "Games", "Roles", "Join"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-slate-600 hover:text-slate-300 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-slate-700 text-xs text-center">
            © 2025 Spawnify Games — where every idea spawns
          </div>
        </div>
      </footer>
    </div>
  );
}
