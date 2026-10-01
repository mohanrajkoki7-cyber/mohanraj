/* EDIT ME: paste your links here. Anything left empty stays hidden. */
const LINKS = {
  linkedin: "",   // e.g. "https://www.linkedin.com/in/your-name"
  github: "",     // e.g. "https://github.com/your-name"
  resume: "",     // e.g. "Mohanraj-R-Resume.pdf" (put the file next to index.html)
  projects: ["", "", "", ""]  // repo links for Issues #1 to #4, in order
};

const R = document.documentElement;
const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
const $ = (s, e = document) => [...e.querySelectorAll(s)];
if (!calm) R.classList.add("js");

/* one observer reveals each block once */
$(".flow").forEach(f => $("li", f).forEach((li, k) => li.style.setProperty("--i", k)));
$(".chips").forEach(c => $("li", c).forEach((li, k) => li.style.setProperty("--i", k)));
if (!calm) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  $(".page > h2, .rv").forEach(el => { el.classList.add("rv"); io.observe(el); });
}

/* pause infinite animations when off-screen or tab hidden */
const pause = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("off", !e.isIntersecting)));
$(".live").forEach(el => pause.observe(el));
document.addEventListener("visibilitychange", () => R.classList.toggle("hid", document.hidden));

/* scroll-linked bits: read first, then write */
const ring = document.getElementById("ring"), route = $(".route")[0];
let queued = false;
function frame() {
  queued = false;
  const max = R.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
  const r = route.getBoundingClientRect();
  const q = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
  ring.style.strokeDashoffset = 1 - p;
  route.style.setProperty("--p", q);
  R.classList.toggle("stuck", scrollY > 90);
}
function queue() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
addEventListener("scroll", queue, { passive: true });
addEventListener("resize", queue);
queue();
document.getElementById("up").onclick = () => scrollTo({ top: 0 });

/* skyline and falling cards, generated once */
const stage = document.getElementById("top"), cityEl = document.getElementById("city");
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function layer(cls, lo, hi, front) {
  let x = -10, out = "";
  while (x < 1200) {
    const w = 44 + rnd() * 62 | 0, h = lo + rnd() * (hi - lo) | 0, top = 220 - h;
    let g = `<rect class="${cls}" x="${x}" y="${top}" width="${w}" height="${h}"/>`;
    if (rnd() < 0.3) { const cx = x + w / 2, sp = Math.min(top, 30 + rnd() * 26) | 0; g += `<polygon class="${cls}" points="${cx - 5},${top} ${cx},${top - sp} ${cx + 5},${top}"/>`; }
    if (front) {
      let ws = "";
      for (let wy = top + 12; wy < 208; wy += 18) for (let wx = x + 8; wx < x + w - 10; wx += 14)
        if (rnd() < 0.24) ws += `<rect class="wn" x="${wx}" y="${wy}" width="6" height="8"/>`;
      g += `<g class="wg${rnd() < 0.3 ? " on" : ""}" style="--dl:${(x / 1200 * 1.6).toFixed(2)}s">${ws}</g>`;
      out += `<g class="bd" style="--dy:${14 + rnd() * 26 | 0}px;--rt:${(rnd() * 8 - 4).toFixed(1)}deg">${g}</g>`;
    } else out += g;
    x += w + (rnd() * 5 | 0);
  }
  return out;
}
cityEl.innerHTML = layer("b1", 90, 190, false) + layer("b2", 40, 150, true);
const suits = ["\u2660", "\u2665", "\u2666", "\u2663"];
document.getElementById("cards").innerHTML = Array.from({ length: 18 }, (_, i) =>
  `<i class="card" style="--x:${((i * 5.6 + rnd() * 3) % 96).toFixed(1)}%;--dl:${(rnd() * 2.4).toFixed(2)}s;--dur:${(2.4 + rnd() * 1.6).toFixed(2)}s;--r:${rnd() * 720 - 360 | 0}deg">${suits[i % 4]}</i>`).join("");

/* the story: signal lights up, chaos hits, order is restored */
const ctrl = document.getElementById("ctrl"), hudtxt = document.getElementById("hudtxt");
const hits = $(".bd").filter((_, i) => i % 3 === 1);
let timers = [];
const later = (ms, fn) => timers.push(setTimeout(fn, ms));
const hud = t => { hudtxt.textContent = t; };
function clear() { timers.forEach(clearTimeout); timers = []; hits.forEach(g => g.classList.remove("hit")); }
function finish() {
  clear();
  stage.className = "stage live ready s1 s1b s4";
  hud("THREAT NEUTRALIZED");
  ctrl.textContent = "Replay story";
}
function play() {
  clear();
  stage.className = "stage live ready";
  hud(""); ctrl.textContent = "Skip story";
  void stage.offsetWidth;
  const add = c => stage.classList.add(c);
  later(300, () => { add("s1"); hud("SIGNAL ONLINE"); });
  later(2100, () => { add("s1b"); hud("GOTHAM GRID: SECURE"); });
  later(5600, () => { add("s2"); hud("SYSTEM BREACH // WILD CARD DETECTED"); hits.forEach((g, k) => later(500 + k * 260, () => g.classList.add("hit"))); });
  later(10200, () => { add("s3"); hud("COUNTERMEASURE ACTIVE"); });
  later(10850, () => { stage.classList.remove("s2"); hits.forEach((g, k) => later(k * 140, () => g.classList.remove("hit"))); });
  later(13200, () => { stage.classList.remove("s3"); add("s4"); hud("THREAT NEUTRALIZED"); ctrl.textContent = "Replay story"; });
}
ctrl.onclick = () => (stage.classList.contains("s4") ? play() : finish());
if (R.classList.contains("play")) play(); else stage.classList.add("ready");

/* sample terminal output, typed once when visible */
const log = [
  "203.0.113.7 POST /login 401", "203.0.113.7 POST /login 401", "203.0.113.7 POST /login 401",
  "[ALERT] Brute force: 3 failed logins in 4s from 203.0.113.7",
  "198.51.100.9 GET /search?q=' OR 1=1-- 200", "[ALERT] SQL injection payload from 198.51.100.9",
  "192.0.2.15 GET /../../etc/passwd 403", "[ALERT] Directory traversal from 192.0.2.15",
  "Report saved. 3 threats flagged."
];
const term = document.getElementById("term");
const tio = new IntersectionObserver(es => {
  if (!es[0].isIntersecting) return;
  tio.disconnect();
  let k = 0;
  (function next() {
    if (k >= log.length) return;
    const l = log[k++], d = document.createElement("div");
    d.textContent = l;
    if (l.startsWith("[ALERT]")) d.className = "al";
    term.append(d);
    setTimeout(next, calm ? 0 : l.startsWith("[ALERT]") ? 800 : 400);
  })();
}, { threshold: 0.4 });
tio.observe(term);

/* comic cover tilt: pointer position is batched into one rAF per card */
$(".cover").forEach(c => {
  let f = 0, ev;
  c.addEventListener("pointermove", e => {
    ev = e;
    if (f) return;
    f = requestAnimationFrame(() => {
      f = 0;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--ry", ((ev.clientX - r.left) / r.width - 0.5) * 14 + "deg");
      c.style.setProperty("--rx", -((ev.clientY - r.top) / r.height - 0.5) * 14 + "deg");
    });
  });
  c.addEventListener("pointerleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
});

/* looping caution tape */
$(".tape .t").forEach(t => { t.innerHTML += t.innerHTML; });

/* count-up highlights */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.n, t0 = performance.now();
  cio.unobserve(el);
  (function f(t) {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}));
if (!calm) $("[data-n]").forEach(el => { el.textContent = 0; cio.observe(el); });

/* nav highlights the section in view */
const links = new Map($(".top a").map(a => [a.getAttribute("href").slice(1), a]));
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.removeAttribute("aria-current"));
  const a = links.get(e.target.id);
  if (a) a.setAttribute("aria-current", "true");
}), { rootMargin: "-45% 0px -50% 0px" });
$("main .page[id]").forEach(s => spy.observe(s));

/* contact helpers */
const copy = document.getElementById("copy");
copy.onclick = async () => {
  try { await navigator.clipboard.writeText("mohanrajkoki7@gmail.com"); copy.textContent = "Copied!"; }
  catch { copy.textContent = "Copy it from above"; }
  setTimeout(() => { copy.textContent = "Copy email"; }, 1800);
};
document.getElementById("pdf").onclick = () => print();

/* interactive log hunter: real regex checks, runs locally */
const sample = [
  '203.0.113.7 - "POST /login" 401', '203.0.113.7 - "POST /login" 401', '203.0.113.7 - "POST /login" 401',
  '198.51.100.4 - "GET /index.html" 200', `198.51.100.9 - "GET /search?q=' OR 1=1--" 200`, '192.0.2.15 - "GET /../../etc/passwd" 403'
].join("\n");
const logs = document.getElementById("logs"), found = document.getElementById("found");
const rules = [
  ["SQL injection", /('|%27)\s*(or|and)\s*('|%27)?\d+('|%27)?\s*=\s*('|%27)?\d+|union(\s|\+|%20)+select|;\s*drop\s+table/i],
  ["Directory traversal", /(\.\.\/|\.\.\\|%2e%2e(%2f|\/))/i]
];
function show(items) {
  found.replaceChildren(...items.map(([cls, title, text]) => {
    const li = document.createElement("li"), b = document.createElement("b"), c = document.createElement("code");
    li.className = cls; b.textContent = title; c.textContent = text;
    li.append(b, " ", c);
    return li;
  }));
}
function scan() {
  const out = [], fails = {};
  logs.value.split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    const ip = (line.match(/^\S+/) || [""])[0];
    rules.forEach(([name, re]) => { if (re.test(line)) out.push(["", name, `line ${i + 1}: ${line}`]); });
    if (/\/login/i.test(line) && /\s(401|403)\s*$/.test(line)) (fails[ip] = fails[ip] || []).push(i + 1);
  });
  Object.entries(fails).forEach(([ip, ls]) => { if (ls.length >= 3) out.push(["", "Brute force", `${ls.length} failed logins from ${ip} (lines ${ls.join(", ")})`]); });
  show(out.length ? out : [["ok", "All clear", "No suspicious patterns found."]]);
}
logs.value = sample;
document.getElementById("scan").onclick = scan;
document.getElementById("reset").onclick = () => { logs.value = sample; found.replaceChildren(); };

/* apply the links from LINKS above */
[["li", "linkedin"], ["gh", "github"], ["cv", "resume"]].forEach(([id, k]) => {
  const a = document.getElementById(id);
  if (LINKS[k]) { a.href = LINKS[k]; a.hidden = false; }
});
$(".cover").forEach((c, i) => {
  if (!LINKS.projects[i]) return;
  const a = Object.assign(document.createElement("a"), { className: "btn", href: LINKS.projects[i], target: "_blank", rel: "noopener", textContent: "View code" });
  c.querySelector(".body").append(a);
});
