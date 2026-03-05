import { useState, useEffect, useRef, useCallback } from "react";

const ACCENT  = "#00e5ff";
const ACCENT2 = "#7000ff";
const ACCENT3 = "#ff006e";

/* ─── GLOBAL STYLES ─────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #03030a;
      --surface: #07070f;
      --card: #0c0c1a;
      --border: rgba(0,229,255,0.08);
      --accent: #00e5ff;
      --accent2: #7000ff;
      --accent3: #ff006e;
      --text: #dde0f0;
      --muted: #4a4a70;
    }

    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'IBM Plex Mono', monospace;
      overflow-x: hidden;
      cursor: none;
    }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    .font-display { font-family: 'Syne', sans-serif; }
    .font-jp      { font-family: 'Shippori Mincho', serif; }
    .font-mono    { font-family: 'IBM Plex Mono', monospace; }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes float    { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-8px) rotate(.5deg)} 66%{transform:translateY(-4px) rotate(-.5deg)} }
    @keyframes spin-slow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes pulse-glow {
      0%,100%{ box-shadow:0 0 15px rgba(0,229,255,.2),0 0 30px rgba(0,229,255,.05) }
      50%    { box-shadow:0 0 30px rgba(0,229,255,.4),0 0 60px rgba(0,229,255,.1) }
    }
    @keyframes glitch1 {
      0%,100%{clip-path:inset(0 0 95% 0);transform:translate(-2px,0)}
      25%    {clip-path:inset(30% 0 50% 0);transform:translate(2px,0)}
      50%    {clip-path:inset(60% 0 20% 0);transform:translate(-1px,0)}
      75%    {clip-path:inset(80% 0 5% 0);transform:translate(1px,0)}
    }
    @keyframes glitch2 {
      0%,100%{clip-path:inset(80% 0 5% 0);transform:translate(2px,0)}
      25%    {clip-path:inset(10% 0 75% 0);transform:translate(-2px,0)}
      50%    {clip-path:inset(50% 0 30% 0);transform:translate(1px,0)}
      75%    {clip-path:inset(20% 0 65% 0);transform:translate(-1px,0)}
    }

    @keyframes navItemIn {
      from { opacity:0; transform:translateY(-12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes modalIn {
      from { opacity:0; transform:scale(.94) translateY(30px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    @keyframes modalBgIn {
      from { opacity:0; } to { opacity:1; }
    }
    @keyframes ripple {
      from { transform:scale(0); opacity:.6; }
      to   { transform:scale(3); opacity:0; }
    }
    @keyframes slideIndicator {
      from { opacity:0; width:0; } to { opacity:1; }
    }
    @keyframes shimmer {
      0%   { background-position:-200% center; }
      100% { background-position:200% center; }
    }

    .reveal-hidden {
      opacity:0; transform:translateY(50px);
      transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);
    }
    .reveal-visible { opacity:1; transform:translateY(0); }

    .mag-btn { transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease; will-change:transform; }
    .mag-btn:hover { box-shadow:0 0 40px rgba(0,229,255,.3),0 0 80px rgba(0,229,255,.1); }
    .card-3d { transition:transform .1s ease-out,box-shadow .3s ease; will-change:transform; }
    .skill-bar-fill { transition:width 1.5s cubic-bezier(.16,1,.3,1); }

    /* ── NAV LINK ── */
    .nav-item {
      position:relative; background:none; border:none; cursor:none;
      font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:400;
      letter-spacing:0.22em; text-transform:uppercase; color:var(--muted);
      padding:6px 2px; transition:color .25s; opacity:0;
      animation: navItemIn .5s cubic-bezier(.16,1,.3,1) forwards;
    }
    .nav-item::after {
      content:''; position:absolute; bottom:-2px; left:0; right:0;
      height:1px; background:var(--accent);
      transform:scaleX(0); transform-origin:left;
      transition:transform .3s cubic-bezier(.16,1,.3,1);
    }
    .nav-item:hover { color:var(--accent); }
    .nav-item:hover::after { transform:scaleX(1); }
    .nav-item.active { color:var(--accent); }
    .nav-item.active::after { transform:scaleX(1); }

    /* ── MODAL FORM FIELDS ── */
    .modal-input {
      width:100%; background:rgba(0,229,255,0.03);
      border:1px solid rgba(0,229,255,0.12); border-radius:3px;
      color:#dde0f0; font-family:'IBM Plex Mono',monospace;
      font-size:13px; padding:14px 16px; outline:none;
      transition:border-color .3s, box-shadow .3s, background .3s;
      resize:none;
    }
    .modal-input::placeholder { color:#4a4a70; }
    .modal-input:focus {
      border-color:rgba(0,229,255,0.5);
      box-shadow:0 0 0 3px rgba(0,229,255,0.06), 0 0 20px rgba(0,229,255,0.08);
      background:rgba(0,229,255,0.05);
    }
    .modal-input:focus::placeholder { color:#6a6a90; }

    /* ── RESPONSIVE GRIDS ── */
    .grid-2col  { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }
    .grid-2card { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
    .grid-3vid  { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .grid-4stat { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .grid-skills{ display:grid; grid-template-columns:1fr 1fr; gap:72px; }
    .grid-social{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .section-pad{ padding:100px 0; }
    .inner      { max-width:1200px; margin:0 auto; padding:0 40px; }
    .footer-bar { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }

    @media (max-width:960px) {
      .grid-2col   { grid-template-columns:1fr; gap:48px; }
      .grid-skills { grid-template-columns:1fr; gap:44px; }
      .grid-3vid   { grid-template-columns:repeat(2,1fr); }
      .grid-social { grid-template-columns:repeat(2,1fr); }
      .section-pad { padding:72px 0; }
      .inner       { padding:0 24px; }
    }
    @media (max-width:640px) {
      .grid-2card  { grid-template-columns:1fr; }
      .grid-3vid   { grid-template-columns:1fr; }
      .grid-social { grid-template-columns:1fr 1fr; }
      .inner       { padding:0 16px; }
      .footer-bar  { flex-direction:column; text-align:center; }
    }
  `}</style>
);

/* ─── CUSTOM CURSOR ──────────────────────────────────── */
const Cursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const posRef  = useRef({ x:-100, y:-100 });
  const ringPos = useRef({ x:-100, y:-100 });
  const hov     = useRef(false);

  useEffect(() => {
    const onMove = (e) => { posRef.current = { x:e.clientX, y:e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const setHov = (v) => () => { hov.current = v; };
    document.querySelectorAll("a,button,.mag-btn,.card-3d").forEach(el => {
      el.addEventListener("mouseenter", setHov(true));
      el.addEventListener("mouseleave", setHov(false));
    });
    let raf;
    const run = () => {
      if (dotRef.current && ringRef.current) {
        ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12;
        ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12;
        dotRef.current.style.left  = posRef.current.x + "px";
        dotRef.current.style.top   = posRef.current.y + "px";
        ringRef.current.style.left = ringPos.current.x + "px";
        ringRef.current.style.top  = ringPos.current.y + "px";
        ringRef.current.style.transform = `translate(-50%,-50%) scale(${hov.current ? 2.5 : 1})`;
        ringRef.current.style.borderColor = hov.current ? ACCENT : "rgba(0,229,255,0.4)";
      }
      raf = requestAnimationFrame(run);
    };
    run();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{ position:"fixed", zIndex:9999, pointerEvents:"none",
        width:6, height:6, borderRadius:"50%", background:ACCENT,
        transform:"translate(-50%,-50%)", left:-100, top:-100,
        boxShadow:`0 0 10px ${ACCENT},0 0 20px ${ACCENT}` }} />
      <div ref={ringRef} style={{ position:"fixed", zIndex:9998, pointerEvents:"none",
        width:36, height:36, borderRadius:"50%", border:"1px solid rgba(0,229,255,0.4)",
        transform:"translate(-50%,-50%)", left:-100, top:-100,
        transition:"transform .3s cubic-bezier(.34,1.56,.64,1),border-color .3s" }} />
    </>
  );
};

/* ─── SHARED WARP ENGINE ─────────────────────────────── */
const runWarp = (canvas, { duration = 2200, onDone } = {}) => {
  const ctx = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const stars = Array.from({ length: 320 }, () => ({
    x: Math.random() * canvas.width - cx,
    y: Math.random() * canvas.height - cy,
    z: Math.random() * canvas.width, pz: 0,
  }));
  let speed = 2, elapsed = 0, last = performance.now(), raf;
  const draw = (now) => {
    const dt = now - last; last = now; elapsed += dt;
    const p = elapsed / duration;
    speed = p < 0.6 ? Math.min(speed + 0.09, 30) : speed * 0.95;
    ctx.fillStyle = "rgba(3,3,10,0.22)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.pz = s.z; s.z -= speed;
      if (s.z <= 0) {
        s.x = Math.random()*canvas.width-cx; s.y = Math.random()*canvas.height-cy;
        s.z = canvas.width; s.pz = s.z;
      }
      const sx=(s.x/s.z)*canvas.width+cx, sy=(s.y/s.z)*canvas.width+cy;
      const px=(s.x/s.pz)*canvas.width+cx, py=(s.y/s.pz)*canvas.width+cy;
      const b = 1 - s.z/canvas.width;
      ctx.strokeStyle = `rgba(${b>.7?"0,229,255":"200,210,255"},${b})`;
      ctx.lineWidth = Math.max(0.3,(1-s.z/canvas.width)*3);
      ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(sx,sy); ctx.stroke();
    });
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,220);
    g.addColorStop(0,`rgba(0,229,255,${Math.min(0.18,p*0.3)})`);
    g.addColorStop(1,"transparent");
    ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
    if (elapsed < duration) raf = requestAnimationFrame(draw);
    else onDone && onDone();
  };
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
};

/* ─── WARP INTRO (first load) ────────────────────────── */
const WarpIntro = ({ onDone }) => {
  const canvasRef = useRef(null);
  const [fading, setFading] = useState(false);
  const [gone,   setGone]   = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    return runWarp(canvasRef.current, {
      duration: 2200,
      onDone: () => { setFading(true); setTimeout(() => { setGone(true); onDone(); }, 820); }
    });
  }, [onDone]);

  if (gone) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"#03030a",
      opacity:fading?0:1, transition:fading?"opacity .82s ease":"none" }}>
      <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%" }}/>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",gap:16,pointerEvents:"none" }}>
        <div className="font-jp" style={{ fontSize:12,letterSpacing:"0.5em",
          color:"rgba(0,229,255,0.6)",textTransform:"uppercase",animation:"fadeIn 1s ease .5s both" }}>
          クリエイティブ開発者
        </div>
        <div className="font-display" style={{ fontSize:"clamp(30px,6vw,58px)",fontWeight:800,
          letterSpacing:"0.12em",color:"#fff",animation:"fadeIn 1s ease .8s both" }}>
          IBNU<span style={{ color:ACCENT }}>.</span>STUDIO
        </div>
        <div style={{ width:200,height:1,background:`linear-gradient(90deg,transparent,${ACCENT},transparent)`,
          animation:"fadeIn 1s ease 1.1s both" }}/>
      </div>
    </div>
  );
};

/* ─── NAV WARP FLASH (on nav click) ─────────────────── */
const NavWarpFlash = ({ targetId, onComplete }) => {
  const canvasRef = useRef(null);
  const [fading,  setFading]  = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    return runWarp(canvasRef.current, {
      duration: 880,
      onDone: () => {
        document.getElementById(targetId)?.scrollIntoView({ behavior:"instant" });
        setFading(true);
        setTimeout(onComplete, 480);
      }
    });
  }, [targetId, onComplete]);

  return (
    <div style={{ position:"fixed",inset:0,zIndex:800,background:"#03030a",
      opacity:fading?0:1,transition:fading?"opacity .48s ease":"none",
      pointerEvents:fading?"none":"all" }}>
      <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%" }}/>
      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",
        justifyContent:"center",pointerEvents:"none" }}>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.4em",
          color:"rgba(0,229,255,0.55)",textTransform:"uppercase",animation:"fadeIn .3s ease" }}>
          // NAVIGATING
        </div>
      </div>
    </div>
  );
};

/* ─── NAV ────────────────────────────────────────────── */
const Nav = ({ visible, onNavClick, onHireClick }) => {
  const [scrolled,  setScrolled]  = useState(false);
  const [active,    setActive]    = useState("hero");
  const [ctaHov,    setCtaHov]    = useState(false);
  const [logoHov,   setLogoHov]   = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const links = ["About","Projects","Work","Skills","Contact"];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const ids = ["hero","about","projects","work","skills","contact"];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const handleNav = (id) => { setMenuOpen(false); onNavClick(id); };

  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:500,
        padding:"0 clamp(16px,4vw,40px)",height:62,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        background:scrolled?"rgba(3,3,10,0.92)":"transparent",
        backdropFilter:scrolled?"blur(24px) saturate(1.4)":"none",
        borderBottom:scrolled?`1px solid rgba(0,229,255,0.07)`:"none",
        transition:"background .4s,border-color .4s",
        opacity:visible?1:0,transform:visible?"none":"translateY(-20px)" }}>

        {/* Shimmer top line */}
        {scrolled && (
          <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
            background:`linear-gradient(90deg,transparent 0%,${ACCENT}60 30%,${ACCENT} 50%,${ACCENT}60 70%,transparent 100%)`,
            animation:"shimmer 3s linear infinite",backgroundSize:"200% auto" }}/>
        )}

        {/* Logo */}
        <button onClick={()=>handleNav("hero")}
          onMouseEnter={()=>setLogoHov(true)} onMouseLeave={()=>setLogoHov(false)}
          style={{ background:"none",border:"none",cursor:"none",padding:0,flexShrink:0,
            opacity:0,animation:visible?"navItemIn .6s cubic-bezier(.16,1,.3,1) .1s forwards":"none" }}>
          <span className="font-display" style={{ fontWeight:800,fontSize:20,letterSpacing:"0.06em",
            color:"rgba(255,255,255,0.9)",transition:"color .25s",
            display:"flex",alignItems:"center",gap:1 }}>
            I
            <span style={{ color:ACCENT,display:"inline-block",
              transform:logoHov?"rotate(20deg) scale(1.3)":"rotate(0) scale(1)",
              transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",
              textShadow:logoHov?`0 0 14px ${ACCENT}`:"" }}>.</span>
          </span>
        </button>

        {/* Desktop links — hidden below 768px */}
        <div style={{ display:"flex",gap:28,alignItems:"center",
          visibility:"visible" }} className="nav-desktop">
          {links.map((l,i)=>(
            <button key={l}
              onClick={()=>handleNav(l.toLowerCase())}
              className={`nav-item${active===l.toLowerCase()?" active":""}`}
              style={{ animationDelay:`${0.15+i*.07}s` }}>
              {active===l.toLowerCase() && (
                <span style={{ position:"absolute",top:-5,left:"50%",transform:"translateX(-50%)",
                  width:3,height:3,borderRadius:"50%",background:ACCENT,
                  boxShadow:`0 0 6px ${ACCENT},0 0 12px ${ACCENT}`,
                  animation:"fadeIn .3s ease" }}/>
              )}
              {l}
            </button>
          ))}

          {/* Contact Me CTA */}
          <button
            onMouseEnter={()=>setCtaHov(true)} onMouseLeave={()=>setCtaHov(false)}
            onClick={onHireClick}
            style={{ position:"relative",overflow:"hidden",flexShrink:0,
              background:ctaHov?ACCENT:"transparent",
              border:`1px solid ${ctaHov?ACCENT:ACCENT+"80"}`,
              color:ctaHov?"#03030a":ACCENT,
              padding:"8px 18px",borderRadius:2,
              fontFamily:"'IBM Plex Mono',monospace",fontSize:10,
              letterSpacing:"0.18em",textTransform:"uppercase",cursor:"none",
              transition:"all .3s cubic-bezier(.34,1.56,.64,1)",
              boxShadow:ctaHov?`0 0 30px ${ACCENT}60`:`0 0 12px ${ACCENT}20`,
              opacity:0,animation:`navItemIn .5s cubic-bezier(.16,1,.3,1) ${0.15+links.length*.07}s forwards` }}>
            <span style={{ position:"absolute",inset:0,
              background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%)",
              backgroundSize:"200% 100%",animation:ctaHov?"shimmer .6s linear":"none",
              pointerEvents:"none" }}/>
            Contact Me
          </button>
        </div>

        {/* Hamburger — shown below 768px */}
        <button onClick={()=>setMenuOpen(o=>!o)}
          className="nav-hamburger"
          style={{ background:"none",border:"none",cursor:"none",
            padding:6,display:"none",flexDirection:"column",gap:5,
            alignItems:"flex-end" }}>
          <span style={{ display:"block",height:1.5,borderRadius:2,background:ACCENT,
            transition:"all .3s cubic-bezier(.34,1.56,.64,1)",
            width:menuOpen?"22px":"22px",
            transform:menuOpen?"translateY(6.5px) rotate(45deg)":"none" }}/>
          <span style={{ display:"block",height:1.5,borderRadius:2,background:ACCENT,
            transition:"all .3s",width:"15px",
            opacity:menuOpen?0:1,transform:menuOpen?"scaleX(0)":"scaleX(1)" }}/>
          <span style={{ display:"block",height:1.5,borderRadius:2,background:ACCENT,
            transition:"all .3s cubic-bezier(.34,1.56,.64,1)",
            width:"22px",
            transform:menuOpen?"translateY(-6.5px) rotate(-45deg)":"none" }}/>
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className="nav-mobile-drawer" style={{
        position:"fixed",top:62,left:0,right:0,zIndex:499,
        background:"rgba(3,3,10,0.97)",backdropFilter:"blur(24px)",
        borderBottom:`1px solid rgba(0,229,255,0.08)`,
        transform:menuOpen?"translateY(0)":"translateY(-110%)",
        transition:"transform .4s cubic-bezier(.16,1,.3,1)",
        padding:"24px clamp(16px,4vw,40px) 28px",
        display:"none",flexDirection:"column",gap:4 }}>
        {links.map((l,i)=>(
          <button key={l} onClick={()=>handleNav(l.toLowerCase())}
            style={{ background:"none",border:"none",cursor:"none",textAlign:"left",
              fontFamily:"'IBM Plex Mono',monospace",fontSize:13,letterSpacing:"0.18em",
              textTransform:"uppercase",padding:"14px 0",
              color:active===l.toLowerCase()?ACCENT:"var(--muted)",
              borderBottom:"1px solid rgba(0,229,255,0.06)",
              transition:"color .25s",
              transform:menuOpen?"translateX(0)":"translateX(-20px)",
              opacity:menuOpen?1:0,
              transitionDelay:`${i*.06}s` }}>
            {active===l.toLowerCase() && <span style={{ color:ACCENT,marginRight:10 }}>→</span>}
            {l}
          </button>
        ))}
        <button onClick={()=>{ setMenuOpen(false); onHireClick(); }}
          style={{ marginTop:16,padding:"13px",background:ACCENT,color:"#03030a",border:"none",
            fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.22em",
            textTransform:"uppercase",cursor:"none",borderRadius:2,fontWeight:600,
            transform:menuOpen?"translateX(0)":"translateX(-20px)",
            opacity:menuOpen?1:0,transitionDelay:`${links.length*.06}s`,
            transition:"transform .4s, opacity .4s, background .2s",
            boxShadow:`0 0 24px ${ACCENT}40` }}>
          Contact Me
        </button>
      </div>

      {/* Inline responsive style for nav */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display:none !important; }
          .nav-hamburger { display:flex !important; }
          .nav-mobile-drawer { display:flex !important; }
        }
      `}</style>
    </>
  );
};

/* ─── PROJECT MODAL ──────────────────────────────────── */
const ProjectModal = ({ open, onClose }) => {
  const [form,    setForm]    = useState({ name:"", email:"", type:"", message:"" });
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(null);

  const types = ["Web Development","Video Editing","Motion Design","Full Package"];

  const handleChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => {
      const subject = encodeURIComponent(`New Inquiry from ${form.name}`);
      const body    = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nProject Type: ${form.type||"Not specified"}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:hi@ibnu.studio?subject=${subject}&body=${body}`;
      setSending(false);
      setSent(true);
    }, 1200);
  };

  const handleClose = () => { onClose(); setTimeout(()=>{setSent(false);setForm({name:"",email:"",type:"",message:""});},400); };

  if (!open) return null;

  return (
    <div onClick={handleClose} style={{ position:"fixed",inset:0,zIndex:900,
      background:"rgba(3,3,10,0.88)",backdropFilter:"blur(16px)",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:"20px",animation:"modalBgIn .3s ease" }}>

      <div onClick={e=>e.stopPropagation()} style={{ position:"relative",
        width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto",
        background:"#0a0a18",border:`1px solid ${ACCENT}20`,borderRadius:6,
        padding:"clamp(24px,4vw,48px)",animation:"modalIn .4s cubic-bezier(.16,1,.3,1)" }}>

        {/* Top accent */}
        <div style={{ position:"absolute",top:0,left:0,right:0,height:2,
          background:`linear-gradient(90deg,transparent,${ACCENT},${ACCENT2},${ACCENT},transparent)`,
          borderRadius:"6px 6px 0 0" }}/>

        {/* Corner decorations */}
        <div style={{ position:"absolute",top:16,right:16,width:24,height:24,
          borderTop:`1px solid ${ACCENT}40`,borderRight:`1px solid ${ACCENT}40` }}/>
        <div style={{ position:"absolute",bottom:16,left:16,width:24,height:24,
          borderBottom:`1px solid ${ACCENT}40`,borderLeft:`1px solid ${ACCENT}40` }}/>

        {/* Close */}
        <button onClick={handleClose} style={{ position:"absolute",top:20,right:20,
          background:"none",border:"none",cursor:"none",color:"var(--muted)",fontSize:18,
          lineHeight:1,transition:"color .2s",padding:4,zIndex:1 }}
          onMouseEnter={e=>e.currentTarget.style.color=ACCENT3}
          onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>✕</button>

        {sent ? (
          /* ── SUCCESS STATE ── */
          <div style={{ textAlign:"center",padding:"40px 0" }}>
            <div style={{ width:64,height:64,borderRadius:"50%",border:`2px solid ${ACCENT}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 24px",fontSize:28,
              boxShadow:`0 0 30px ${ACCENT}40`,animation:"pulse-glow 2s ease-in-out infinite" }}>✓</div>
            <h3 className="font-display" style={{ fontSize:26,fontWeight:800,color:"#fff",marginBottom:12 }}>Message Sent!</h3>
            <p style={{ fontSize:13,color:"rgba(221,224,240,0.5)",lineHeight:1.8 }}>
              Your email client should have opened.<br/>
              I'll get back to you within 24 hours.
            </p>
            <button onClick={handleClose} style={{ marginTop:28,padding:"10px 28px",
              background:ACCENT,color:"#03030a",border:"none",borderRadius:2,cursor:"none",
              fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.2em",
              textTransform:"uppercase",fontWeight:600 }}>Close</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom:32 }}>
              <div style={{ fontSize:10,color:ACCENT,letterSpacing:"0.3em",
                textTransform:"uppercase",marginBottom:10 }}>// Get in Touch</div>
              <h2 className="font-display" style={{ fontSize:"clamp(20px,3.5vw,32px)",
                fontWeight:800,color:"#fff",lineHeight:1.1 }}>
                Let's talk about<br/>
                <span style={{ color:ACCENT }}>your vision.</span>
              </h2>
            </div>

            {/* Name + Email */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
              {[{name:"name",placeholder:"Your name",label:"Name"},
                {name:"email",placeholder:"your@email.com",label:"Email"}].map(f=>(
                <div key={f.name}>
                  <label style={{ display:"block",fontSize:9,color:"var(--muted)",
                    letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6 }}>{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder} className="modal-input"
                    onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused(null)}
                    style={{ display:"block" }}/>
                </div>
              ))}
            </div>

            {/* Project type chips */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block",fontSize:9,color:"var(--muted)",
                letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8 }}>Project Type</label>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {types.map(t=>(
                  <button key={t} onClick={()=>setForm(f=>({...f,type:t}))}
                    style={{ padding:"6px 14px",borderRadius:2,fontSize:10,letterSpacing:"0.1em",
                      cursor:"none",transition:"all .25s",fontFamily:"'IBM Plex Mono',monospace",
                      background:form.type===t?ACCENT:"transparent",
                      border:`1px solid ${form.type===t?ACCENT:ACCENT+"30"}`,
                      color:form.type===t?"#03030a":ACCENT+"80" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block",fontSize:9,color:"var(--muted)",
                letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6 }}>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Tell me about your project, timeline, and goals..."
                rows={4} className="modal-input"
                onFocus={()=>setFocused("message")} onBlur={()=>setFocused(null)}
                style={{ display:"block" }}/>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={sending}
              style={{ position:"relative",overflow:"hidden",width:"100%",
                padding:"15px",fontSize:11,letterSpacing:"0.28em",textTransform:"uppercase",
                fontFamily:"'IBM Plex Mono',monospace",cursor:"none",borderRadius:2,
                background:sending?`${ACCENT}80`:ACCENT,
                border:"none",color:"#03030a",fontWeight:600,
                transition:"all .3s",
                boxShadow:sending?"none":`0 0 30px ${ACCENT}50` }}>
              <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
                {sending ? (
                  <>
                    <span style={{ display:"inline-block",width:12,height:12,borderRadius:"50%",
                      border:"2px solid #03030a",borderTopColor:"transparent",
                      animation:"spin-slow .7s linear infinite" }}/>
                    Preparing...
                  </>
                ) : "Send Message →"}
              </span>
            </button>

            <p style={{ textAlign:"center",fontSize:10,color:"var(--muted)",
              marginTop:14,letterSpacing:"0.08em" }}>
              Opens your email client · hi@ibnu.studio
            </p>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── GLITCH TEXT ────────────────────────────────────── */
const GlitchText = ({ text, style={} }) => (
  <div style={{ position:"relative",display:"inline-block",...style }}>
    <span>{text}</span>
    <span style={{ position:"absolute",top:0,left:0,color:ACCENT,
      animation:"glitch1 4s infinite steps(1)",opacity:.7 }}>{text}</span>
    <span style={{ position:"absolute",top:0,left:0,color:ACCENT3,
      animation:"glitch2 4s infinite steps(1)",opacity:.5 }}>{text}</span>
  </div>
);

/* ─── HERO ───────────────────────────────────────────── */
const Hero = ({ visible }) => {
  const layerRef = useRef(null);
  const [typed,setTyped]=useState("");
  const titles=["Creative Developer","Video Editor","Motion Designer","Digital Artist"];
  const [ti,setTi]=useState(0); const [ci,setCi]=useState(0); const [del,setDel]=useState(false);

  useEffect(()=>{
    if(!visible) return;
    const cur=titles[ti];
    const t=setTimeout(()=>{
      if(!del&&ci<cur.length)       {setTyped(cur.slice(0,ci+1));setCi(c=>c+1);}
      else if(!del&&ci===cur.length){setTimeout(()=>setDel(true),2200);}
      else if(del&&ci>0)            {setTyped(cur.slice(0,ci-1));setCi(c=>c-1);}
      else                          {setDel(false);setTi(i=>(i+1)%titles.length);}
    },del?40:80);
    return()=>clearTimeout(t);
  },[visible,typed,ci,del,ti]);

  useEffect(()=>{
    const fn=(e)=>{
      if(!layerRef.current) return;
      const x=(e.clientX/window.innerWidth-.5)*26;
      const y=(e.clientY/window.innerHeight-.5)*-16;
      layerRef.current.style.transform=`translate(${x}px,${y}px)`;
    };
    window.addEventListener("mousemove",fn);
    return()=>window.removeEventListener("mousemove",fn);
  },[]);

  return (
    <section id="hero" style={{ position:"relative",height:"100vh",
      display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>

      {/* Grid bg */}
      <div style={{ position:"absolute",inset:0,opacity:.12,overflow:"hidden" }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke={ACCENT} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Center glow */}
      <div style={{ position:"absolute",top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",width:700,height:700,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,229,255,0.04) 0%,transparent 70%)",
        animation:"pulse-glow 4s ease-in-out infinite" }}/>

      {/* Color orbs */}
      {[{top:"15%",left:"8%",s:280,c:ACCENT2,d:"0s"},{top:"68%",right:"6%",s:230,c:ACCENT,d:"2s"},{top:"35%",right:"18%",s:140,c:ACCENT3,d:"1s"}]
        .map((o,i)=>(
        <div key={i} style={{ position:"absolute",top:o.top,left:o.left,right:o.right,
          width:o.s,height:o.s,borderRadius:"50%",
          background:`radial-gradient(circle,${o.c}18 0%,transparent 70%)`,
          animation:`float ${5+i}s ease-in-out infinite`,animationDelay:o.d,filter:"blur(40px)" }}/>
      ))}

      {/* Parallax rings */}
      <div ref={layerRef} style={{ position:"absolute",inset:0,
        transition:"transform .1s ease-out",display:"flex",alignItems:"center",justifyContent:"center" }}>
        <div style={{ position:"absolute",width:540,height:540,borderRadius:"50%",
          border:"1px solid rgba(0,229,255,0.05)",animation:"spin-slow 20s linear infinite" }}>
          <div style={{ position:"absolute",top:-3,left:"50%",width:6,height:6,
            borderRadius:"50%",background:ACCENT,transform:"translateX(-50%)",
            boxShadow:`0 0 15px ${ACCENT}` }}/>
        </div>
        <div style={{ position:"absolute",width:360,height:360,borderRadius:"50%",
          border:"1px solid rgba(112,0,255,0.07)",
          animation:"spin-slow 15s linear infinite reverse" }}/>
      </div>

      {/* Hero text */}
      <div style={{ position:"relative",zIndex:10,textAlign:"center",
        padding:"0 clamp(16px,4vw,40px)",width:"100%",maxWidth:920,margin:"0 auto",
        opacity:visible?1:0,transform:visible?"none":"translateY(30px)",
        transition:"opacity 1s ease .3s,transform 1s ease .3s" }}>

        <div className="font-jp" style={{ fontSize:"clamp(9px,1.5vw,12px)",
          letterSpacing:"0.45em",color:"rgba(0,229,255,0.5)",textTransform:"uppercase",
          marginBottom:28,animation:"fadeUp 1s ease .2s both",wordBreak:"break-word" }}>
          クリエイティブ開発者 ＆ ビデオエディター
        </div>

        <h1 className="font-display" style={{ fontWeight:800,lineHeight:.92,
          letterSpacing:"-0.02em",marginBottom:28,wordBreak:"break-word" }}>
          <GlitchText text="IBNU" style={{ display:"block",
            fontSize:"clamp(70px,16vw,160px)",color:"#fff",
            animation:"fadeUp 1s ease .4s both" }}/>
          <span style={{ display:"block",fontSize:"clamp(11px,2.2vw,22px)",
            WebkitTextStroke:`1px ${ACCENT}`,color:"transparent",
            letterSpacing:"clamp(0.2em,2vw,0.55em)",marginTop:10,
            animation:"fadeUp 1s ease .6s both" }}>
            CREATIVE DEVELOPER
          </span>
        </h1>

        <div style={{ height:1,width:160,margin:"0 auto 28px",
          background:`linear-gradient(90deg,transparent,${ACCENT},transparent)`,
          animation:"fadeIn 1s ease .8s both" }}/>

        <div style={{ fontSize:"clamp(11px,1.8vw,14px)",letterSpacing:"0.06em",
          animation:"fadeUp 1s ease 1s both",minHeight:28,
          display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
          <span style={{ color:ACCENT }}>// </span>
          <span style={{ color:"var(--text)" }}>{typed}</span>
          <span style={{ animation:"blink 1s step-end infinite",color:ACCENT }}>▋</span>
        </div>

        <div style={{ marginTop:48,display:"flex",gap:14,justifyContent:"center",
          flexWrap:"wrap",animation:"fadeUp 1s ease 1.2s both" }}>
          <button className="mag-btn"
            onClick={()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth"})}
            style={{ padding:"13px clamp(20px,4vw,36px)",background:ACCENT,color:"#03030a",border:"none",
              fontFamily:"'IBM Plex Mono',monospace",fontSize:11,fontWeight:500,
              letterSpacing:"0.18em",textTransform:"uppercase",cursor:"none",borderRadius:2,
              boxShadow:"0 0 30px rgba(0,229,255,0.3)" }}>
            View Work
          </button>
          <button className="mag-btn"
            onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            style={{ padding:"13px clamp(20px,4vw,36px)",background:"transparent",
              border:"1px solid rgba(0,229,255,0.3)",color:ACCENT,
              fontFamily:"'IBM Plex Mono',monospace",fontSize:11,
              letterSpacing:"0.18em",textTransform:"uppercase",cursor:"none",borderRadius:2 }}>
            Let's Talk
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position:"absolute",bottom:34,left:"50%",transform:"translateX(-50%)",
        display:"flex",flexDirection:"column",alignItems:"center",gap:8,
        animation:"fadeIn 1s ease 2s both" }}>
        <div style={{ fontSize:9,letterSpacing:"0.3em",color:"var(--muted)",textTransform:"uppercase" }}>Scroll</div>
        <div style={{ width:1,height:50,background:`linear-gradient(180deg,${ACCENT},transparent)`,
          animation:"float 2s ease-in-out infinite" }}/>
      </div>
    </section>
  );
};

/* ─── SECTION WRAPPER ────────────────────────────────── */
const Section = ({ id, children, style={} }) => (
  <section id={id} className="section-pad" style={{ position:"relative",...style }}>
    <div className="inner">{children}</div>
  </section>
);

/* ─── SECTION LABEL ──────────────────────────────────── */
const SectionLabel = ({ num, label }) => (
  <div className="reveal-hidden" style={{ display:"flex",alignItems:"center",gap:14,marginBottom:52 }}>
    <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:ACCENT,
      letterSpacing:"0.2em",flexShrink:0 }}>[ {num} ]</span>
    <div style={{ flex:1,height:1,background:`linear-gradient(90deg,${ACCENT}40,transparent)`,minWidth:20 }}/>
    <span className="font-jp" style={{ fontSize:10,color:"var(--muted)",letterSpacing:"0.25em",
      textTransform:"uppercase",flexShrink:0 }}>{label}</span>
  </div>
);

/* ─── ABOUT ──────────────────────────────────────────── */
const About = () => {
  const stats=[
    {val:"1+",  label:"Years Experience"},
    {val:"3+",label:"Projects Done"},
    {val:"1+", label:"Happy Clients"},
    {val:"∞",   label:"Cups of Coffee"},
  ];
  return (
    <Section id="about">
      <SectionLabel num="01" label="About"/>
      <div className="grid-2col">
        <div>
          <h2 className="font-display reveal-hidden"
            style={{ fontSize:"clamp(26px,4vw,54px)",fontWeight:800,lineHeight:1.1,
              marginBottom:28,wordBreak:"break-word" }}>
            Building at the intersection of{" "}
            <span style={{ color:ACCENT }}>code & cinema</span>
          </h2>
          <p className="reveal-hidden"
            style={{ fontSize:"clamp(12px,1.4vw,14px)",lineHeight:2,
              color:"rgba(221,224,240,0.65)",marginBottom:18,transitionDelay:".1s",wordBreak:"break-word" }}>
            Based between Tokyo and the digital frontier — I craft immersive web experiences
            and cinematic video edits that leave a lasting mark. My work lives at the
            crossroads of technical precision and raw creativity.
          </p>
          <p className="reveal-hidden"
            style={{ fontSize:"clamp(12px,1.4vw,14px)",lineHeight:2,
              color:"rgba(221,224,240,0.5)",transitionDelay:".2s",wordBreak:"break-word" }}>
            Driven by the Japanese philosophy of{" "}
            <span style={{ color:ACCENT }}><em>shokunin</em></span> — the relentless pursuit
            of craft mastery — every frame and every line of code is executed with intention.
          </p>
        </div>
        <div className="grid-4stat">
          {stats.map((s,i)=>(
            <div key={i} className="reveal-hidden card-3d"
              style={{ transitionDelay:`${i*.1}s`,padding:"clamp(16px,2.5vw,28px) clamp(14px,2vw,22px)",
                border:"1px solid var(--border)",borderRadius:4,background:"var(--card)",
                position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:2,
                background:`linear-gradient(90deg,transparent,${ACCENT},transparent)`,opacity:.5 }}/>
              <div className="font-display"
                style={{ fontSize:"clamp(26px,4vw,42px)",fontWeight:800,color:ACCENT,lineHeight:1 }}>
                {s.val}
              </div>
              <div style={{ fontSize:"clamp(9px,1.1vw,11px)",color:"var(--muted)",
                marginTop:8,letterSpacing:"0.1em",textTransform:"uppercase",
                wordBreak:"break-word",lineHeight:1.4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ─── PROJECT CARD ───────────────────────────────────── */
const ProjectCard = ({ title, tags, desc, year, accentColor, index, url }) => {
  const cardRef=useRef(null);
  const [tilt,setTilt]=useState({x:0,y:0});
  const [hov,setHov]=useState(false);
  const [btnHov,setBtnHov]=useState(false);
  const onMove=(e)=>{
    const r=cardRef.current.getBoundingClientRect();
    setTilt({x:((e.clientX-r.left)/r.width-.5)*13,y:((e.clientY-r.top)/r.height-.5)*-13});
  };
  return (
    <div ref={cardRef} className="reveal-hidden card-3d"
      onMouseMove={onMove}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>{setTilt({x:0,y:0});setHov(false);}}
      style={{ transitionDelay:`${index*.1}s`,
        transform:`perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) ${hov?"translateY(-7px)":""}`,
        transition:hov?"box-shadow .3s":"transform .6s cubic-bezier(.34,1.56,.64,1),box-shadow .3s",
        border:`1px solid ${hov?accentColor+"50":"var(--border)"}`,
        borderRadius:4,background:"var(--card)",
        padding:"clamp(18px,3vw,36px)",
        position:"relative",overflow:"hidden",cursor:"none",
        display:"flex",flexDirection:"column",
        boxShadow:hov?`0 20px 60px ${accentColor}20`:"none" }}>

      {/* top bar */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${accentColor},transparent)`,
        opacity:hov?1:.3,transition:"opacity .3s" }}/>
      {/* corner deco */}
      <div style={{ position:"absolute",top:12,right:12,width:28,height:28,
        borderTop:`1px solid ${accentColor}40`,borderRight:`1px solid ${accentColor}40` }}/>
      <div style={{ position:"absolute",bottom:12,left:12,width:28,height:28,
        borderBottom:`1px solid ${accentColor}40`,borderLeft:`1px solid ${accentColor}40` }}/>

      {/* year */}
      <div style={{ fontSize:10,color:"var(--muted)",letterSpacing:"0.2em",marginBottom:18 }}>{year}</div>

      {/* title */}
      <h3 className="font-display"
        style={{ fontSize:"clamp(16px,2.5vw,26px)",fontWeight:800,color:"#fff",
          marginBottom:10,lineHeight:1.15,wordBreak:"break-word" }}>
        {title}
      </h3>

      {/* desc */}
      <p style={{ fontSize:"clamp(11px,1.3vw,13px)",color:"rgba(221,224,240,0.55)",
        lineHeight:1.8,marginBottom:20,wordBreak:"break-word",flex:1 }}>{desc}</p>

      {/* tags */}
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:22 }}>
        {tags.map(t=>(
          <span key={t} style={{ padding:"3px 10px",border:`1px solid ${accentColor}30`,
            color:accentColor,fontSize:9,letterSpacing:"0.12em",
            textTransform:"uppercase",borderRadius:2 }}>{t}</span>
        ))}
      </div>

      {/* View Project button */}
      <button
        onMouseEnter={()=>setBtnHov(true)}
        onMouseLeave={()=>setBtnHov(false)}
        onClick={()=> url ? window.open(url,"_blank","noopener") : null}
        style={{ position:"relative",overflow:"hidden",
          display:"flex",alignItems:"center",justifyContent:"center",gap:10,
          width:"100%",padding:"11px 0",borderRadius:2,cursor:"none",
          fontFamily:"'IBM Plex Mono',monospace",fontSize:10,
          letterSpacing:"0.2em",textTransform:"uppercase",
          background:btnHov?accentColor:"transparent",
          border:`1px solid ${btnHov?accentColor:accentColor+"40"}`,
          color:btnHov?"#03030a":accentColor,
          transition:"all .3s cubic-bezier(.34,1.56,.64,1)",
          boxShadow:btnHov?`0 0 24px ${accentColor}50`:"none" }}>
        {/* shimmer on hover */}
        <span style={{ position:"absolute",inset:0,pointerEvents:"none",
          background:"linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)",
          backgroundSize:"200% 100%",
          animation:btnHov?"shimmer .55s linear":"none" }}/>
        <span>View Project</span>
        <span style={{ display:"inline-block",
          transform:btnHov?"translateX(4px)":"translateX(0)",
          transition:"transform .25s cubic-bezier(.34,1.56,.64,1)" }}>↗</span>
      </button>
    </div>
  );
};

/* ─── PROJECTS ───────────────────────────────────────── */
const Projects = () => {
  const projects=[
    {title:"Void Interface", tags:["WebGL","React","GSAP"],        desc:"An immersive 3D web experience for a Tokyo-based architecture studio with real-time building visualization.", year:"2024",accentColor:ACCENT,  url:"https://github.com"},
    {title:"Neon Horizons",  tags:["Three.js","Shaders","Motion"], desc:"Interactive documentary with scroll-driven storytelling and custom GLSL shaders.",                           year:"2024",accentColor:ACCENT2, url:"https://github.com"},
    {title:"Stasis OS",      tags:["React","Canvas","AI"],         desc:"A generative art platform powered by machine learning. Users define parameters; the system composes visuals.", year:"2023",accentColor:ACCENT3, url:"https://github.com"},
    {title:"Echo Protocol",  tags:["WebAudio","SVG","Canvas"],     desc:"Real-time audio visualizer with procedurally generated landscapes responding to music frequency data.",        year:"2023",accentColor:ACCENT,  url:"https://github.com"},
  ];
  return (
    <Section id="projects" style={{ background:"linear-gradient(180deg,var(--bg),var(--surface),var(--bg))" }}>
      <SectionLabel num="02" label="Projects"/>
      <h2 className="font-display reveal-hidden"
        style={{ fontSize:"clamp(24px,4vw,50px)",fontWeight:800,marginBottom:44,wordBreak:"break-word" }}>
        Featured <span style={{ color:ACCENT }}>Work</span>
      </h2>
      <div className="grid-2card">
        {projects.map((p,i)=><ProjectCard key={i} {...p} index={i}/>)}
      </div>
    </Section>
  );
};

/* ─── VIDEO CARD ─────────────────────────────────────── */
const VideoCard=({title,client,duration,index,url})=>{
  const [hov,setHov]=useState(false);
  const col=[ACCENT,ACCENT2,ACCENT3][index%3];
  const gradients=[
    "linear-gradient(135deg,#0a0a20 0%,#050510 100%)",
    "linear-gradient(135deg,#0d0520 0%,#050510 100%)",
    "linear-gradient(135deg,#200510 0%,#050510 100%)",
  ];
  const patterns=["▲","◆","●"];

  return (
    <div className="reveal-hidden"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=> url ? window.open(url,"_blank","noopener") : null}
      style={{ transitionDelay:`${index*.08}s`,position:"relative",overflow:"hidden",
        borderRadius:4,cursor:"none",aspectRatio:"16/10",
        border:`1px solid ${hov?col+"70":"var(--border)"}`,
        background:gradients[index%3],
        transition:"border-color .3s,transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .3s",
        transform:hov?"scale(1.03) translateY(-4px)":"scale(1)",
        boxShadow:hov?`0 20px 50px ${col}25, 0 0 0 1px ${col}20`:"none" }}>

      {/* Decorative bg pattern */}
      <div style={{ position:"absolute",inset:0,overflow:"hidden" }}>
        {/* Large faint shape */}
        <div style={{ position:"absolute",top:"50%",left:"50%",
          transform:"translate(-50%,-50%)",
          fontSize:"clamp(60px,10vw,100px)",
          color:col,opacity:.04,userSelect:"none",
          fontWeight:900,letterSpacing:"-0.05em",
          transition:"opacity .4s,transform .4s",
          ...(hov?{opacity:.08,transform:"translate(-50%,-50%) scale(1.15)"}:{}) }}>
          {patterns[index%3]}
        </div>
        {/* Subtle grid lines */}
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.06 }}>
          <defs>
            <pattern id={`vg${index}`} width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={col} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#vg${index})`}/>
        </svg>
        {/* Color wash */}
        <div style={{ position:"absolute",inset:0,
          background:`radial-gradient(ellipse at 30% 40%,${col}18 0%,transparent 65%)`,
          transition:"opacity .4s",opacity:hov?1:.5 }}/>
      </div>

      {/* Animated play button */}
      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
        {/* Outer pulse ring */}
        <div style={{ position:"absolute",width:70,height:70,borderRadius:"50%",
          border:`1px solid ${col}`,opacity:hov?.4:.15,
          transform:hov?"scale(1.6)":"scale(1.2)",
          transition:"transform .6s cubic-bezier(.34,1.56,.64,1),opacity .4s" }}/>
        {/* Second pulse ring */}
        <div style={{ position:"absolute",width:70,height:70,borderRadius:"50%",
          border:`1px solid ${col}`,opacity:hov?.2:.08,
          transform:hov?"scale(2.2)":"scale(1.5)",
          transition:"transform .8s cubic-bezier(.34,1.56,.64,1) .05s,opacity .4s" }}/>
        {/* Main circle */}
        <div style={{ position:"relative",width:54,height:54,borderRadius:"50%",
          background:hov?col:`${col}18`,
          border:`1.5px solid ${col}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          transform:hov?"scale(1.12)":"scale(1)",
          transition:"transform .4s cubic-bezier(.34,1.56,.64,1),background .3s,box-shadow .3s",
          boxShadow:hov?`0 0 30px ${col}70,0 0 60px ${col}30`:`0 0 12px ${col}30` }}>
          {/* Triangle play */}
          <div style={{ borderLeft:`${hov?"18px":"16px"} solid ${hov?"#03030a":col}`,
            borderTop:"10px solid transparent",
            borderBottom:"10px solid transparent",
            marginLeft:hov?5:4,
            transition:"all .3s" }}/>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div style={{ position:"absolute",inset:0,
        background:"linear-gradient(180deg,transparent 35%,rgba(3,3,10,.95) 100%)",
        opacity:hov?1:.8,transition:"opacity .3s" }}/>

      {/* Top-right duration badge */}
      <div style={{ position:"absolute",top:12,right:12,padding:"3px 9px",
        background:"rgba(3,3,10,.85)",border:`1px solid ${col}50`,
        fontSize:9,color:col,borderRadius:2,letterSpacing:"0.1em",
        backdropFilter:"blur(4px)" }}>{duration}</div>

      {/* Bottom info */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"14px 16px",
        transform:hov?"translateY(0)":"translateY(4px)",transition:"transform .35s ease" }}>
        <div style={{ fontSize:9,color:col,letterSpacing:"0.2em",
          textTransform:"uppercase",marginBottom:5,opacity:.85 }}>{client}</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:8 }}>
          <div className="font-display"
            style={{ fontSize:"clamp(13px,1.8vw,17px)",fontWeight:700,color:"#fff",
              wordBreak:"break-word",lineHeight:1.2 }}>{title}</div>
          {/* Play label on hover */}
          <div style={{ fontSize:9,letterSpacing:"0.15em",textTransform:"uppercase",
            color:col,flexShrink:0,opacity:hov?1:0,
            transform:hov?"translateX(0)":"translateX(8px)",
            transition:"opacity .3s,transform .3s" }}>
            {url?"Watch ↗":"Soon"}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── VIDEO SECTION ──────────────────────────────────── */
const VideoWork=()=>{
  const videos=[
    {title:"Departure",     client:"Toyota x Japan Tourism",duration:"3:22", url:"https://youtube.com"},
    {title:"Zero Gravity",  client:"Nike — Air Campaign",   duration:"1:47", url:"https://youtube.com"},
    {title:"Liminal Space", client:"Personal Project",      duration:"5:03", url:""},
    {title:"Synthetic Dawn",client:"Spotify Wrapped '24",   duration:"2:15", url:"https://youtube.com"},
    {title:"Cascade",       client:"Apple Music Editorial", duration:"4:18", url:""},
    {title:"Ghost Signal",  client:"Netflix — Short Film",  duration:"8:55", url:"https://youtube.com"},
  ];
  return (
    <Section id="work">
      <SectionLabel num="03" label="Video Work"/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",
        marginBottom:36,flexWrap:"wrap",gap:12 }}>
        <h2 className="font-display reveal-hidden"
          style={{ fontSize:"clamp(24px,4vw,50px)",fontWeight:800,wordBreak:"break-word" }}>
          Cinematic <span style={{ color:ACCENT }}>Edits</span>
        </h2>
        <div className="reveal-hidden"
          style={{ fontSize:11,color:"var(--muted)",letterSpacing:"0.1em",flexShrink:0 }}>
          — Available for editorial work
        </div>
      </div>
      <div className="grid-3vid">
        {videos.map((v,i)=><VideoCard key={i} {...v} index={i}/>)}
      </div>
    </Section>
  );
};

/* ─── SKILLS ─────────────────────────────────────────── */
const Skills=()=>{
  const ref=useRef(null);
  const [animated,setAnimated]=useState(false);
  const techSkills=[
    {name:"React / Next.js",      pct:95,color:ACCENT },
    {name:"Three.js / WebGL",     pct:88,color:ACCENT2},
    {name:"GSAP / Framer Motion", pct:92,color:ACCENT },
    {name:"Node.js / APIs",       pct:80,color:ACCENT3},
    {name:"Canvas / SVG",         pct:90,color:ACCENT2},
  ];
  const editSkills=[
    {name:"Premiere / DaVinci",   pct:97,color:ACCENT },
    {name:"After Effects",        pct:94,color:ACCENT3},
    {name:"Color Grading",        pct:91,color:ACCENT2},
    {name:"Motion Graphics",      pct:93,color:ACCENT },
    {name:"Sound Design",         pct:78,color:ACCENT3},
  ];
  const tools=["React","Next.js","Three.js","GSAP","Figma","WebGL","Node.js",
               "Premiere Pro","After Effects","DaVinci","Blender","TypeScript"];

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setAnimated(true);},{threshold:.3});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);

  const Bar=({name,pct,color,delay})=>(
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7 }}>
        <span style={{ fontSize:"clamp(10px,1.3vw,12px)",color:"var(--text)",wordBreak:"break-word" }}>{name}</span>
        <span style={{ width:6,height:6,borderRadius:"50%",background:color,flexShrink:0,
          boxShadow:`0 0 6px ${color}`,opacity:animated?1:0,transition:"opacity .5s",
          transitionDelay:`${delay+800}ms` }}/>
      </div>
      <div style={{ height:2,background:"rgba(255,255,255,0.05)",borderRadius:1,overflow:"hidden" }}>
        <div className="skill-bar-fill" style={{ height:"100%",borderRadius:1,
          background:`linear-gradient(90deg,${color},${color}80)`,
          width:animated?`${pct}%`:"0%",transitionDelay:`${delay}ms`,
          boxShadow:`0 0 8px ${color}` }}/>
      </div>
    </div>
  );

  return (
    <Section id="skills" ref={ref}
      style={{ background:"linear-gradient(180deg,var(--bg),var(--surface),var(--bg))" }}>
      <SectionLabel num="04" label="Skills"/>
      <h2 className="font-display reveal-hidden"
        style={{ fontSize:"clamp(24px,4vw,50px)",fontWeight:800,marginBottom:52,wordBreak:"break-word" }}>
        Tools of the <span style={{ color:ACCENT }}>Craft</span>
      </h2>
      <div className="grid-skills">
        <div className="reveal-hidden">
          <div style={{ fontSize:10,color:ACCENT,letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:24 }}>// Development</div>
          {techSkills.map((s,i)=><Bar key={i} {...s} delay={i*100}/>)}
        </div>
        <div className="reveal-hidden" style={{ transitionDelay:".2s" }}>
          <div style={{ fontSize:10,color:ACCENT3,letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:24 }}>// Video Editing</div>
          {editSkills.map((s,i)=><Bar key={i} {...s} delay={i*100+200}/>)}
        </div>
      </div>
      <div style={{ marginTop:64,paddingTop:52,borderTop:"1px solid rgba(0,229,255,0.06)" }}>
        <div style={{ fontSize:10,color:"var(--muted)",letterSpacing:"0.22em",textTransform:"uppercase",
          marginBottom:24,textAlign:"center" }}>— Tech Stack —</div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:9,justifyContent:"center" }}>
          {tools.map((t,i)=>(
            <span key={i} className="reveal-hidden mag-btn"
              style={{ transitionDelay:`${i*.04}s`,padding:"8px 16px",
                border:"1px solid var(--border)",borderRadius:2,
                fontSize:"clamp(9px,1.2vw,11px)",color:"var(--muted)",
                letterSpacing:"0.08em",transition:"all .3s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=ACCENT+"60";e.currentTarget.style.color=ACCENT;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ─── CONTACT ────────────────────────────────────────── */
const Contact=({onOpenModal})=>{
  const [hovBtn,setHovBtn]=useState(false);
  const links=[
    {label:"GitHub",  val:"@ibnudev"      },
    {label:"Twitter", val:"@ibnu_builds"  },
    {label:"Dribbble",val:"@ibnustudio"   },
    {label:"Email",   val:"hi@ibnu.studio"},
  ];
  return (
    <Section id="contact" style={{ minHeight:"80vh",display:"flex",flexDirection:"column",justifyContent:"center" }}>
      <SectionLabel num="05" label="Contact"/>
      <div style={{ textAlign:"center",maxWidth:660,margin:"0 auto",width:"100%" }}>
        <h2 className="font-display reveal-hidden"
          style={{ fontSize:"clamp(28px,6vw,74px)",fontWeight:800,lineHeight:1.06,
            marginBottom:22,wordBreak:"break-word" }}>
          Let's build something{" "}
          <span style={{ color:ACCENT }}>unforgettable.</span>
        </h2>
        <p className="reveal-hidden"
          style={{ fontSize:"clamp(12px,1.4vw,14px)",color:"rgba(221,224,240,0.5)",
            lineHeight:2,marginBottom:40,wordBreak:"break-word" }}>
          Available for freelance projects, collaborations, and full-time opportunities.
          Based in Tokyo. Working globally.
        </p>
        <button className="mag-btn reveal-hidden"
          onMouseEnter={()=>setHovBtn(true)} onMouseLeave={()=>setHovBtn(false)}
          onClick={onOpenModal}
          style={{ padding:"15px clamp(22px,5vw,52px)",fontSize:11,letterSpacing:"0.28em",
            textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace",
            background:hovBtn?ACCENT:"transparent",
            color:hovBtn?"#03030a":ACCENT,border:`1px solid ${ACCENT}`,borderRadius:2,cursor:"none",
            transition:"all .3s ease",
            boxShadow:hovBtn?"0 0 50px rgba(0,229,255,0.4)":"0 0 20px rgba(0,229,255,0.1)",
            animation:"pulse-glow 3s ease-in-out infinite" }}>
          Start a Project
        </button>
        <div className="grid-social" style={{ marginTop:52 }}>
          {links.map((l,i)=>(
            <div key={i} className="reveal-hidden"
              style={{ transitionDelay:`${i*.1}s`,padding:"16px 12px",
                border:"1px solid var(--border)",borderRadius:4,cursor:"none",
                transition:"border-color .3s,background .3s",overflow:"hidden" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=ACCENT+"40";e.currentTarget.style.background="rgba(0,229,255,0.03)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="transparent";}}>
              <div style={{ fontSize:9,color:"var(--muted)",letterSpacing:"0.18em",
                textTransform:"uppercase",marginBottom:7 }}>{l.label}</div>
              <div style={{ fontSize:"clamp(10px,1.3vw,12px)",color:ACCENT,
                wordBreak:"break-all",lineHeight:1.4 }}>{l.val}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ─── FOOTER ─────────────────────────────────────────── */
const Footer=()=>(
  <footer style={{ borderTop:"1px solid rgba(0,229,255,0.06)",padding:"28px 0" }}>
    <div className="inner footer-bar" style={{ padding:"0 40px" }}>
      <div style={{ fontSize:10,color:"var(--muted)",letterSpacing:"0.12em" }}>© 2025 Ibnu — All rights reserved</div>
      <div className="font-jp" style={{ fontSize:10,color:"rgba(0,229,255,0.3)",letterSpacing:"0.3em" }}>東京 — Tokyo</div>
      <div style={{ fontSize:10,color:"var(--muted)",letterSpacing:"0.08em" }}>
        Crafted with <span style={{ color:ACCENT }}>precision</span>
      </div>
    </div>
  </footer>
);

/* ─── SCROLL REVEAL ──────────────────────────────────── */
const useScrollReveal=()=>{
  useEffect(()=>{
    const obs=new IntersectionObserver(
      (entries)=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("reveal-visible");}),
      {threshold:.13,rootMargin:"0px 0px -50px 0px"}
    );
    document.querySelectorAll(".reveal-hidden").forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  });
};

/* ─── PARTICLE BG ────────────────────────────────────── */
const ParticleBg=()=>{
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);
    const pts=Array.from({length:80},()=>({
      x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.3
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
        if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(0,229,255,0.22)";ctx.fill();
      });
      pts.forEach((a,i)=>{
        for(let j=i+1;j<pts.length;j++){
          const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d<120){
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
            ctx.strokeStyle=`rgba(0,229,255,${(1-d/120)*.07})`;ctx.lineWidth=.5;ctx.stroke();
          }
        }
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={canvasRef} style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:.55 }}/>;
};

/* ─── APP ────────────────────────────────────────────── */
export default function App(){
  const [warpDone,  setWarpDone]  = useState(false);
  const [navWarp,   setNavWarp]   = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  useScrollReveal();

  const onWarpDone        = useCallback(()=>setWarpDone(true),[]);
  const handleNavClick    = useCallback((id)=>{ if(navWarp) return; setNavWarp(id); },[navWarp]);
  const onNavWarpComplete = useCallback(()=>setNavWarp(null),[]);
  const openModal         = useCallback(()=>setModalOpen(true),[]);
  const closeModal        = useCallback(()=>setModalOpen(false),[]);

  return (
    <div style={{ background:"var(--bg)",minHeight:"100vh",position:"relative" }}>
      <GlobalStyle/>
      <Cursor/>
      <WarpIntro onDone={onWarpDone}/>
      <ParticleBg/>
      <ProjectModal open={modalOpen} onClose={closeModal}/>

      {navWarp && (
        <NavWarpFlash targetId={navWarp} onComplete={onNavWarpComplete}/>
      )}

      <div style={{ position:"fixed",inset:0,zIndex:1,pointerEvents:"none",
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 4px)",
        opacity:.4 }}/>

      <div style={{ position:"relative",zIndex:2 }}>
        <Nav visible={warpDone} onNavClick={handleNavClick} onHireClick={openModal}/>
        <Hero visible={warpDone}/>
        <About/>
        <Projects/>
        <VideoWork/>
        <Skills/>
        <Contact onOpenModal={openModal}/>
        <Footer/>
      </div>
    </div>
  );
}
