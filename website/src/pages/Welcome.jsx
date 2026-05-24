import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/welcome.css";

export default function Welcome() {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const auroraRef = useRef(null);
  const dashRef = useRef(null);
  const heroRightRef = useRef(null);

  /* ── Aurora WebGL shader ── */
  useEffect(() => {
    const canvas = auroraRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      antialias: false,
      alpha: false,
    });
    if (!gl) return;

    const vs = `
      attribute vec2 a_p;
      void main(){ gl_Position = vec4(a_p, 0.0, 1.0); }
    `;
    const fs = `
      precision highp float;
      uniform vec2  uRes;
      uniform vec2  uMouse;
      uniform vec2  uMouseSmooth;
      uniform float uTime;
      uniform float uClick;
      uniform float uScroll;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0 - 2.0*f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p){
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 5; i++){
          v += a * noise(p);
          p *= 2.0; a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / uRes.xy;
        vec2 p  = uv;
        float aspect = uRes.x / uRes.y;
        p.x *= aspect;

        vec2 m = uMouseSmooth;
        m.x *= aspect;

        float t = uTime * 0.045;
        float scroll = uScroll;

        vec2 q = vec2(
          fbm(p * 1.8 + vec2(0.0, t)),
          fbm(p * 1.8 + vec2(5.2, -t * 0.9))
        );

        vec2 toMouse = (m - p);
        float md = length(toMouse);
        float pull = exp(-md * 1.2) * 0.45;
        q += normalize(toMouse + 0.0001) * pull;

        float n = fbm(p * 2.6 + q * 1.6 - vec2(0.0, t * 0.6));

        float ripple = uClick * exp(-md * 3.0) * sin(uTime * 6.0 - md * 14.0);
        n += ripple * 0.25;

        float band = sin((p.y * 3.0 + n * 4.0 - t * 1.4) * 1.4) * 0.5 + 0.5;
        band = pow(band, 1.8);

        vec3 deep   = vec3(0.000, 0.060, 0.025);
        vec3 forest = vec3(0.000, 0.180, 0.090);
        vec3 moss   = vec3(0.333, 0.353, 0.106);
        vec3 sage   = vec3(0.859, 0.878, 0.749);
        vec3 mist   = vec3(0.608, 0.745, 0.824);
        vec3 amber  = vec3(0.95,  0.78,  0.45);

        vec3 col = deep;
        col = mix(col, forest, smoothstep(0.20, 0.55, n));
        col = mix(col, moss * 0.55,  smoothstep(0.45, 0.75, n + uv.y * 0.15));
        col = mix(col, mist * 0.75,  smoothstep(0.62, 0.95, n + band * 0.45));
        col = mix(col, sage * 0.85,  smoothstep(0.82, 1.10, n + band * 0.7 + pull * 1.2));
        col = mix(col, amber * 0.6,  smoothstep(0.92, 1.20, n + pull * 1.8 + uClick * 0.5));

        col += vec3(0.30, 0.40, 0.35) * pull * 0.6;
        col += vec3(0.40, 0.50, 0.30) * uClick * exp(-md * 2.5) * 0.7;

        col *= mix(0.55, 1.05, uv.y);
        col *= mix(1.0, 0.6, scroll);

        float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
        col *= mix(0.5, 1.0, vig);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    }
    const v = compile(gl.VERTEX_SHADER, vs);
    const f = compile(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const a_p = gl.getAttribLocation(prog, "a_p");
    gl.enableVertexAttribArray(a_p);
    gl.vertexAttribPointer(a_p, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uMouseSmooth = gl.getUniformLocation(prog, "uMouseSmooth");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uClick = gl.getUniformLocation(prog, "uClick");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    let mouse = [0.5, 0.5];
    let smooth = [0.5, 0.5];
    let click = 0;
    let scroll = 0;
    let rafId = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    resize();

    const onMove = (e) => {
      mouse[0] = e.clientX / window.innerWidth;
      mouse[1] = 1 - e.clientY / window.innerHeight;
    };
    const onDown = (e) => {
      click = 1;
      mouse[0] = e.clientX / window.innerWidth;
      mouse[1] = 1 - e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const t0 = performance.now();
    function frame() {
      smooth[0] += (mouse[0] - smooth[0]) * 0.06;
      smooth[1] += (mouse[1] - smooth[1]) * 0.06;
      click *= 0.96;
      const t = (performance.now() - t0) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.uniform2f(uMouseSmooth, smooth[0], smooth[1]);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uClick, click);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ── Sticky nav · smooth scroll · reveal · count-up · dash bars · 3D tilt ── */
  useEffect(() => {
    const nav = navRef.current;
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const anchorHandlers = [];
    document.querySelectorAll('.welcome-page a[href^="#"]').forEach((a) => {
      const handler = (e) => {
        const id = a.getAttribute("href");
        const el = id && id.length > 1 ? document.querySelector(id) : null;
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: "smooth" });
      };
      a.addEventListener("click", handler);
      anchorHandlers.push([a, handler]);
    });

    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            revealIO.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document
      .querySelectorAll(".welcome-page .wl-reveal")
      .forEach((el) => revealIO.observe(el));

    const dashEl = dashRef.current;
    let dashIO;
    if (dashEl) {
      dashIO = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              dashEl.classList.add("in");
              dashIO.unobserve(dashEl);
            }
          });
        },
        { threshold: 0.3 }
      );
      dashIO.observe(dashEl);
    }

    function countUp(el) {
      const target = +el.dataset.count;
      const dur = 1500;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            countUp(en.target);
            countIO.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document
      .querySelectorAll(".welcome-page [data-count]")
      .forEach((el) => countIO.observe(el));

    const wrap = heroRightRef.current;
    let rect = null;
    const updateRect = () => {
      if (wrap) rect = wrap.getBoundingClientRect();
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    const onWrapMove = (e) => {
      if (!wrap || !dashEl) return;
      if (!rect) updateRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      dashEl.style.transform = `translateY(-2px) rotateX(${-y * 3}deg) rotateY(${
        x * 3.5
      }deg)`;
    };
    const onWrapLeave = () => {
      if (dashEl) dashEl.style.transform = "";
    };
    if (wrap) {
      wrap.addEventListener("pointermove", onWrapMove);
      wrap.addEventListener("pointerleave", onWrapLeave);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateRect);
      anchorHandlers.forEach(([a, h]) => a.removeEventListener("click", h));
      revealIO.disconnect();
      if (dashIO) dashIO.disconnect();
      countIO.disconnect();
      if (wrap) {
        wrap.removeEventListener("pointermove", onWrapMove);
        wrap.removeEventListener("pointerleave", onWrapLeave);
      }
    };
  }, []);

  const leafShapes = [
    { fill: "#DBE0BF", d: "M12 2C8 4 4 8 4 14c0 4 3 8 8 8s8-4 8-8c0-6-4-10-8-12zm0 4c2 2 4 4 4 8a4 4 0 1 1-8 0c0-4 2-6 4-8z" },
    { fill: "#9BBED2", d: "M21 3c-9 0-16 6-18 14 0 2 1 4 4 4 8-2 14-9 14-18z" },
    { fill: "#978C37", d: "M12 2C8 4 4 8 4 14c0 4 3 8 8 8s8-4 8-8c0-6-4-10-8-12z" },
    { fill: "#DBE0BF", d: "M21 3c-9 0-16 6-18 14 0 2 1 4 4 4 8-2 14-9 14-18z" },
    { fill: "#9BBED2", d: "M12 2C8 4 4 8 4 14c0 4 3 8 8 8s8-4 8-8c0-6-4-10-8-12z" },
    { fill: "#DBE0BF", d: "M21 3c-9 0-16 6-18 14 0 2 1 4 4 4 8-2 14-9 14-18z" },
    { fill: "#555A1B", d: "M12 2C8 4 4 8 4 14c0 4 3 8 8 8s8-4 8-8c0-6-4-10-8-12z" },
    { fill: "#DBE0BF", d: "M21 3c-9 0-16 6-18 14 0 2 1 4 4 4 8-2 14-9 14-18z" },
  ];

  return (
    <div className="welcome-page">
      {/* ════════ BACKGROUND LAYERS ════════ */}
      <div className="wl-aurora-fallback" />
      <canvas className="wl-aurora" ref={auroraRef} />
      <div className="wl-grain" />

      <div className="wl-leaves" aria-hidden="true">
        {leafShapes.map((leaf, i) => (
          <div key={i} className={`wl-leaf l${i + 1}`}>
            <svg viewBox="0 0 24 24">
              <path fill={leaf.fill} d={leaf.d} />
            </svg>
          </div>
        ))}
      </div>

      {/* ════════ NAVBAR ════════ */}
      <nav className="wl-nav" ref={navRef}>
        <div className="wl-nav-inner">
          <div className="wl-brand">
            <div className="wl-brand-mark">
              <img src={logo} alt="" />
            </div>
            <div>
              <div className="wl-brand-word">SarakWay</div>
              <small className="wl-brand-sub">sarawak forestry corporation</small>
            </div>
          </div>
          <div className="wl-nav-links">
            <a href="#features">Platform</a>
            <a href="#journey">Journey</a>
            <a href="#parks">Parks</a>
            <a href="#cta">About</a>
          </div>
          <div className="wl-nav-cta">
            <button className="wl-btn wl-btn-ghost" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="wl-btn wl-btn-primary" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section className="wl-hero" id="hero">
        <div className="wl-container wl-hero-grid">
          {/* LEFT */}
          <div className="wl-hero-left">
            <span className="wl-eyebrow wl-reveal">
              <span className="wl-dot" />For park guides &amp; administrators
            </span>

            <h1 className="wl-hero-headline wl-reveal" style={{ "--d": ".1s" }}>
              Train, certify,<br />
              and <em>protect</em><br />
              Sarawak's wilderness.
            </h1>

            <p className="wl-hero-lead wl-reveal" style={{ "--d": ".2s" }}>
              SarakWay is the calm, all-in-one training platform for Sarawak's national
              park guides — flexible learning modules, real-time IoT safety alerts, and
              certification tracking, designed for conservation.
            </p>

            <div className="wl-hero-ctas wl-reveal" style={{ "--d": ".3s" }}>
              <button
                className="wl-btn wl-btn-primary wl-btn-lg"
                onClick={() => navigate("/register")}
              >
                Start Training
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
              <a className="wl-btn wl-btn-ghost wl-btn-lg" href="#features">
                Explore Platform
              </a>
            </div>

            <div className="wl-hero-trust wl-reveal" style={{ "--d": ".4s" }}>
              <div className="wl-hero-trust-avatars">
                <span /><span /><span />
              </div>
              <span>
                <b>52 active guides</b> across 4 national parks · Endorsed by SFC
              </span>
            </div>
          </div>

          {/* RIGHT — Glass dashboard */}
          <div
            className="wl-hero-right wl-reveal"
            style={{ "--d": ".25s" }}
            ref={heroRightRef}
          >
            <div className="wl-dash" ref={dashRef}>
              <div className="wl-dash-topbar">
                <i /><i /><i />
                <span>Admin · Live</span>
              </div>
              <h3>Training Courses</h3>
              <p className="wl-sub">Manage learning programs for park guides</p>

              <div className="wl-dash-tiles">
                <div className="wl-tile">
                  <div className="wl-num">
                    <span data-count="24">0</span>
                  </div>
                  <svg className="wl-spark" width="48" height="22" viewBox="0 0 48 22" fill="none">
                    <polyline
                      points="0,17 8,12 16,15 24,7 32,10 40,4 48,8"
                      stroke="#DBE0BF"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <div className="wl-lab">Total Courses</div>
                </div>
                <div className="wl-tile">
                  <div className="wl-num">
                    <span data-count="52">0</span>
                    <small>+3</small>
                  </div>
                  <svg className="wl-spark" width="48" height="22" viewBox="0 0 48 22" fill="none">
                    <polyline
                      points="0,15 8,17 16,11 24,13 32,8 40,9 48,4"
                      stroke="#9BBED2"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <div className="wl-lab">Active Guides</div>
                </div>
              </div>

              <div className="wl-dash-bars">
                {[
                  ["Hornbill Identification", "78%"],
                  ["Bako Trail Safety", "97%"],
                  ["Eco-tourism Engagement", "54%"],
                ].map(([name, pct]) => (
                  <div className="wl-bar-row" key={name}>
                    <span className="wl-name">{name}</span>
                    <span className="wl-pct">{pct}</span>
                    <div className="wl-bar-track">
                      <div className="wl-bar-fill" style={{ "--w": pct }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="wl-dash-foot">
                <span className="wl-chip">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Bako Briefing complete
                </span>
                <span className="wl-chip alert">
                  <span className="wl-pulse" />
                  IoT alert · Mulu trail
                </span>
              </div>
            </div>

            {/* Floating accent cards */}
            <div className="wl-float-card completed">
              <div className="wl-ico">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div className="wl-mini-label">Module</div>
                <strong>Bako Trail Safety</strong>
              </div>
            </div>

            <div className="wl-float-card cert">
              <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                <div className="wl-ico cert-ico">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                <div>
                  <div className="wl-mini-label">Certification</div>
                  <strong>Level 2 · Guide</strong>
                </div>
              </div>
              <div className="wl-mini-progress"><i /></div>
            </div>
          </div>
        </div>

        <div className="wl-scroll-cue" aria-hidden="true">
          Scroll
          <div className="wl-line" />
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className="wl-stats-wrap">
        <div className="wl-container">
          <div className="wl-stats wl-reveal">
            {[
              {
                count: 52,
                label: "Active Guides",
                icon: (
                  <>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </>
                ),
              },
              {
                count: 4,
                label: "National Parks",
                icon: (
                  <>
                    <path d="M17 8C8 10 5.9 16.17 3.82 22" />
                    <path d="M4 7c0 0 4-3 9-3s9 3 9 3" />
                    <path d="M12 22V8" />
                  </>
                ),
              },
              {
                count: 24,
                label: "Training Courses",
                icon: (
                  <>
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </>
                ),
              },
              {
                count: 141,
                label: "Certifications Issued",
                icon: (
                  <>
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </>
                ),
              },
            ].map((s) => (
              <div className="wl-stat" key={s.label}>
                <div className="wl-stat-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </div>
                <div className="wl-stat-num">
                  <span data-count={s.count}>0</span>
                </div>
                <div className="wl-stat-lab">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className="wl-features" id="features">
        <div className="wl-container">
          <div className="wl-sec-head wl-reveal">
            <span className="wl-eyebrow"><span className="wl-dot" />What you get</span>
            <h2 className="wl-sec-title">
              Everything a park guide needs,
              <em>in one calm place.</em>
            </h2>
            <p className="wl-sec-lead">
              From structured learning to AI-assisted conservation monitoring — SarakWay
              keeps Sarawak's guides trained, certified, and protected.
            </p>
          </div>

          <div className="wl-feat-grid">
            {[
              {
                d: ".05s",
                title: "Structured Learning",
                copy:
                  "Modular courses on conservation, biodiversity, eco-tourism and safety — at your own pace, on any device.",
                tag: "24 Modules",
                icon: (
                  <>
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </>
                ),
              },
              {
                d: ".15s",
                title: "Real-Time Safety Alerts",
                copy:
                  "IoT sensors stream trail closures, boundary crossings and equipment faults into a single live console.",
                tag: "IoT Alerts",
                icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
              },
              {
                d: ".25s",
                title: "Certification Tracking",
                copy:
                  "Verifiable certificates upon completion. Admins see progress across every park, every guide, in real time.",
                tag: "141 Certificates",
                icon: (
                  <>
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </>
                ),
              },
              {
                d: ".35s",
                title: "AI Conservation Monitor",
                copy:
                  "Vision models flag abnormal trail activity and wildlife disturbance, surfacing only what needs human review.",
                tag: "AI Review",
                icon: (
                  <>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </>
                ),
              },
            ].map((f) => (
              <div className="wl-feat wl-reveal" style={{ "--d": f.d }} key={f.title}>
                <div className="wl-feat-ico">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3>{f.title}</h3>
                <p>{f.copy}</p>
                <span className="wl-feat-tag"><span className="wl-dot" />{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ JOURNEY ════════ */}
      <section className="wl-journey" id="journey">
        <div className="wl-container">
          <div className="wl-sec-head wl-reveal">
            <span className="wl-eyebrow"><span className="wl-dot" />The training trail</span>
            <h2 className="wl-sec-title">
              Your journey from trainee
              <em>to certified guide.</em>
            </h2>
            <p className="wl-sec-lead">
              Six steps. Move through them at your own pace; the trail waits.
            </p>
          </div>

          <div className="wl-trail-wrap wl-reveal">
            <svg
              className="wl-trail-path"
              viewBox="0 0 1200 240"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="wl-trail-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#DBE0BF" stopOpacity="0.0" />
                  <stop offset="20%" stopColor="#DBE0BF" stopOpacity="0.7" />
                  <stop offset="80%" stopColor="#9BBED2" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#9BBED2" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 40 90 C 180 50, 260 180, 400 130 S 620 60, 760 160 S 980 100, 1160 200" />
            </svg>

            <div className="wl-steps">
              {[
                {
                  num: "01",
                  title: "Create guide account",
                  copy: "Register with your SFC park ID and we'll set up your portal in seconds.",
                  icon: (
                    <>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </>
                  ),
                },
                {
                  num: "02",
                  title: "Join a training module",
                  copy: "Pick from conservation, eco-tourism, biodiversity, legislation or safety tracks.",
                  icon: (
                    <>
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </>
                  ),
                },
                {
                  num: "03",
                  title: "Complete quizzes",
                  copy: "Short, scenario-based assessments — replayable, mobile-friendly.",
                  icon: (
                    <>
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </>
                  ),
                },
                {
                  num: "04",
                  title: "Earn certificate",
                  copy: "Receive a verifiable SFC-endorsed credential the moment you pass.",
                  icon: (
                    <>
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                    </>
                  ),
                },
                {
                  num: "05",
                  title: "Receive safety alerts",
                  copy: "Live IoT pushes for closures, weather, and boundary breaches on your trails.",
                  icon: (
                    <>
                      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </>
                  ),
                },
                {
                  num: "06",
                  title: "Protect Sarawak parks",
                  copy: "Guide with confidence — informed, certified, and supported by the network.",
                  icon: (
                    <>
                      <path d="M12 22s-8-4.5-8-12a8 8 0 1 1 16 0c0 7.5-8 12-8 12z" />
                      <circle cx="12" cy="10" r="3" />
                    </>
                  ),
                },
              ].map((s) => (
                <div className="wl-step" key={s.num}>
                  <div className="wl-step-num">{s.num}</div>
                  <span className="wl-step-ico">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {s.icon}
                    </svg>
                  </span>
                  <h4>{s.title}</h4>
                  <p>{s.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PARKS ════════ */}
      <section className="wl-parks" id="parks">
        <div className="wl-container">
          <div className="wl-sec-head wl-reveal">
            <span className="wl-eyebrow"><span className="wl-dot" />Coverage</span>
            <h2 className="wl-sec-title">
              Four iconic parks.
              <em>One platform.</em>
            </h2>
            <p className="wl-sec-lead">
              From Bako's mangroves to Mulu's pinnacles — SarakWay's training reflects each
              park's terrain.
            </p>
          </div>

          <div className="wl-parks-grid">
            {/* BAKO */}
            <article className="wl-park wl-reveal" style={{ "--d": "0s" }}>
              <div className="wl-scene">
                <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="wl-bako" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1a3a4a" />
                      <stop offset="55%" stopColor="#2d5a4a" />
                      <stop offset="100%" stopColor="#0a2419" />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="400" fill="url(#wl-bako)" />
                  <circle cx="220" cy="80" r="32" fill="#DBE0BF" opacity=".55" />
                  <circle cx="220" cy="80" r="58" fill="#DBE0BF" opacity=".1" />
                  <path
                    d="M0 240 L60 180 L120 220 L180 170 L240 215 L300 190 L300 400 L0 400 Z"
                    fill="#0c2618"
                    opacity=".85"
                  />
                  <path
                    d="M0 280 L40 240 L100 270 L160 220 L220 260 L300 230 L300 400 L0 400 Z"
                    fill="#081d13"
                  />
                  <path d="M30 360 C 40 320, 60 320, 70 360 Z" fill="#000" />
                  <path d="M90 360 C 105 300, 130 300, 140 360 Z" fill="#000" />
                  <path d="M180 360 C 190 320, 215 320, 225 360 Z" fill="#000" />
                  <path d="M250 360 C 260 310, 290 310, 300 360 Z" fill="#000" />
                </svg>
              </div>
              <div className="wl-park-overlay" />
              <div className="wl-park-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8C8 10 5.9 16.17 3.82 22" />
                  <path d="M4 7c0 0 4-3 9-3s9 3 9 3" />
                  <path d="M12 22V8" />
                </svg>
              </div>
              <div className="wl-park-content">
                <div className="wl-park-eyebrow">Park 01 · Coastal</div>
                <h3>Bako National Park</h3>
                <p>Mangrove walks, proboscis monkeys and sea-stack viewpoints.</p>
              </div>
            </article>

            {/* MULU */}
            <article className="wl-park wl-reveal" style={{ "--d": ".1s" }}>
              <div className="wl-scene">
                <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="wl-mulu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2a2240" />
                      <stop offset="55%" stopColor="#1a3a3a" />
                      <stop offset="100%" stopColor="#0a1418" />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="400" fill="url(#wl-mulu)" />
                  <ellipse cx="150" cy="220" rx="170" ry="40" fill="#9BBED2" opacity=".18" />
                  <path d="M0 320 L20 220 L40 320 Z" fill="#0c1820" />
                  <path d="M30 320 L55 180 L80 320 Z" fill="#0c1820" />
                  <path d="M70 320 L100 140 L130 320 Z" fill="#091014" />
                  <path d="M120 320 L150 100 L180 320 Z" fill="#0c1820" />
                  <path d="M170 320 L200 160 L230 320 Z" fill="#091014" />
                  <path d="M220 320 L245 200 L270 320 Z" fill="#0c1820" />
                  <path d="M260 320 L280 230 L300 320 Z" fill="#0c1820" />
                  <rect y="320" width="300" height="80" fill="#050a0d" />
                  <circle cx="60" cy="60" r="1.2" fill="#fff" opacity=".7" />
                  <circle cx="100" cy="40" r="0.8" fill="#fff" opacity=".6" />
                  <circle cx="240" cy="50" r="1.2" fill="#fff" opacity=".7" />
                  <circle cx="270" cy="90" r="0.9" fill="#fff" opacity=".6" />
                </svg>
              </div>
              <div className="wl-park-overlay" />
              <div className="wl-park-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3 4 9l8 12 8-12-4-6Z" />
                  <path d="M4 9h16M12 3v18" />
                </svg>
              </div>
              <div className="wl-park-content">
                <div className="wl-park-eyebrow">Park 02 · Karst</div>
                <h3>Gunung Mulu National Park</h3>
                <p>Limestone pinnacles, deep caves and UNESCO biodiversity.</p>
              </div>
            </article>

            {/* KUBAH */}
            <article className="wl-park wl-reveal" style={{ "--d": ".2s" }}>
              <div className="wl-scene">
                <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="wl-kubah" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1c3522" />
                      <stop offset="55%" stopColor="#0e2818" />
                      <stop offset="100%" stopColor="#06140c" />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="400" fill="url(#wl-kubah)" />
                  <path d="M0 110 Q 50 70, 100 110 T 200 110 T 300 110 L300 0 L0 0 Z" fill="#0a1c10" />
                  <path d="M0 160 Q 60 130, 110 160 T 220 160 T 300 160 L300 110 L0 110 Z" fill="#102818" />
                  <path d="M120 0 L180 0 L260 400 L60 400 Z" fill="#DBE0BF" opacity=".07" />
                  <rect x="48" y="180" width="4" height="220" fill="#000" />
                  <rect x="120" y="190" width="5" height="210" fill="#000" />
                  <rect x="180" y="170" width="6" height="230" fill="#000" />
                  <rect x="245" y="195" width="4" height="205" fill="#000" />
                  <ellipse cx="150" cy="370" rx="200" ry="30" fill="#9BBED2" opacity=".2" />
                </svg>
              </div>
              <div className="wl-park-overlay" />
              <div className="wl-park-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8C8 10 5.9 16.17 3.82 22" />
                  <path d="M4 7c0 0 4-3 9-3s9 3 9 3" />
                  <path d="M12 22V8" />
                </svg>
              </div>
              <div className="wl-park-content">
                <div className="wl-park-eyebrow">Park 03 · Rainforest</div>
                <h3>Kubah National Park</h3>
                <p>Waterfalls, palms, and the famed frog pond after dusk.</p>
              </div>
            </article>

            {/* NIAH */}
            <article className="wl-park wl-reveal" style={{ "--d": ".3s" }}>
              <div className="wl-scene">
                <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="wl-niah" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3a2a1a" />
                      <stop offset="55%" stopColor="#1d2818" />
                      <stop offset="100%" stopColor="#06140c" />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="400" fill="url(#wl-niah)" />
                  <path d="M-20 400 L-20 220 Q 40 100, 150 80 Q 260 100, 320 220 L320 400 Z" fill="#000" opacity=".7" />
                  <path d="M-20 400 L-20 250 Q 40 140, 150 122 Q 260 140, 320 250 L320 400 Z" fill="#0a0a0a" />
                  <circle cx="150" cy="240" r="40" fill="#DBE0BF" opacity=".25" />
                  <circle cx="150" cy="240" r="22" fill="#DBE0BF" opacity=".5" />
                  <rect y="360" width="300" height="40" fill="#9BBED2" opacity=".15" />
                  <path d="M40 80 Q 60 120, 50 160 Q 40 200, 60 230" stroke="#1a2a18" strokeWidth="2" fill="none" />
                  <path d="M250 90 Q 240 130, 255 170 Q 270 210, 252 240" stroke="#1a2a18" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="wl-park-overlay" />
              <div className="wl-park-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V8l7-4 7 4v13" />
                </svg>
              </div>
              <div className="wl-park-content">
                <div className="wl-park-eyebrow">Park 04 · Heritage</div>
                <h3>Niah National Park</h3>
                <p>Ancient caves, prehistoric paintings, and lowland rainforest.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="wl-final-cta" id="cta">
        <div className="wl-container">
          <div className="wl-cta-stage wl-reveal">
            <svg
              className="wl-topo"
              viewBox="0 0 1200 600"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <g fill="none" stroke="#DBE0BF" strokeOpacity=".18" strokeWidth="1">
                <ellipse cx="600" cy="300" rx="120" ry="60" />
                <ellipse cx="600" cy="300" rx="200" ry="100" />
                <ellipse cx="600" cy="300" rx="290" ry="150" />
                <ellipse cx="600" cy="300" rx="380" ry="200" />
                <ellipse cx="600" cy="300" rx="480" ry="250" />
                <ellipse cx="600" cy="300" rx="580" ry="300" />
              </g>
              <g fill="none" stroke="#9BBED2" strokeOpacity=".12" strokeWidth="1">
                <ellipse cx="200" cy="500" rx="200" ry="80" />
                <ellipse cx="1000" cy="100" rx="240" ry="100" />
              </g>
            </svg>

            <h2>
              Ready to begin
              <em>your training?</em>
            </h2>
            <p>Join Sarawak's certified guide network and protect the parks with confidence.</p>

            <div className="wl-hero-ctas">
              <button
                className="wl-btn wl-btn-primary wl-btn-lg"
                onClick={() => navigate("/register")}
              >
                Create Account
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
              <button
                className="wl-btn wl-btn-ghost wl-btn-lg"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

            <div className="wl-cta-cert">
              <div className="wl-seal">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div className="wl-small">Certificate · Park Guide</div>
              <div className="wl-cert-name">Conservation Track L2</div>
              <div className="wl-cert-id">SW-2026-0142 · SFC ENDORSED</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="wl-foot">
        <div className="wl-container wl-foot-inner">
          <div className="wl-foot-brand">
            <div className="wl-brand-mark">
              <img src={logo} alt="" />
            </div>
            <div>
              <div className="wl-brand-word">SarakWay</div>
              <small className="wl-brand-sub">sarawak forestry corporation</small>
            </div>
          </div>
          <div className="wl-foot-links">
            <a href="#features">Platform</a>
            <a href="#journey">Journey</a>
            <a href="#parks">Parks</a>
            <a href="#cta">About</a>
          </div>
          <p>© 2026 Sarawak Forestry Corporation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
