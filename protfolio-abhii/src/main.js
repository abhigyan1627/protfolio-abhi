import './style.css';
import { profile, about, skills, techMarquee, experience, projects } from './data.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const icons = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  external:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>',
  folder:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
};

/* ───────────────────────── Render ───────────────────────── */

function render() {
  const firstName = profile.name.split(' ')[0];
  document.getElementById('nav-name').textContent = firstName;
  document.getElementById('footer-name').textContent = profile.name;
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('nav-resume').href = profile.resume;

  const app = document.getElementById('app');
  app.innerHTML = `
  <section id="home" class="hero">
    <div class="hero-text">
      <p class="hero-hello mono reveal" style="--d:0">Hi, my name is</p>
      <h1 class="hero-name reveal" style="--d:1">
        ${[...profile.name].map((ch, i) => `<span class="char" style="--i:${i}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('')}<span class="dot">.</span>
      </h1>
      <h2 class="hero-role reveal" style="--d:2">I'm a <span class="typed"></span><span class="caret">|</span></h2>
      <p class="hero-tagline reveal" style="--d:3">${esc(profile.tagline)}</p>
      <div class="hero-cta reveal" style="--d:4">
        <a href="#projects" class="btn btn-primary magnetic"><span>View my work</span></a>
        <a href="#contact" class="btn btn-outline magnetic"><span>Get in touch</span></a>
      </div>
      <div class="hero-socials reveal" style="--d:5">
        ${profile.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener" class="social-link">${esc(s.label)}</a>`).join('')}
      </div>
    </div>
    <div class="hero-terminal reveal" style="--d:3">
      <div class="terminal tilt">
        <div class="terminal-bar">
          <span class="tb-dot r"></span><span class="tb-dot y"></span><span class="tb-dot g"></span>
          <span class="terminal-title mono">~/abhigyan — zsh</span>
        </div>
        <pre class="terminal-body mono"><code id="terminal-code"></code><span class="term-caret"></span></pre>
      </div>
    </div>
    <a href="#about" class="scroll-hint" aria-label="Scroll down"><span></span></a>
  </section>

  <section class="marquee-wrap" aria-label="Technologies">
    <div class="marquee">
      <div class="marquee-track">
        ${[...techMarquee, ...techMarquee].map((t) => `<span class="marquee-item mono">${esc(t)}</span>`).join('<span class="marquee-sep">◆</span>')}
      </div>
    </div>
  </section>

  <section id="about" class="section">
    <h2 class="section-title reveal"><span class="num mono">01.</span> About Me</h2>
    <div class="about-grid">
      <div class="about-text">
        ${about.paragraphs.map((p, i) => `<p class="reveal" style="--d:${i}">${esc(p)}</p>`).join('')}
      </div>
      <div class="about-avatar reveal" style="--d:1">
        <div class="avatar-ring"></div>
        <div class="avatar-core"><span class="mono">${esc(profile.initials)}</span></div>
        <div class="orbit"><span class="orbit-dot"></span></div>
        <div class="orbit orbit-2"><span class="orbit-dot"></span></div>
      </div>
    </div>
    <div class="stats">
      ${about.stats
        .map(
          (s, i) => `
        <div class="stat-card reveal" style="--d:${i}">
          <div class="stat-value"><span class="counter" data-target="${s.value}">0</span>${esc(s.suffix)}</div>
          <div class="stat-label">${esc(s.label)}</div>
        </div>`
        )
        .join('')}
    </div>
  </section>

  <section id="skills" class="section">
    <h2 class="section-title reveal"><span class="num mono">02.</span> Skills</h2>
    <div class="skills-grid">
      ${skills
        .map(
          (g, gi) => `
        <div class="skill-card glow-card reveal" style="--d:${gi}">
          <h3 class="mono">${esc(g.group)}</h3>
          <ul>
            ${g.items
              .map(
                (s) => `
              <li class="skill">
                <div class="skill-head"><span>${esc(s.name)}</span><span class="mono skill-pct" data-target="${s.level}">0%</span></div>
                <div class="skill-bar"><span style="--w:${s.level}%"></span></div>
              </li>`
              )
              .join('')}
          </ul>
        </div>`
        )
        .join('')}
    </div>
  </section>

  <section id="experience" class="section">
    <h2 class="section-title reveal"><span class="num mono">03.</span> Experience &amp; Education</h2>
    <div class="timeline">
      <div class="timeline-line"><span></span></div>
      ${experience
        .map(
          (e, i) => `
        <article class="timeline-item ${i % 2 ? 'right' : 'left'} reveal">
          <div class="timeline-dot"></div>
          <div class="timeline-card glow-card">
            <span class="timeline-period mono">${esc(e.period)}</span>
            <h3>${esc(e.role)} <span class="accent">@ ${esc(e.company)}</span></h3>
            <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          </div>
        </article>`
        )
        .join('')}
    </div>
  </section>

  <section id="projects" class="section">
    <h2 class="section-title reveal"><span class="num mono">04.</span> Things I've Built</h2>
    <div class="projects-grid">
      ${projects
        .map(
          (p, i) => `
        <article class="project-card glow-card tilt reveal" style="--d:${i % 2}">
          <div class="project-top">
            <span class="project-icon">${icons.folder}</span>
            <div class="project-links">
              ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" aria-label="GitHub">${icons.github}</a>` : ''}
              ${p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener" aria-label="Live demo">${icons.external}</a>` : ''}
            </div>
          </div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          <ul class="project-tech mono">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        </article>`
        )
        .join('')}
    </div>
  </section>

  <section id="contact" class="section contact">
    <p class="mono accent reveal">05. What's next?</p>
    <h2 class="contact-title reveal" style="--d:1">Let's build something <span class="gradient-text">great</span> together.</h2>
    <p class="contact-text reveal" style="--d:2">I'm actively looking for SDE opportunities. Whether you have a role, a question, or just want to say hi — my inbox is always open.</p>
    <div class="reveal" style="--d:3">
      <a href="mailto:${esc(profile.email)}" class="btn btn-primary btn-lg magnetic"><span>Say Hello 👋</span></a>
    </div>
    <div class="contact-socials reveal" style="--d:4">
      ${profile.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener" class="social-link">${esc(s.label)}</a>`).join('')}
    </div>
  </section>`;
}

/* ───────────────────────── Loader ───────────────────────── */

function runLoader() {
  const loader = document.getElementById('loader');
  const text = document.getElementById('loader-text');
  const word = profile.name.split(' ')[0];
  if (reduceMotion) {
    loader.remove();
    document.body.classList.add('loaded');
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let i = 0;
    const t = setInterval(() => {
      text.textContent = word.slice(0, ++i);
      if (i >= word.length) {
        clearInterval(t);
        setTimeout(() => {
          loader.classList.add('done');
          document.body.classList.add('loaded');
          setTimeout(() => loader.remove(), 700);
          resolve();
        }, 450);
      }
    }, 90);
  });
}

/* ──────────────────── Typing role effect ─────────────────── */

function typeRoles() {
  const el = document.querySelector('.typed');
  const roles = profile.roles;
  if (reduceMotion) {
    el.textContent = roles[0];
    return;
  }
  let r = 0, c = 0, deleting = false;
  const tick = () => {
    const word = roles[r];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);
    let delay = deleting ? 40 : 85;
    if (!deleting && c === word.length) { deleting = true; delay = 1600; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    setTimeout(tick, delay);
  };
  tick();
}

/* ─────────────────── Animated terminal code ──────────────── */

function typeTerminal() {
  const el = document.getElementById('terminal-code');
  const tokens = [
    ['p', '$ '], ['c', 'cat engineer.ts\n\n'],
    ['k', 'const '], ['v', 'engineer'], ['c', ' = {\n'],
    ['c', '  name: '], ['s', `'${profile.name}'`], ['c', ',\n'],
    ['c', '  role: '], ['s', `'${profile.title}'`], ['c', ',\n'],
    ['c', '  stack: ['], ['s', "'Java'"], ['c', ', '], ['s', "'TS'"], ['c', ', '], ['s', "'React'"], ['c', ', '], ['s', "'AWS'"], ['c', '],\n'],
    ['c', '  loves: ['], ['s', "'clean code'"], ['c', ', '], ['s', "'system design'"], ['c', '],\n'],
    ['c', '  openToWork: '], ['k', 'true'], ['c', ',\n'],
    ['c', '};\n\n'],
    ['p', '$ '], ['c', 'npm run '], ['f', 'hire'], ['c', '\n'],
    ['o', '✔ Build passed  ✔ Tests 128/128  ✔ Ready to ship 🚀'],
  ];
  if (reduceMotion) {
    el.innerHTML = tokens.map(([t, s]) => `<span class="t-${t}">${esc(s)}</span>`).join('');
    return;
  }
  let ti = 0, ci = 0, span = null;
  const step = () => {
    if (ti >= tokens.length) return;
    const [type, str] = tokens[ti];
    if (!span) { span = document.createElement('span'); span.className = `t-${type}`; el.appendChild(span); }
    span.textContent += str[ci++];
    if (ci >= str.length) { ti++; ci = 0; span = null; }
    const ch = str[ci - 1];
    setTimeout(step, ch === '\n' ? 90 : type === 'o' ? 12 : 14 + Math.random() * 18);
  };
  setTimeout(step, 500);
}

/* ─────────────────── Scroll reveal & counters ────────────── */

function animateNumber(el, target, suffix = '', duration = 1600) {
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const start = performance.now();
  const frame = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('in');
        // Once revealed, drop .reveal so the element's own hover/tilt transitions take over.
        const settle = () => el.classList.remove('reveal');
        el.addEventListener('transitionend', (ev) => ev.target === el && ev.propertyName === 'opacity' && settle());
        setTimeout(settle, 2000);
        el.querySelectorAll('.counter').forEach((c) => animateNumber(c, +c.dataset.target));
        el.querySelectorAll('.skill-pct').forEach((c) => animateNumber(c, +c.dataset.target, '%', 1400));
        io.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/* ──────────────── Scroll progress, nav, timeline ─────────── */

function setupScroll() {
  const bar = document.querySelector('.scroll-progress');
  const nav = document.querySelector('.nav');
  const line = document.querySelector('.timeline-line span');
  const timeline = document.querySelector('.timeline');
  const links = [...document.querySelectorAll('.nav-links a[data-num]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    nav.classList.toggle('scrolled', y > 30);
    nav.classList.toggle('hidden', y > lastY && y > 400 && !nav.classList.contains('open'));
    lastY = y;

    const r = timeline.getBoundingClientRect();
    const prog = Math.min(Math.max((innerHeight * 0.7 - r.top) / r.height, 0), 1);
    line.style.transform = `scaleY(${prog})`;

    let active = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) active = i; });
    links.forEach((a, i) => a.classList.toggle('active', i === active));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-links a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ─────────────── Pointer effects: glow, tilt, magnet ─────── */

function setupPointerFx() {
  if (isTouch || reduceMotion) return;

  const glow = document.querySelector('.cursor-glow');
  let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
  window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; });
  const loop = () => {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll('.glow-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  document.querySelectorAll('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ─────────────── Background: connected node network ──────── */

function setupCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, dpr, nodes = [];
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    const count = Math.min(Math.floor((innerWidth * innerHeight) / 16000), 90);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35 * dpr,
      vy: (Math.random() - 0.5) * 0.35 * dpr,
      r: (Math.random() * 1.6 + 0.6) * dpr,
    }));
  };
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  window.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  const linkDist = 130;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const ld = linkDist * dpr;
    for (const n of nodes) {
      if (!reduceMotion) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 120 * dpr && d > 0) { n.x += (dx / d) * 0.8 * dpr; n.y += (dy / d) * 0.8 * dpr; }
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(94, 234, 212, 0.7)';
      ctx.fill();
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < ld) {
          ctx.strokeStyle = `rgba(129, 140, 248, ${(1 - d / ld) * 0.35})`;
          ctx.lineWidth = dpr * 0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  };
  draw();
}

/* ───────────────────────── Boot ───────────────────────── */

render();
setupCanvas();
setupScroll();
setupPointerFx();
runLoader().then(() => {
  setupReveal();
  typeRoles();
  typeTerminal();
});
