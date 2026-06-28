"use strict";

/* ═══════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════ */
let audioStarted = false;
let status       = "UNKNOWN";
let userID       = "";
let fileHTML     = "";
let quizStartTime = null;
let playerName   = "";

/* ═══════════════════════════════════════════════════
   AUDIO
═══════════════════════════════════════════════════ */
document.addEventListener("click", () => {
  if (audioStarted) return;
  const hum = document.getElementById("hum");
  hum.volume = 0.05;
  hum.play().catch(() => {});
  audioStarted = true;
});

function playSafe(id) {
  const a = document.getElementById(id);
  if (!a) return;
  a.pause();
  a.currentTime = 0;
  a.play().catch(() => {});
}

/* ═══════════════════════════════════════════════════
   GLITCH
═══════════════════════════════════════════════════ */
function glitch(heavy = false) {
  const g   = document.getElementById("glitchOverlay");
  const cls = heavy ? "heavyGlitch" : "glitching";

  document.body.classList.add(cls);
  g.style.opacity = heavy ? 0.55 : 0.3;

  setTimeout(() => {
    g.style.opacity = 0;
    document.body.classList.remove(cls);
  }, heavy ? 280 : 130);
}

/* ═══════════════════════════════════════════════════
   SCREEN SYSTEM
═══════════════════════════════════════════════════ */
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  playSafe("glitch");
  glitch();
}

function next(id) {
  playSafe("activity");
  show(id);
}

/* ═══════════════════════════════════════════════════
   NADZORCA — reaguje na kontekst gracza
═══════════════════════════════════════════════════ */
const genericMsgs = [
  "System obserwuje...",
  "Nie wykonuj zbędnych ruchów.",
  "Twoje tempo jest nieregularne.",
  "Brak pełnej zgodności danych.",
  "…czy nadal jesteś przy terminalu?",
  "Wykryto anomalię percepcyjną.",
  "Twoja lokalizacja jest znana.",
  "Nie patrz w ścianę zbyt długo.",
];

const nameMsgs = [
  n => `${n}. Witaj w systemie.`,
  n => `${n} — dane zweryfikowane. Obserwacja aktywna.`,
  n => `Zidentyfikowano: ${n}. Nie uciekniesz.`,
  n => `${n}… to imię było już w bazie.`,
];

function getNadzorcaMsg() {
  if (playerName && Math.random() > 0.55) {
    const fn = nameMsgs[Math.floor(Math.random() * nameMsgs.length)];
    return fn(playerName);
  }
  let msg = genericMsgs[Math.floor(Math.random() * genericMsgs.length)];
  if (Math.random() > 0.65) {
    // urwij losowo zdanie
    msg = msg.slice(0, Math.ceil(msg.length * (0.5 + Math.random() * 0.4)));
    if (!msg.endsWith("…")) msg += "…";
  }
  return "NADZORCA: " + msg;
}

function nadzorcaTick() {
  const el = document.getElementById("nadzorca");
  const msg = getNadzorcaMsg();
  el.classList.remove("alert");

  // co jakiś czas "alert" — czerwony
  if (Math.random() > 0.75) el.classList.add("alert");

  typewriterEl(el, msg, 28, () => {});
  setTimeout(nadzorcaTick, 9000 + Math.random() * 6000);
}

/* ═══════════════════════════════════════════════════
   TYPEWRITER UTILITY
═══════════════════════════════════════════════════ */
function typewriterEl(el, text, speed = 38, onDone = () => {}) {
  el.textContent = "";
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 20);
    } else {
      onDone();
    }
  };
  tick();
}

/* ═══════════════════════════════════════════════════
   BOOT SEQUENCE
═══════════════════════════════════════════════════ */
const bootLines = [
  { text: "BACKROOMS INSTITUTE // SYSTEM v.2026.0",       cls: "",    delay: 0   },
  { text: "Inicjalizacja węzła NODE-0...",                cls: "",    delay: 300 },
  { text: "Sprawdzanie integralności sektora...",         cls: "",    delay: 600 },
  { text: "[OK] SEKTOR 7-A: stabilny",                   cls: "ok",  delay: 1000},
  { text: "[OK] SEKTOR 7-B: stabilny",                   cls: "ok",  delay: 1250},
  { text: "[!!] SEKTOR 7-C: nieokreślony",               cls: "warn",delay: 1500},
  { text: "Ładowanie modułu NADZORCA...",                 cls: "",    delay: 1900},
  { text: "[OK] NADZORCA: aktywny",                      cls: "ok",  delay: 2300},
  { text: "Weryfikacja harmonogramu rekrutacji...",       cls: "",    delay: 2700},
  { text: "[ERR] Brak zgodności z poziomem 0",           cls: "err", delay: 3100},
  { text: "[!!] Procedura awaryjna: rejestracja ręczna", cls: "warn",delay: 3500},
  { text: "Gotowy do przyjęcia rekruta.",                 cls: "ok",  delay: 4100},
  { text: "",                                             cls: "",    delay: 4400},
  { text: "► NACIŚNIJ DOWOLNY KLAWISZ...",               cls: "ok",  delay: 4600},
];

function runBoot() {
  const log = document.getElementById("bootLog");
  let linesShown = 0;

  bootLines.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const span = document.createElement("span");
      if (cls) span.className = cls;
      span.textContent = text + "\n";
      log.appendChild(span);
      linesShown++;

      // po ostatniej linii — czekamy na klik
      if (linesShown === bootLines.length) {
        document.addEventListener("keydown", bootProceed, { once: true });
        document.addEventListener("click",   bootProceed, { once: true });
      }
    }, delay);
  });
}

function bootProceed() {
  glitch(true);
  setTimeout(() => next("intro"), 350);
}

/* ═══════════════════════════════════════════════════
   INTRO
═══════════════════════════════════════════════════ */
function runIntro() {
  const txt = "System monitoruje wejście...\nZidentyfikowano nowy podmiot.\nPrzygotuj dane do rejestracji.";
  const el  = document.getElementById("introText");
  const btn = document.getElementById("introBtn");

  typewriterEl(el, txt, 32, () => {
    setTimeout(() => btn.classList.remove("hidden"), 400);
  });
}

/* ═══════════════════════════════════════════════════
   FORM VALIDATION
═══════════════════════════════════════════════════ */
function validateForm() {
  const name    = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const age     = document.getElementById("age").value.trim();
  const role    = document.getElementById("role").value.trim();
  const c1      = document.getElementById("c1").checked;
  const c2      = document.getElementById("c2").checked;
  const c3      = document.getElementById("c3").checked;
  const errEl   = document.getElementById("formError");

  if (!name || !surname || !age || !role) {
    showFormError(errEl, "[ERR] Niekompletne dane. System wymaga pełnych informacji.");
    return;
  }

  if (!c1 || !c2 || !c3) {
    // Brak zgody — mroczniejsza reakcja systemu
    showFormError(errEl, "[ODMOWA] Zgoda wymagana. Bez niej nie wchodzisz.");
    glitch(true);
    playSafe("glitch");
    return;
  }

  playerName = name; // zapisz imię do Nadzorcy
  errEl.classList.add("hidden");

  quizStartTime = Date.now(); // start timera quizu
  document.getElementById("quizSubtitle").textContent =
    `Odpowiedz szczerze, ${name}. System weryfikuje zgodność.`;

  next("quiz");
}

function showFormError(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
  glitch();
  playSafe("glitch");
}

/* ═══════════════════════════════════════════════════
   QUIZ VALIDATION + SPEED CHECK
═══════════════════════════════════════════════════ */
function validateQuiz() {
  const q1 = document.getElementById("q1").value;
  const q2 = document.getElementById("q2").value;
  const q3 = document.getElementById("q3").value;
  const errEl   = document.getElementById("quizError");
  const timerEl = document.getElementById("quizTimer");

  if (!q1 || !q2 || !q3) {
    errEl.classList.remove("hidden");
    glitch();
    return;
  }
  errEl.classList.add("hidden");

  // Sprawdź czy gracz odpowiedział za szybko (< 4 sekundy)
  const elapsed = (Date.now() - quizStartTime) / 1000;
  if (elapsed < 4) {
    timerEl.textContent = `[OSTRZEŻENIE] Czas reakcji: ${elapsed.toFixed(1)}s. System odnotowuje pośpiech.`;
    timerEl.classList.remove("hidden");
    glitch(true);

    // Zmuś czekać jeszcze chwilę
    setTimeout(() => {
      timerEl.classList.add("hidden");
      analyze(q1, q2, q3);
    }, 2500);
    return;
  }

  timerEl.classList.add("hidden");
  analyze(q1, q2, q3);
}

/* ═══════════════════════════════════════════════════
   ANALYZE
═══════════════════════════════════════════════════ */
function analyze(q1, q2, q3) {
  const score =
    (q1 === "TAK" ? 1 : 0) +
    (q2 === "TAK" ? 1 : 0) +
    (q3 === "TAK" ? 1 : 0);

  status = score >= 2 ? "ANOMALY" : "STABLE";
  userID = generateID();

  show("loading");
  loadingSequence();
}

/* ═══════════════════════════════════════════════════
   ID GENERATOR
═══════════════════════════════════════════════════ */
function generateID() {
  return "BR-" +
    Math.floor(10 + Math.random() * 89) + "-" +
    Math.floor(1000 + Math.random() * 9000) + "-2026";
}

/* ═══════════════════════════════════════════════════
   LOADING — losowe opóźnienia, fałszywy błąd
═══════════════════════════════════════════════════ */
function loadingSequence() {
  const steps = [
    { label: "ANALYZING SUBJECT...",         sub: "pobieranie danych biometrycznych",     progress: 15,  delay: 600  },
    { label: "SYNC NODE 0...",               sub: "synchronizacja z poziomem 0",          progress: 35,  delay: 900  },
    { label: "SCANNING PERCEPTION MATRIX...",sub: "analiza odpowiedzi kwestionariusza",   progress: 55,  delay: 700  },
    { label: "ERROR DETECTED...",            sub: "!! niespójność w sektorze 7-C !!",     progress: 55,  delay: 1400, isError: true },
    { label: "BYPASSING SECTOR 7-C...",      sub: "wdrażanie protokołu awaryjnego",        progress: 70,  delay: 800  },
    { label: "REALITY DRIFT LOGGED...",      sub: `podmiot: ${playerName || "NIEZNANY"}`, progress: 85,  delay: 1000 },
    { label: "GENERATING FILE...",           sub: "kompilacja akt rekruta",               progress: 95,  delay: 700  },
    { label: "COMPLETE.",                    sub: "",                                      progress: 100, delay: 600  },
  ];

  const labelEl = document.getElementById("loadingText");
  const subEl   = document.getElementById("loadingSubtext");
  const fill    = document.getElementById("loadingFill");

  let i = 0;

  function runStep() {
    if (i >= steps.length) {
      setTimeout(intervention, 700);
      return;
    }

    const step = steps[i++];

    if (step.isError) {
      labelEl.style.color = "var(--red)";
      subEl.style.color   = "var(--red)";
      glitch(true);
      playSafe("glitch");
    } else {
      labelEl.style.color = "";
      subEl.style.color   = "";
    }

    labelEl.textContent = step.label;
    subEl.textContent   = step.sub;
    fill.style.width    = step.progress + "%";

    setTimeout(runStep, step.delay);
  }

  runStep();
}

/* ═══════════════════════════════════════════════════
   INTERVENTION
═══════════════════════════════════════════════════ */
function intervention() {
  show("intervention");

  const msgs = [
    `Dokument wygenerowany, ${playerName}.`,
    `System obserwuje. Zawsze obserwuje.`,
    `Nie zaleca się interpretacji własnych akt.`,
    `${playerName} — twoje dane są niestabilne. To nie pierwszy taki przypadek.`,
    `…to nie pierwszy raz, gdy ktoś stąd wychodzi z dokumentem. Nie wszyscy dochodzą do wyjścia.`,
  ];

  const el  = document.getElementById("nadzorcaMsg");
  const msg = msgs[Math.floor(Math.random() * msgs.length)];

  typewriterEl(el, "NADZORCA: " + msg, 35);
  generateDocs();
}

/* ═══════════════════════════════════════════════════
   GENERATE DOCS
═══════════════════════════════════════════════════ */
function generateDocs() {
  const name    = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const age     = document.getElementById("age").value;
  const role    = document.getElementById("role").value;
  const date    = new Date().toLocaleDateString("pl-PL");

  userID = userID || generateID();

  const quotes = [
    "Jednostka wykazuje adaptację do niestabilnych struktur rzeczywistości.",
    "Obserwacje wskazują na brak pełnej zgodności percepcyjnej.",
    "Podmiot reaguje spokojem na anomalie środowiskowe — reakcja atypowa.",
    "Wykryto tendencję do akceptacji systemów nieznanego pochodzenia.",
    "Profil zgodny z ekspozycją na Level 0. Zalecana izolacja obserwacyjna.",
    "Jednostka nie wykazuje strachu. To niepokojące.",
  ];

  const statusNote = status === "ANOMALY"
    ? "PODMIOT ANOMALICZNY — podwyższony nadzór"
    : "PODMIOT STABILNY — standardowy nadzór";

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const styles = `
    font-family:'Courier New',Courier,monospace;
    font-size:13px;
    line-height:1.8;
    color:#1a1a1a;
    background:#ede8d3;
    padding:30px 28px;
    max-width:620px;
    margin:0 auto;
    border:1px solid #aaa;
  `;

  const paper = document.getElementById("paper");

  paper.innerHTML = `
    <div class="stamp">RECOVERED<br>FILE</div>
    <div class="stamp2">BACKROOMS INSTITUTE<br>VERIFIED</div>

    <h3>AKTA REKRUTA</h3>

    <p><b>ID:</b> ${userID}</p>
    <p><b>IMIĘ:</b> ${name}</p>
    <p><b>NAZWISKO:</b> ${surname}</p>
    <p><b>WIEK:</b> ${age}</p>
    <p><b>FUNKCJA / DOM:</b> ${role}</p>
    <p><b>DATA REJESTRACJI:</b> ${date}</p>

    <hr>

    <p><b>STATUS:</b> ${status}</p>
    <p><b>UWAGA:</b> ${statusNote}</p>

    <hr>

    <p><b>CYTAT SYSTEMOWY:</b></p>
    <p><i>"${quote}"</i></p>

    <hr>

    <p><b>REKOMENDACJA:</b> CONTINUOUS OBSERVATION</p>
    <p style="font-size:11px;color:#666;margin-top:16px;">
      Dokument wygenerowany automatycznie przez NADZORCA v.2026.0.<br>
      Wszelkie próby edycji zostaną odnotowane.
    </p>
  `;

  // Zapamiętaj HTML do pobrania (ze stylami inline)
  fileHTML = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>AKTA // ${userID}</title>
<style>
  body { margin: 0; padding: 40px; background: #ede8d3; }
  div[style] { position: relative; }
  .stamp {
    position: absolute; top: 16px; right: 20px;
    border: 3px solid #8b0000; color: #8b0000;
    padding: 6px 10px; font-size: 10px; font-weight: bold;
    letter-spacing: 0.1em; transform: rotate(-8deg);
    opacity: 0.85; text-align: center; line-height: 1.4;
    font-family: 'Courier New', monospace;
  }
  .stamp2 {
    position: absolute; bottom: 20px; left: 20px;
    border: 3px solid #003b8e; color: #003b8e;
    padding: 6px 10px; font-size: 10px; font-weight: bold;
    letter-spacing: 0.08em; transform: rotate(3deg);
    opacity: 0.8; line-height: 1.4;
    font-family: 'Courier New', monospace;
  }
  h3 { font-size: 15px; letter-spacing: 0.12em; text-align: center;
       margin-bottom: 16px; border-bottom: 1px solid #aaa; padding-bottom: 10px; }
  p { margin: 5px 0; }
  hr { border: none; border-top: 1px solid #aaa; margin: 14px 0; }
</style>
</head>
<body>
<div style="${styles}">
  ${paper.innerHTML}
</div>
</body>
</html>`;
}

/* ═══════════════════════════════════════════════════
   DOWNLOAD
═══════════════════════════════════════════════════ */
function downloadFile() {
  if (!fileHTML) { alert("FILE NOT READY"); return; }
  const blob = new Blob([fileHTML], { type: "text/html" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = `BACKROOMS_AKTA_${userID}.html`;
  a.click();
}

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
window.onload = () => {
  runBoot();
  nadzorcaTick();

  // Podmień ekran INTRO po załadowaniu
  // (runIntro jest wywoływane po przejściu z boot)
  const origShow = show;
  window.show = function(id) {
    origShow(id);
    if (id === "intro") runIntro();
  };
};
