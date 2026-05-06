import { useState, useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────── */

function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, vis]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, vis] = useReveal()
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.9s cubic-bezier(0.32,0.72,0,1) ${delay}ms, transform 0.9s cubic-bezier(0.32,0.72,0,1) ${delay}ms`,
    }}>{children}</div>
  )
}

function useCountUp(end, duration = 2000) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - (1 - p) ** 3
      setCount(Math.round(eased * end))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, end, duration])
  return [ref, count]
}

/* ─────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────── */

const I = {
  Home:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Shield:  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Tool:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  Cloud:   () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>,
  Search:  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Wind:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>,
  Dollar:  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Layers:  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  ChevronDown: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ArrowRight:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowUpRight:() => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>,
  Star:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Check:   ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Phone:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.65 3.35 2 2 0 013.62 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.96a16 16 0 006.13 6.13l1.02-.88a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  Mail:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  MapPin:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Instagram:()=> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Facebook: ()=> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  Twitter:  ()=> <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  X:        ()=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Clock:    ()=> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
}

/* ─────────────────────────────────────────────────────────
   LOGO MARK
───────────────────────────────────────────────────────── */

function LogoMark({ size = 36, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof triangle */}
      <path d="M20 4 L38 22 H2 Z" fill={light ? '#E8890C' : '#E8890C'} />
      {/* House body */}
      <rect x="8" y="22" width="24" height="14" rx="1.5" fill={light ? 'white' : '#0D1B2A'} />
      {/* Door */}
      <rect x="16" y="27" width="8" height="9" rx="1" fill={light ? '#E8890C' : '#E8890C'} />
      {/* Check on roof */}
      <path d="M15 15 L19 19 L26 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function WordMark({ light = false }) {
  const primary = light ? 'text-white' : 'text-[#0D1B2A]'
  const secondary = light ? 'text-white/60' : 'text-slate-500'
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-extrabold text-[15px] tracking-tight ${primary}`}>ASSURANCE</span>
      <span className={`font-medium text-[9px] tracking-[0.22em] uppercase mt-[1px] ${secondary}`}>Roofing</span>
    </span>
  )
}

/* ─────────────────────────────────────────────────────────
   SHARED
───────────────────────────────────────────────────────── */

function Eyebrow({ children, light = false }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold ${
      light ? 'bg-white/10 text-white/70' : 'bg-amber-50 border border-amber-200/70 text-amber-700'
    }`}>{children}</span>
  )
}

function CTAButton({ href = '#contact', children = 'Get a Quote', size = 'md', variant = 'dark' }) {
  const sz  = size === 'lg' ? 'px-7 py-3.5 text-[15px]' : 'px-5 py-2.5 text-sm'
  const col = variant === 'dark'
    ? 'bg-[#0D1B2A] text-white hover:bg-[#1E3A5F] shadow-[0_2px_12px_rgba(13,27,42,0.22)]'
    : 'bg-white text-[#0D1B2A] hover:bg-slate-50 shadow-[0_2px_12px_rgba(13,27,42,0.18)]'
  const ic  = variant === 'dark' ? 'bg-white/15' : 'bg-[#0D1B2A]/8'
  return (
    <a href={href} className={`group inline-flex items-center gap-2.5 font-semibold rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${sz} ${col}`}>
      {children}
      <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110 ${ic}`}>
        <I.ArrowUpRight />
      </span>
    </a>
  )
}

/* ─────────────────────────────────────────────────────────
   ANNOUNCEMENT BAR
───────────────────────────────────────────────────────── */

function AnnouncementBar({ onDismiss }) {
  return (
    <div className="bg-[#E8890C] text-white text-[12px] font-semibold px-4 py-2.5 flex items-center justify-center gap-3 relative z-40">
      <span className="hidden sm:inline">⚡</span>
      <span>Storm season is here — <a href="#contact" className="underline underline-offset-2">free roof inspections</a> available this week across Charlotte.</span>
      <a href="tel:+17045550192" className="hidden sm:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors ml-2">
        <I.Phone /> Call Now
      </a>
      <button onClick={onDismiss} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors" aria-label="Dismiss">
        <I.X />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────── */

function Nav({ barVisible }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : '' }, [menuOpen])

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Our Work', href: '#gallery' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ]

  const topOffset = barVisible ? 'top-[40px]' : 'top-0'

  return (
    <>
      <header className={`fixed left-0 right-0 z-30 flex justify-center pt-3 px-4 md:pt-4 transition-all duration-300 ${topOffset}`}>
        <div className={`w-full max-w-5xl flex items-center justify-between px-4 py-2.5 md:px-5 md:py-3 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled ? 'bg-white/96 backdrop-blur-xl shadow-[0_2px_24px_rgba(13,27,42,0.12)]' : 'bg-white/80 backdrop-blur-md'
        }`}>
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <LogoMark size={34} />
            <WordMark />
          </a>

          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(({ label, href }) => (
              <a key={label} href={href}
                className="px-3.5 py-2 text-sm font-medium text-slate-500 hover:text-[#0D1B2A] rounded-full hover:bg-slate-100/80 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="tel:+17045550192"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-[#0D1B2A] hover:text-[#E8890C] transition-colors duration-200">
              <I.Phone /> (704) 555-0192
            </a>
            <a href="#contact"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8890C] text-white text-[13px] font-semibold rounded-full hover:bg-[#d17a0a] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_2px_10px_rgba(232,137,12,0.4)]">
              Get a Quote
            </a>
            <button onClick={() => setMenuOpen(v => !v)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu">
              {[
                menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none',
                null,
                menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none',
              ].map((tr, i) => i === 1 ? (
                <span key={i} className="w-[17px] h-[1.5px] bg-[#0D1B2A] rounded-full block"
                  style={{ opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s, transform 0.3s cubic-bezier(0.32,0.72,0,1)' }} />
              ) : (
                <span key={i} className="w-[17px] h-[1.5px] bg-[#0D1B2A] rounded-full origin-center block"
                  style={{ transform: tr, transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)' }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className="md:hidden fixed inset-0 z-20 bg-[#0D1B2A] flex flex-col items-center justify-center"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity 0.4s cubic-bezier(0.32,0.72,0,1)' }}>
        <nav className="flex flex-col items-center gap-0 w-full px-8">
          {links.map(({ label, href }, i) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}
              className="w-full text-center py-5 text-2xl font-bold text-white hover:text-[#E8890C] border-b border-white/10 last:border-0 transition-colors duration-200"
              style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity 0.5s cubic-bezier(0.32,0.72,0,1) ${100 + i * 55}ms, transform 0.5s cubic-bezier(0.32,0.72,0,1) ${100 + i * 55}ms, color 0.2s` }}>
              {label}
            </a>
          ))}
          <div className="mt-8 flex flex-col items-center gap-3 w-full"
            style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(18px)',
              transition: `opacity 0.5s cubic-bezier(0.32,0.72,0,1) ${100 + links.length * 55}ms, transform 0.5s cubic-bezier(0.32,0.72,0,1) ${100 + links.length * 55}ms` }}>
            <a href="tel:+17045550192" onClick={() => setMenuOpen(false)}
              className="w-full max-w-xs py-4 bg-[#E8890C] text-white text-lg font-bold rounded-full text-center phone-pulse">
              📞 (704) 555-0192
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}
              className="w-full max-w-xs py-4 border-2 border-white/30 text-white text-lg font-semibold rounded-full text-center hover:border-white/60 transition-colors">
              Get a Free Quote
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────── */

const HERO_IMG = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=80'

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden">
      {/* Background with Ken Burns */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center ken-burns"
          style={{
            backgroundImage: `url('${HERO_IMG}'), linear-gradient(135deg, #0D1B2A 0%, #1E3A5F 100%)`,
          }}
        />
        {/* Cinematic dark overlay — heavier on left for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020d18]/92 via-[#0D1B2A]/78 to-[#0D1B2A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020d18]/70 via-transparent to-[#020d18]/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-36 pb-16 sm:pb-24">
        <div className="max-w-2xl flex flex-col gap-6">

          {/* Trust chips */}
          <Reveal delay={0}>
            <div className="flex flex-wrap gap-2">
              {['GAF Master Elite', 'BBB A+ Accredited', 'NC Lic. #67492'].map(t => (
                <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-[11px] font-semibold backdrop-blur-sm">
                  <I.Check size={11} /> {t}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={100}>
            <h1 className="text-[3rem] sm:text-[3.8rem] lg:text-[4.8rem] font-extrabold text-white leading-[1.02] tracking-[-0.03em]">
              Done in a Day.<br />
              <span className="text-[#E8890C]">Built to Last</span><br />
              a Lifetime.
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={200}>
            <p className="text-white/65 text-lg leading-relaxed max-w-[480px]">
              Charlotte&apos;s most trusted residential roofer. We replace your roof in a single day and back every job with a <strong className="text-white/90 font-semibold">lifetime workmanship guarantee</strong> — no exceptions.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={320}>
            <div className="flex flex-wrap items-center gap-4">
              <a href="tel:+17045550192"
                className="phone-pulse inline-flex items-center gap-2.5 px-7 py-4 bg-[#E8890C] text-white text-[15px] font-bold rounded-full hover:bg-[#d17a0a] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <I.Phone />
                (704) 555-0192
              </a>
              <a href="#contact"
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white text-[15px] font-semibold rounded-full hover:bg-white/20 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                Get a Free Quote
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <I.ArrowUpRight />
                </span>
              </a>
            </div>
          </Reveal>

          {/* Google stars */}
          <Reveal delay={420}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <I.Star key={i} />)}
              </div>
              <span className="text-white/55 text-sm">
                <strong className="text-white/80">4.9</strong> out of 5 · 200+ Google Reviews
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Stats bar anchored to bottom */}
      <StatsBar />
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   STATS BAR (animated counters)
───────────────────────────────────────────────────────── */

function StatCounter({ end, suffix, label, staticVal }) {
  const [ref, count] = useCountUp(end || 0, 1800)
  const display = staticVal ?? `${count}${suffix ?? ''}`
  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">{display}</span>
      <span className="text-[11px] text-white/50 font-medium uppercase tracking-wide">{label}</span>
    </div>
  )
}

function StatsBar() {
  return (
    <div className="relative z-10 w-full bg-[#E8890C]">
      <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        <StatCounter end={500}  suffix="+"  label="Roofs Replaced" />
        <StatCounter end={15}   suffix="+"  label="Years in Charlotte" />
        <StatCounter end={0} staticVal="4.9★" label="Google Rating" />
        <StatCounter end={0} staticVal="$0 Down" label="Financing Available" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   SOCIAL PROOF
───────────────────────────────────────────────────────── */

const partners = [
  { name: 'GAF', sub: 'Master Elite Contractor' },
  { name: 'Owens Corning', sub: 'Preferred Contractor' },
  { name: 'CertainTeed', sub: 'ShingleMaster' },
  { name: 'BBB', sub: 'A+ Accredited' },
  { name: 'Angi', sub: 'Super Service Award' },
  { name: 'Google', sub: '4.9 ★ · 200+ Reviews' },
]

function SocialProof() {
  return (
    <section className="py-14 bg-white border-b border-slate-100 px-4">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-8">
            Certified by the Industry&apos;s Best — Trusted by Charlotte Homeowners
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {partners.map(({ name, sub }) => (
              <div key={name}
                className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl bg-slate-50 ring-1 ring-slate-100 hover:ring-slate-200 hover:shadow-[0_4px_16px_rgba(13,27,42,0.06)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] min-w-[96px]">
                <span className="text-[15px] font-bold text-[#0D1B2A] tracking-tight">{name}</span>
                <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">{sub}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   FEATURES / SERVICES
───────────────────────────────────────────────────────── */

const features = [
  { Icon: I.Home,   title: 'ReRoofs & Replacements',       desc: 'Full tear-off and installation using premium shingles with transferable manufacturer warranties you can pass to future buyers.' },
  { Icon: I.Shield, title: 'Insurance Claims',              desc: 'We guide you through every step — documentation, adjuster meetings, supplements — so you get the full settlement you deserve.' },
  { Icon: I.Tool,   title: 'Maintenance & Repairs',         desc: 'Scheduled tune-ups and fast targeted repairs that catch small issues early and add years of life to your existing roof.' },
  { Icon: I.Cloud,  title: 'Storm Damage Claims',           desc: "After hail, wind, or severe weather we inspect, document, and file — you won't pay more than your deductible." },
  { Icon: I.Dollar, title: 'Flexible Financing',            desc: 'Get the roof you need today with payment plans that fit your budget. Quick approvals and $0 down options available.' },
  { Icon: I.Layers, title: 'Roofing, Siding & Gutters',     desc: 'One crew, one project, one contact. We handle your full exterior — roof, siding, and seamless gutter systems together.' },
]

function Features() {
  return (
    <section id="services" className="py-28 px-4 bg-[#F7F8FA]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <Eyebrow>What We Do</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight max-w-xl">
              Every service your home needs, under one roof.
            </h2>
            <p className="text-slate-500 text-[17px] max-w-md leading-relaxed">
              From a single shingle to a complete exterior, we have the team, tools, and certifications to get it done right.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 60}>
              <div className="group p-[5px] rounded-[1.4rem] bg-white ring-1 ring-black/[0.055] shadow-[0_2px_12px_rgba(13,27,42,0.05)] hover:shadow-[0_10px_36px_rgba(13,27,42,0.1)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] h-full">
                <div className="rounded-[calc(1.4rem-5px)] bg-white p-7 h-full flex flex-col gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0D1B2A] group-hover:bg-[#E8890C]/10 group-hover:text-[#E8890C] transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D1B2A] text-[15px] mb-1.5">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   WHY US / OUR PROCESS
───────────────────────────────────────────────────────── */

const steps = [
  { n: '01', title: 'Free Inspection',        desc: 'We come to you. Our certified inspector assesses your roof, photographs everything, and gives you an honest written report at zero cost.' },
  { n: '02', title: 'We Handle Your Claim',   desc: 'If insurance applies, we document the damage, file the claim, and communicate directly with your adjuster — so you never have to fight alone.' },
  { n: '03', title: 'Installation Day',        desc: 'Your new roof installed in a single day. Our crew arrives early, protects your landscaping, and leaves your property spotless before sundown.' },
  { n: '04', title: 'Lifetime Guarantee',      desc: 'Every job is backed by our lifetime workmanship warranty. If anything fails due to our work, we fix it. Full stop. No questions asked.' },
]

const WHY_IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80'

function WhyUs() {
  return (
    <section className="py-28 px-4 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: photo — Double-Bezel */}
          <Reveal delay={0}>
            <div className="relative">
              <div className="p-[5px] rounded-[2rem] bg-slate-100 ring-1 ring-black/[0.06] shadow-[0_24px_64px_rgba(13,27,42,0.13)]">
                <div className="rounded-[calc(2rem-5px)] overflow-hidden aspect-[4/5] bg-slate-200">
                  <img
                    src={WHY_IMG}
                    alt="Assurance Roofing crew installing a roof in Charlotte NC"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-4 lg:-right-8 bg-[#E8890C] text-white rounded-2xl px-5 py-4 shadow-[0_12px_32px_rgba(232,137,12,0.4)]">
                <div className="text-2xl font-extrabold leading-none">15+</div>
                <div className="text-[11px] font-semibold opacity-80 mt-0.5 uppercase tracking-wide">Years Serving<br />Charlotte</div>
              </div>
            </div>
          </Reveal>

          {/* Right: process steps */}
          <div className="flex flex-col gap-6">
            <Reveal delay={100}>
              <Eyebrow>How It Works</Eyebrow>
            </Reveal>
            <Reveal delay={150}>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                Four steps from damaged to done.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-[17px] text-slate-500 leading-relaxed">
                We built our process around one goal: make getting a new roof the easiest thing you do this year.
              </p>
            </Reveal>

            <div className="flex flex-col gap-5 mt-2">
              {steps.map(({ n, title, desc }, i) => (
                <Reveal key={n} delay={250 + i * 70}>
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#0D1B2A] flex items-center justify-center text-[#E8890C] text-[13px] font-extrabold group-hover:bg-[#E8890C] group-hover:text-white transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      {n}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0D1B2A] text-[15px] mb-1">{title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={550}>
              <div className="pt-2">
                <CTAButton href="#contact" size="lg">Schedule My Free Inspection</CTAButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   GALLERY
───────────────────────────────────────────────────────── */

const projects = [
  { img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80', hood: 'Ballantyne', service: 'Full Roof Replacement', detail: 'GAF Timberline HDZ — Charcoal' },
  { img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80', hood: 'Myers Park', service: 'Storm Damage Claim', detail: 'Owens Corning Duration — Estate Gray' },
  { img: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80', hood: 'Dilworth', service: 'Roof + Siding + Gutters', detail: 'CertainTeed Landmark — Weathered Wood' },
  { img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80', hood: 'Huntersville', service: 'Insurance Claim Replacement', detail: 'GAF Timberline HDZ — Pewter Gray' },
]

function Gallery() {
  return (
    <section id="gallery" className="py-28 px-4 bg-[#F7F8FA]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div className="flex flex-col gap-3">
              <Eyebrow>Recent Projects</Eyebrow>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                Our work across Charlotte.
              </h2>
            </div>
            <a href="#contact" className="text-sm font-semibold text-[#E8890C] hover:text-[#0D1B2A] transition-colors flex items-center gap-1.5 flex-shrink-0">
              Get your quote <I.ArrowRight />
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {projects.map(({ img, hood, service, detail }, i) => (
            <Reveal key={hood} delay={i * 70}>
              <div className="group rounded-[1.4rem] overflow-hidden bg-slate-900 ring-1 ring-black/[0.06] shadow-[0_4px_24px_rgba(13,27,42,0.1)] hover:shadow-[0_16px_48px_rgba(13,27,42,0.18)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                {/* Image */}
                <div className="relative overflow-hidden h-52 sm:h-60">
                  <img src={img} alt={`${service} in ${hood}, Charlotte NC`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0'; e.target.parentElement.style.background = 'linear-gradient(135deg,#0D1B2A,#1E3A5F)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent" />
                  {/* Neighborhood badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#E8890C] text-white text-[11px] font-bold rounded-full">
                    {hood}
                  </div>
                </div>
                {/* Info */}
                <div className="bg-white px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#0D1B2A] text-[14px]">{service}</div>
                    <div className="text-[12px] text-slate-400 mt-0.5">{detail}</div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400 flex-shrink-0">
                    {[...Array(5)].map((_, j) => <I.Star key={j} />)}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────── */

const testimonials = [
  { quote: 'Assurance replaced our entire roof after a major hailstorm and handled everything with our insurance adjuster. The crew finished in less than two days and left our yard spotless. Best contractor experience I have ever had.', name: 'Sarah M.', role: 'Homeowner · Ballantyne', initials: 'SM', color: 'from-blue-500 to-indigo-600' },
  { quote: 'We got five quotes and Assurance was the only contractor who did a thorough inspection before pricing anything. They found damage two others completely missed. Honest, fair, and they delivered exactly what they promised.', name: 'James & Lisa T.', role: 'Homeowners · Myers Park', initials: 'JL', color: 'from-amber-500 to-orange-600' },
  { quote: 'Called them Tuesday after a leak appeared overnight. Someone was on my roof Thursday morning and the repair was done the same day. Three months later, zero issues. I tell every neighbor about them.', name: 'Marcus R.', role: 'Homeowner · Dilworth', initials: 'MR', color: 'from-emerald-500 to-teal-600' },
]

function Testimonials() {
  return (
    <section id="testimonials" className="py-28 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <Eyebrow>What Homeowners Say</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">Real words from real neighbors.</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="flex items-center gap-0.5 text-amber-400">{[...Array(5)].map((_, i) => <I.Star key={i} />)}</div>
              <strong className="text-[#0D1B2A]">4.9</strong> average across 200+ verified Google Reviews
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ quote, name, role, initials, color }, i) => (
            <Reveal key={name} delay={i * 80}>
              <div className="p-[5px] rounded-[1.4rem] bg-[#F7F8FA] ring-1 ring-black/[0.05] h-full">
                <div className="rounded-[calc(1.4rem-5px)] bg-white p-7 h-full flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-amber-400">{[...Array(5)].map((_, j) => <I.Star key={j} />)}</div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Google Review</span>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{initials}</div>
                    <div>
                      <div className="text-sm font-bold text-[#0D1B2A]">{name}</div>
                      <div className="text-[11px] text-slate-400">{role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────── */

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const ic = 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D1B2A] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#E8890C]/50 focus:bg-white focus:ring-2 focus:ring-[#E8890C]/10 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'

  return (
    <section id="contact" className="py-28 px-4 bg-[#F7F8FA]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <Reveal>
            <div className="flex flex-col gap-6">
              <Eyebrow>Get in Touch</Eyebrow>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                Request your free roof inspection.
              </h2>
              <p className="text-[17px] text-slate-500 leading-relaxed">
                No pressure, no obligation. A certified inspector will assess your roof, document any damage, and walk you through every option — completely free.
              </p>
              <div className="flex flex-col gap-5 pt-2">
                {[
                  { Icon: I.Phone,  label: '(704) 555-0192', sub: 'Mon – Sat · 7am – 7pm' },
                  { Icon: I.Mail,   label: 'hello@assuranceroofingus.com', sub: 'Response within 2 hours' },
                  { Icon: I.MapPin, label: 'Charlotte, NC & Surrounding Areas', sub: 'Ballantyne, Myers Park, Dilworth, Lake Norman & more' },
                  { Icon: I.Clock,  label: '24/7 Emergency Service', sub: 'For active leaks and storm damage' },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0D1B2A] flex-shrink-0 mt-0.5"><Icon /></div>
                    <div>
                      <div className="text-sm font-semibold text-[#0D1B2A]">{label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="p-[5px] rounded-[1.6rem] bg-white ring-1 ring-black/[0.055] shadow-[0_8px_40px_rgba(13,27,42,0.1)]">
              <div className="rounded-[calc(1.6rem-5px)] bg-white p-7 sm:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#0D1B2A]">You&apos;re all set!</h3>
                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">We&apos;ll reach out within 2 hours to schedule your free inspection. Check your email for confirmation.</p>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                        <input type="text" required placeholder="Jane Smith" className={ic} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Email</label>
                        <input type="email" required placeholder="jane@email.com" className={ic} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Phone <span className="text-slate-400 normal-case font-normal tracking-normal">(optional)</span></label>
                      <input type="tel" placeholder="(704) 555-0000" className={ic} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Service Needed</label>
                      <select className={ic} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                        <option value="">Select a service…</option>
                        <option>ReRoof / Roof Replacement</option>
                        <option>Insurance Claim</option>
                        <option>Preventative Maintenance &amp; Repairs</option>
                        <option>Storm Damage Claim</option>
                        <option>Financing</option>
                        <option>Roofing, Siding &amp; Gutters</option>
                        <option>Not Sure — I Need an Assessment</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Message</label>
                      <textarea rows={4} placeholder="Tell us about your roof or situation…" className={`${ic} resize-none`} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button type="submit"
                      className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#E8890C] text-white text-[15px] font-bold rounded-full hover:bg-[#d17a0a] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_2px_16px_rgba(232,137,12,0.35)] mt-1">
                      Schedule My Free Inspection
                      <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110">
                        <I.ArrowUpRight />
                      </span>
                    </button>
                    <p className="text-center text-[11px] text-slate-400">No spam. No pressure. We&apos;ll only contact you about your request.</p>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────── */

const faqs = [
  { q: 'How long does a full roof replacement take?', a: 'Most residential replacements are completed in a single day. Larger or complex roofs may take two days. We arrive early, work efficiently, and do a thorough cleanup before leaving.' },
  { q: 'Will my homeowners insurance cover the damage?', a: 'Storm, wind, and hail damage is typically covered under standard homeowners policies. We assist with the entire claim process — documenting damage, communicating with your adjuster, and ensuring you get a fair settlement.' },
  { q: 'What roofing brands and materials do you install?', a: 'We install shingles from GAF, Owens Corning, and CertainTeed — the three industry leaders. We offer 3-tab, architectural, and premium designer shingles based on your budget and preference.' },
  { q: 'How do I know if I need repair or a full replacement?', a: "That's exactly what our free inspection determines. We examine decking, flashing, ventilation, and shingles then give you an honest recommendation — we won't push a replacement when repairs will do the job." },
  { q: 'Are you licensed and insured in North Carolina?', a: 'Yes. Assurance Roofing holds NC General Contractors License #NC-67492 and carries full general liability and workers compensation insurance. We provide certificates on request.' },
  { q: 'What areas of Charlotte do you serve?', a: 'We serve all of Charlotte and the metro: Ballantyne, Myers Park, Dilworth, NoDa, Huntersville, Cornelius, Concord, Mooresville, and Gastonia.' },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" className="py-28 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <Eyebrow>Common Questions</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">Everything you want to know.</h2>
          </div>
        </Reveal>
        <div className="flex flex-col gap-3">
          {faqs.map(({ q, a }, i) => (
            <Reveal key={q} delay={i * 45}>
              <div className="rounded-2xl ring-1 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ boxShadow: open === i ? '0 4px 24px rgba(13,27,42,0.07)' : '0 1px 4px rgba(13,27,42,0.04)' }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-slate-50/60 transition-colors duration-200">
                  <span className="font-semibold text-[15px] text-[#0D1B2A] leading-snug">{q}</span>
                  <span className="text-slate-400 flex-shrink-0"
                    style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)' }}>
                    <I.ChevronDown />
                  </span>
                </button>
                <div style={{ maxHeight: open === i ? '300px' : '0px', overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.32,0.72,0,1)' }}>
                  <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   BOTTOM CTA
───────────────────────────────────────────────────────── */

function BottomCTA() {
  return (
    <section className="py-8 px-4 bg-[#F7F8FA]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="p-[5px] rounded-[2rem] bg-[#0D1B2A] shadow-[0_24px_64px_rgba(13,27,42,0.3)]">
            <div className="rounded-[calc(2rem-5px)] bg-gradient-to-br from-[#0D1B2A] via-[#132337] to-[#1a3860] px-8 py-16 sm:px-16 sm:py-20 text-center flex flex-col items-center gap-7">
              <Eyebrow light>Charlotte&apos;s Roofing Experts</Eyebrow>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.05] max-w-2xl">
                Don&apos;t wait for a small leak to become a disaster.
              </h2>
              <p className="text-[17px] text-white/55 max-w-md leading-relaxed">
                Schedule your free inspection today. Honest assessment, no obligation, no pressure — just answers.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="tel:+17045550192"
                  className="phone-pulse inline-flex items-center gap-2.5 px-8 py-4 bg-[#E8890C] text-white text-[15px] font-bold rounded-full hover:bg-[#d17a0a] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <I.Phone /> (704) 555-0192
                </a>
                <a href="#contact"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 border border-white/25 text-white text-[15px] font-semibold rounded-full hover:bg-white/20 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  Get a Free Quote
                  <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"><I.ArrowUpRight /></span>
                </a>
              </div>
              <p className="text-[12px] text-white/30">Available Mon – Sat · 7am – 7pm · Emergency line 24 ⁄ 7</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */

function Footer() {
  const services = ['ReRoofs & Replacements', 'Insurance Claims', 'Maintenance & Repairs', 'Storm Damage Claims', 'Financing', 'Roofing, Siding & Gutters']
  const company  = ['About Us', 'Reviews', 'Our Work', 'Careers', 'Privacy Policy', 'Terms of Service']
  const companyLinks = ['#', '#', '#gallery', '#', '#privacy', '#terms']

  return (
    <footer className="bg-[#0D1B2A] text-white pt-16 pb-8 px-4 mt-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <LogoMark size={36} light />
              <WordMark light />
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">
              Protecting Charlotte homes since 2008. Licensed, insured, and built on trust.
            </p>
            <div className="flex items-center gap-3">
              {[{ Icon: I.Instagram, l: 'Instagram' }, { Icon: I.Facebook, l: 'Facebook' }, { Icon: I.Twitter, l: 'Twitter' }].map(({ Icon, l }) => (
                <a key={l} href="#" aria-label={l}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 mb-5">Services</h4>
            <ul className="flex flex-col gap-2.5">
              {services.map(s => <li key={s}><a href="#services" className="text-sm text-white/55 hover:text-white transition-colors duration-200">{s}</a></li>)}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 mb-5">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {company.map((s, i) => <li key={s}><a href={companyLinks[i]} className="text-sm text-white/55 hover:text-white transition-colors duration-200">{s}</a></li>)}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 mb-5">Contact</h4>
            <div className="flex flex-col gap-4">
              {[{ Icon: I.Phone, t: '(704) 555-0192' }, { Icon: I.Mail, t: 'hello@assuranceroofingus.com' }, { Icon: I.MapPin, t: 'Charlotte, NC 28202' }].map(({ Icon, t }) => (
                <div key={t} className="flex items-center gap-2.5 text-sm text-white/55"><Icon /><span>{t}</span></div>
              ))}
              <div className="mt-1 px-3.5 py-2.5 rounded-xl bg-white/[0.06] text-xs text-white/45 leading-relaxed">
                Mon – Sat: 7am – 7pm<br />Emergency: 24 ⁄ 7
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/25">
          <p>© {new Date().getFullYear()} Assurance Roofing LLC · assuranceroofingus.com</p>
          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#terms"   className="hover:text-white/50 transition-colors">Terms of Service</a>
            <span>NC License #NC-67492</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────
   STICKY MOBILE CTA
───────────────────────────────────────────────────────── */

function StickyMobileCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  if (!show) return null
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_24px_rgba(13,27,42,0.12)] slide-up">
      <div className="flex gap-3 max-w-sm mx-auto">
        <a href="tel:+17045550192"
          className="phone-pulse flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#E8890C] text-white text-[14px] font-bold rounded-2xl">
          <I.Phone /> Call Now
        </a>
        <a href="#contact"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0D1B2A] text-white text-[14px] font-bold rounded-2xl">
          Get a Quote
        </a>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   PRIVACY POLICY PAGE
───────────────────────────────────────────────────────── */

function PrivacyPage() {
  const lastUpdated = 'January 15, 2026'
  return (
    <div className="min-h-[100dvh] bg-[#F7F8FA]">
      {/* Hero strip */}
      <section className="bg-[#0D1B2A] pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/50 text-sm">
            Effective {lastUpdated} &middot; Last updated {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-[5px] rounded-[2rem] bg-slate-100 ring-1 ring-black/[0.06] shadow-[0_8px_40px_rgba(13,27,42,0.1)]">
            <div className="rounded-[calc(2rem-5px)] bg-white p-8 sm:p-10 flex flex-col gap-10">

              <Section>
                <SectionTitle>1. Information We Collect</SectionTitle>
                <P>
                  Assurance Roofing LLC ("Assurance Roofing," "we," "us," or "our") collects information you voluntarily provide when you interact with our website, request a quote, schedule an inspection, or contact us by phone or email. This may include:
                </P>
                <BulletList items={[
                  'Personal identifiers such as your full name, email address, phone number, and property address.',
                  'Details about your roofing project, including the type of service requested, description of damage, and preferred appointment times.',
                  'Communication records including emails, contact form submissions, and call recordings (where disclosed).',
                  'Technical data automatically collected when you visit our site, including IP address, browser type, device information, referring pages, and timestamps.',
                ]} />
              </Section>

              <Section>
                <SectionTitle>2. How We Use Your Information</SectionTitle>
                <P>
                  We use the information we collect to operate, maintain, and improve our services. Specifically, we use your information to:
                </P>
                <BulletList items={[
                  'Provide, schedule, and fulfill the roofing services and inspections you request.',
                  'Communicate with you about your project, appointments, estimates, and follow-up needs.',
                  'Send you relevant service updates, seasonal maintenance reminders, and promotional offers (you may opt out at any time).',
                  'Improve our website, services, and customer experience through analytics and feedback.',
                  'Comply with legal obligations, resolve disputes, and enforce our Terms of Service.',
                ]} />
                <P>
                  We do not sell, rent, or lease your personal information to third parties. We may share information with trusted service providers who assist us in operating our business (e.g., CRM platforms, email delivery services, payment processors), subject to strict confidentiality obligations.
                </P>
              </Section>

              <Section>
                <SectionTitle>3. Cookies and Tracking Technologies</SectionTitle>
                <P>
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings. Disabling cookies may affect certain functionality of our site.
                </P>
              </Section>

              <Section>
                <SectionTitle>4. Data Retention</SectionTitle>
                <P>
                  We retain your personal information for as long as necessary to fulfill the purposes described in this policy, or as required by applicable law. Service records and correspondence are typically retained for the duration of the customer relationship plus a reasonable period thereafter for legal and business record-keeping purposes.
                </P>
              </Section>

              <Section>
                <SectionTitle>5. Your Rights and Choices</SectionTitle>
                <P>
                  Depending on your jurisdiction, you may have the right to:
                </P>
                <BulletList items={[
                  'Access the personal information we hold about you.',
                  'Request correction of inaccurate or incomplete data.',
                  'Request deletion of your personal information, subject to legal retention requirements.',
                  'Opt out of marketing communications at any time by using the unsubscribe link in our emails or contacting us directly.',
                  'File a complaint with your local data protection authority if you believe your rights have been violated.',
                ]} />
                <P>
                  To exercise any of these rights, please contact us using the information provided in Section 7.
                </P>
              </Section>

              <Section>
                <SectionTitle>6. Data Security</SectionTitle>
                <P>
                  We implement industry-standard administrative, technical, and physical safeguards to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </P>
              </Section>

              <Section>
                <SectionTitle>7. Contact Information</SectionTitle>
                <P>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </P>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center gap-2.5 text-sm text-slate-600"><I.Mail /><span>privacy@assuranceroofingus.com</span></div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600"><I.Phone /><span>(704) 286-6577</span></div>
                  <div className="flex items-start gap-2.5 text-sm text-slate-600"><span className="flex-shrink-0 mt-0.5"><I.MapPin /></span><span>650 E. Brooklyn Village Ave, Charlotte, NC 28202</span></div>
                </div>
              </Section>

              <Section>
                <SectionTitle>8. Changes to This Policy</SectionTitle>
                <P>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational needs. We will post the updated policy on this page and revise the "Effective" date accordingly. Continued use of our website after any changes constitutes acceptance of the revised policy.
                </P>
              </Section>

              {/* Back link */}
              <div className="pt-4 border-t border-slate-100">
                <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D1B2A] text-white text-sm font-semibold rounded-full hover:bg-[#1E3A5F] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_2px_12px_rgba(13,27,42,0.22)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Back to Home
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   TERMS OF SERVICE PAGE
───────────────────────────────────────────────────────── */

function TermsPage() {
  const lastUpdated = 'January 15, 2026'
  return (
    <div className="min-h-[100dvh] bg-[#F7F8FA]">
      {/* Hero strip */}
      <section className="bg-[#0D1B2A] pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-white/50 text-sm">
            Effective {lastUpdated} &middot; Last updated {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-[5px] rounded-[2rem] bg-slate-100 ring-1 ring-black/[0.06] shadow-[0_8px_40px_rgba(13,27,42,0.1)]">
            <div className="rounded-[calc(2rem-5px)] bg-white p-8 sm:p-10 flex flex-col gap-10">

              <Section>
                <SectionTitle>1. Acceptance of Terms</SectionTitle>
                <P>
                  By accessing or using the Assurance Roofing website (assuranceroofingus.com), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all terms and conditions, you must discontinue use of this website immediately. These Terms constitute a legally binding agreement between you and Assurance Roofing LLC, a North Carolina limited liability company ("Assurance Roofing," "we," "us," or "our").
                </P>
              </Section>

              <Section>
                <SectionTitle>2. Services Provided</SectionTitle>
                <P>
                  Assurance Roofing provides residential roofing services including but not limited to: roof replacements, storm damage restoration, insurance claims assistance, roof inspections, preventative maintenance, siding installation, and gutter system installation. All services are provided subject to a separate written agreement, proposal, or contract executed between you and Assurance Roofing. Nothing on this website constitutes a binding offer to perform services.
                </P>
              </Section>

              <Section>
                <SectionTitle>3. Estimates and Pricing</SectionTitle>
                <P>
                  Any estimates, quotes, or pricing information provided through our website, over the phone, or via email are non-binding approximations based on the information you provide. Final pricing is determined after an in-person inspection and is documented in a formal written proposal. We reserve the right to modify pricing based on actual site conditions, material availability, and scope changes.
                </P>
              </Section>

              <Section>
                <SectionTitle>4. Intellectual Property</SectionTitle>
                <P>
                  All content on this website, including text, graphics, logos, icons, images, photographs, and software, is the exclusive property of Assurance Roofing LLC or its content suppliers and is protected by United States and international copyright, trademark, and intellectual property laws. You may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise exploit any content without our prior written consent.
                </P>
              </Section>

              <Section>
                <SectionTitle>5. User Conduct</SectionTitle>
                <P>
                  When using our website or communicating with us, you agree not to:
                </P>
                <BulletList items={[
                  'Submit false, misleading, or fraudulent information through our contact or quote request forms.',
                  'Use our website for any unlawful purpose or in violation of any applicable local, state, or federal law.',
                  'Attempt to gain unauthorized access to any portion of our website, server, or systems.',
                  'Transmit any viruses, malware, or harmful code through our contact forms or any interactive feature.',
                  'Engage in any activity that interferes with or disrupts the proper functioning of our website.',
                ]} />
              </Section>

              <Section>
                <SectionTitle>6. Third-Party Links</SectionTitle>
                <P>
                  Our website may contain links to third-party websites or services that are not owned or controlled by Assurance Roofing. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. You acknowledge and agree that Assurance Roofing is not liable for any damage or loss caused by your use of any third-party content or website.
                </P>
              </Section>

              <Section>
                <SectionTitle>7. Limitation of Liability</SectionTitle>
                <P>
                  To the fullest extent permitted by applicable law, Assurance Roofing LLC, its owners, employees, contractors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your use of or inability to use our website, whether based on warranty, contract, tort, or any other legal theory, even if we have been advised of the possibility of such damages.
                </P>
                <P>
                  Our total liability for any claims arising from your use of the website is limited to the amount you paid us, if any, for accessing the website during the twelve months preceding the claim.
                </P>
              </Section>

              <Section>
                <SectionTitle>8. Disclaimer of Warranties</SectionTitle>
                <P>
                  This website and all information, content, and services provided through it are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. To the fullest extent permitted by law, we disclaim all warranties, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. We do not warrant that the website will be uninterrupted, error-free, secure, or free of viruses or other harmful components.
                </P>
              </Section>

              <Section>
                <SectionTitle>9. Indemnification</SectionTitle>
                <P>
                  You agree to indemnify, defend, and hold harmless Assurance Roofing LLC, its officers, directors, employees, agents, and contractors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your violation of these Terms, your use of the website, or your infringement of any third-party rights.
                </P>
              </Section>

              <Section>
                <SectionTitle>10. Governing Law and Dispute Resolution</SectionTitle>
                <P>
                  These Terms shall be governed by and construed in accordance with the laws of the State of North Carolina, without regard to its conflict of law provisions. Any dispute arising out of or relating to these Terms or your use of our website shall be resolved exclusively in the state or federal courts located in Mecklenburg County, North Carolina. You agree to submit to the personal jurisdiction of such courts.
                </P>
              </Section>

              <Section>
                <SectionTitle>11. Changes to Terms</SectionTitle>
                <P>
                  We reserve the right to modify or replace these Terms at any time at our sole discretion. We will post the updated Terms on this page and update the "Effective" date. Your continued use of the website after any changes constitutes acceptance of the revised Terms. It is your responsibility to review these Terms periodically.
                </P>
              </Section>

              <Section>
                <SectionTitle>12. Contact Us</SectionTitle>
                <P>
                  For questions about these Terms of Service, please contact us:
                </P>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center gap-2.5 text-sm text-slate-600"><I.Mail /><span>legal@assuranceroofingus.com</span></div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600"><I.Phone /><span>(704) 286-6577</span></div>
                  <div className="flex items-start gap-2.5 text-sm text-slate-600"><span className="flex-shrink-0 mt-0.5"><I.MapPin /></span><span>650 E. Brooklyn Village Ave, Charlotte, NC 28202</span></div>
                </div>
              </Section>

              {/* Back link */}
              <div className="pt-4 border-t border-slate-100">
                <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D1B2A] text-white text-sm font-semibold rounded-full hover:bg-[#1E3A5F] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_2px_12px_rgba(13,27,42,0.22)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Back to Home
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   LEGAL PAGE HELPERS
───────────────────────────────────────────────────────── */

function Section({ children }) {
  return <div className="flex flex-col gap-3">{children}</div>
}

function SectionTitle({ children }) {
  return <h2 className="text-xl font-bold text-[#0D1B2A] pb-1 border-b border-amber-200/70">{children}</h2>
}

function P({ children }) {
  return <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
}

function BulletList({ items }) {
  return (
    <ul className="flex flex-col gap-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-slate-600 leading-relaxed list-disc">{item}</li>
      ))}
    </ul>
  )
}

/* ─────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────── */

export default function App() {
  const [barVisible, setBarVisible] = useState(true)
  const [page, setPage] = useState(() => {
    const h = window.location.hash
    if (h === '#privacy') return 'privacy'
    if (h === '#terms') return 'terms'
    return 'home'
  })

  useEffect(() => {
    const fn = () => {
      const h = window.location.hash
      if (h === '#privacy') setPage('privacy')
      else if (h === '#terms') setPage('terms')
      else setPage('home')
    }
    window.addEventListener('hashchange', fn)
    return () => window.removeEventListener('hashchange', fn)
  }, [])

  // Scroll to top on page transitions; scroll to anchor on home page
  useEffect(() => {
    const h = window.location.hash
    if (page === 'home' && h && h !== '#privacy' && h !== '#terms') {
      // Home page anchor link — scroll to the section after render
      const id = h.slice(1)
      const attempt = () => {
        const el = document.getElementById(id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 100
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }
      // Wait for React to flush the DOM, then try up to 3 times
      setTimeout(attempt, 0)
      setTimeout(attempt, 100)
      setTimeout(attempt, 300)
    } else {
      // Legal page or bare # — scroll to absolute top
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [page])

  if (page === 'privacy') {
    return (
      <div className="font-sans">
        {barVisible && <AnnouncementBar onDismiss={() => setBarVisible(false)} />}
        <Nav barVisible={barVisible} />
        <main><PrivacyPage /></main>
        <Footer />
      </div>
    )
  }

  if (page === 'terms') {
    return (
      <div className="font-sans">
        {barVisible && <AnnouncementBar onDismiss={() => setBarVisible(false)} />}
        <Nav barVisible={barVisible} />
        <main><TermsPage /></main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="font-sans">
      {barVisible && <AnnouncementBar onDismiss={() => setBarVisible(false)} />}
      <Nav barVisible={barVisible} />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <WhyUs />
        <Gallery />
        <Testimonials />
        <Contact />
        <FAQ />
        <BottomCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  )
}
