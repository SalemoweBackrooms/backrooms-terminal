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
let playerGender = "I";

function g(m, k, i) {
  if (playerGender === "M") return m;
  if (playerGender === "K") return k;
  return i;
}

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
  n => `${n}\u2026 to imi\u0119 by\u0142o ju\u017c w bazie.`,
  n => `${n} \u2014 ${g("obserwowany", "obserwowana", "podmiot obserwowany")} od momentu wej\u015bcia.`,
  n => `${n}. ${g("Zidentyfikowany", "Zidentyfikowana", "Podmiot zidentyfikowany")}. Nadz\u00f3r aktywny.`,
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
  const gender  = document.getElementById("gender").value;
  const role    = document.getElementById("role").value;
  const c1      = document.getElementById("c1").checked;
  const c2      = document.getElementById("c2").checked;
  const c3      = document.getElementById("c3").checked;
  const errEl   = document.getElementById("formError");

  if (!name || !surname || !age || !gender || !role) {
    showFormError(errEl, "[ERR] Niekompletne dane. System wymaga pełnych informacji.");
    return;
  }

  if (!c1 || !c2 || !c3) {
    showFormError(errEl, "[ODMOWA] Zgoda wymagana. Bez niej nie wchodzisz.");
    glitch(true);
    playSafe("glitch");
    return;
  }

  playerName   = name;
  playerGender = gender;
  errEl.classList.add("hidden");

  quizStartTime = Date.now();
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

  const roleKey = document.getElementById("role").value;
  const house   = HOUSES[roleKey] || {};

  const msgs = [
    `Dokument wygenerowany, ${playerName}.`,
    `System obserwuje. Zawsze obserwuje.`,
    `Nie zaleca się interpretacji własnych akt.`,
    `${playerName} — twoje dane są niestabilne. To nie pierwszy taki przypadek.`,
    `…nie wszyscy wychodzą stąd z dokumentem. Ty masz szczęście.`,
    `${house.label ? house.label + ". " : ""}System odnotował twój wybór.`,
    `${playerName}. ${house.motto || "System obserwuje."}`,
    `${playerName} — ${g("obserwowany od wejścia", "obserwowana od wejścia", "podmiot obserwowany od wejścia")}.`,
  ];

  const el  = document.getElementById("nadzorcaMsg");
  const msg = msgs[Math.floor(Math.random() * msgs.length)];

  typewriterEl(el, "NADZORCA: " + msg, 35);
  generateDocs();
}

/* ═══════════════════════════════════════════════════
   HOUSE DATA
═══════════════════════════════════════════════════ */
const HOUSES = {
  "Gryffindor": {
    color1:  "#7f0909",
    color2:  "#ffc500",
    label:   "GRYFFINDOR",
    crest:   "🦁",
    title:   () => g("Adept Magiczny", "Adeptka Magiczna", "Adept Magiczny"),
    motto:   "Odwaga, odwaga, zawsze odwaga.",
    facts: [
      "Adepci Gryffindoru słyną z nieustraszoności — i nieprzemyślanych decyzji.",
      "Dom założony przez Godrica Gryffindora, mistrza walk magicznych.",
      "Złoto i szkarłat — kolory krwi i ognia. Pasujące do tych, którzy zawsze wbiegają pierwsi.",
      "Symbolem domu jest lew — dumny, głośny i rzadko ostrożny.",
    ]
  },
  "Hufflepuff": {
    color1:  "#ecb939",
    color2:  "#372e29",
    label:   "HUFFLEPUFF",
    crest:   "🦡",
    title:   () => g("Adept Magiczny", "Adeptka Magiczna", "Adept Magiczny"),
    motto:   "Lojalność jest rzadką magią.",
    facts: [
      "Hufflepuff wydał więcej Aurorów niż jakikolwiek inny dom — po cichu.",
      "Dom założony przez Helgę Hufflepuff, która jako jedyna przyjmowała wszystkich.",
      "Żółć i czerń — kolor pszczoły. Pracowitość bywa groźniejsza niż błyskotliwość.",
      "Borsuk kopie głęboko i długo. Adepci Hufflepuffu też.",
    ]
  },
  "Ravenclaw": {
    color1:  "#0e1a40",
    color2:  "#946b2d",
    label:   "RAVENCLAW",
    crest:   "🦅",
    title:   () => g("Adept Magiczny", "Adeptka Magiczna", "Adept Magiczny"),
    motto:   "Wiedza to jedyna magia, której nie można zabrać.",
    facts: [
      "Wejście do wieży Ravenclawu strzeże zagadka — nie hasło. Niektórzy czekają godzinami.",
      "Dom założony przez Rowenę Ravenclaw, która podobno utraciła diadem dla miłości.",
      "Niebieskie i brązowe — barwy nieba i ziemi. Mądrość w teorii i w praktyce.",
      "Orzeł widzi dalej. Adepci Ravenclawu też — czasem za daleko.",
    ]
  },
  "Slytherin": {
    color1:  "#1a472a",
    color2:  "#aaaaaa",
    label:   "SLYTHERIN",
    crest:   "🐍",
    title:   () => g("Adept Magiczny", "Adeptka Magiczna", "Adept Magiczny"),
    motto:   "Cel uświęca środki. System to potwierdza.",
    facts: [
      "Nie każdy ze Slytherinu jest zły. Ale system i tak ich obserwuje uważniej.",
      "Dom założony przez Salazara Slytherina — jedynego z założycieli, który odszedł.",
      "Zieleń i srebro — barwy ambicji i chłodnej kalkulacji.",
      "Wąż nie atakuje bez powodu. Adepci Slytherinu też nie.",
    ]
  },
  "Nauczyciel": {
    color1:  "#3b1f5e",
    color2:  "#c9a0dc",
    label:   "KADRA SALEM",
    crest:   "✦",
    title:   "Nauczyciel / Kadra",
    motto:   "Uczysz magii. System uczy ciebie.",
    facts: [
      "Kadra Szkoły Salem przeszła weryfikację poziomu 0. Większość o tym nie wie.",
      "Nauczyciel to nie tylko funkcja — to kategoria obserwacji.",
      "Fiolet — kolor wiedzy i autorytetu. System odnotowuje jedno i drugie.",
      "Nie wszystkie drzwi w Salem są dla uczniów. Niektóre są tylko dla kadry. Inne — dla nikogo.",
    ]
  }
};

/* ═══════════════════════════════════════════════════
   GENERATE DOCS
═══════════════════════════════════════════════════ */
function generateDocs() {
  const name    = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const age     = document.getElementById("age").value;
  const roleKey = document.getElementById("role").value;
  const date    = new Date().toLocaleDateString("pl-PL");

  userID = userID || generateID();

  const _house = HOUSES[roleKey] || HOUSES["Gryffindor"];
  const house = { ..._house, title: typeof _house.title === "function" ? _house.title() : _house.title };
  const fact  = house.facts[Math.floor(Math.random() * house.facts.length)];

  const quotes = [
    "Jednostka wykazuje adaptację do niestabilnych struktur rzeczywistości.",
    "Obserwacje wskazują na brak pełnej zgodności percepcyjnej.",
    "Podmiot reaguje spokojem na anomalie środowiskowe — reakcja atypowa.",
    "Wykryto tendencję do akceptacji systemów nieznanego pochodzenia.",
    "Profil zgodny z ekspozycją na Level 0. Zalecana izolacja obserwacyjna.",
    "Jednostka nie wykazuje strachu. To niepokojące.",
  ];

  const genderLabel = g("PODMIOT ANOMALICZNY", "PODMIOTKA ANOMALICZNA", "PODMIOT ANOMALICZNY");
  const genderStable = g("PODMIOT STABILNY", "PODMIOTKA STABILNA", "PODMIOT STABILNY");
  const statusNote = status === "ANOMALY"
    ? genderLabel + " — podwyższony nadzór"
    : genderStable + " — standardowy nadzór";

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Wspólny CSS dokumentu — używany i na stronie i w pliku do pobrania
  const sharedCSS = `
    font-family:'Courier New',Courier,monospace;
    font-size:13px;
    line-height:1.8;
    color:#1a1a1a;
  `;

  const docHTML = buildDocHTML({ name, surname, age, date, house, statusNote, fact, quote });

  const paper = document.getElementById("paper");
  paper.style.cssText = "padding:0; overflow:hidden; position:relative;";
  paper.innerHTML = docHTML;

  // Plik do pobrania
  fileHTML = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>AKTA // ${userID}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #b0a898;
    padding: 40px 20px;
    ${sharedCSS}
  }
  .doc-wrap {
    max-width: 640px;
    margin: 0 auto;
    background: #ede8d3;
    border: 1px solid #999;
    box-shadow: 5px 5px 0 rgba(0,0,0,0.35);
    position: relative;
    overflow: hidden;
  }
  .house-bar {
    width: 100%;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    background: linear-gradient(90deg, ${house.color1} 0%, ${house.color2} 100%);
  }
  .house-crest { font-size: 28px; line-height: 1; }
  .house-info  { display: flex; flex-direction: column; }
  .house-name  { color: #fff; font-size: 13px; font-weight: bold; letter-spacing: 0.18em; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
  .house-role  { color: rgba(255,255,255,0.75); font-size: 10px; letter-spacing: 0.12em; margin-top: 1px; }
  .doc-body    { padding: 24px 28px 60px; }
  .doc-title   { text-align: center; font-size: 13px; letter-spacing: 0.18em; font-weight: bold; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #aaa; }
  .doc-title small { display: block; font-size: 10px; letter-spacing: 0.1em; color: #666; margin-top: 3px; font-weight: normal; }
  .doc-section { margin: 14px 0; }
  .doc-row     { display: flex; gap: 8px; margin: 4px 0; font-size: 12px; }
  .doc-key     { min-width: 140px; color: #555; text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; }
  .doc-val     { color: #111; font-weight: bold; }
  .doc-hr      { border: none; border-top: 1px solid #c0b89a; margin: 16px 0; }
  .doc-label   { font-size: 10px; color: #888; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
  .doc-quote   { font-style: italic; color: #333; font-size: 12px; line-height: 1.7; padding-left: 10px; border-left: 2px solid #c0b89a; }
  .doc-fact    { font-size: 11px; color: #555; line-height: 1.6; padding: 8px 10px; background: rgba(0,0,0,0.04); border-left: 2px solid ${house.color1}; }
  .doc-motto   { font-size: 12px; color: #333; font-style: italic; padding-left: 10px; }
  .doc-status  { display: inline-block; padding: 3px 10px; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; border: 1px solid currentColor; }
  .doc-status.anomaly { color: #8b0000; border-color: #8b0000; background: rgba(139,0,0,0.06); }
  .doc-status.stable  { color: #1a472a; border-color: #1a472a; background: rgba(26,71,42,0.06); }
  .doc-footer  { font-size: 10px; color: #999; margin-top: 18px; line-height: 1.6; }
  .stamp-rec {
    position: absolute; top: 80px; right: 18px;
    border: 3px solid rgba(139,0,0,0.7); color: rgba(139,0,0,0.75);
    padding: 6px 10px; font-size: 10px; font-weight: bold;
    letter-spacing: 0.1em; transform: rotate(-7deg);
    text-align: center; line-height: 1.5; pointer-events: none;
  }
  .stamp-ver {
    position: absolute; bottom: 18px; right: 20px;
    border: 3px solid rgba(0,59,142,0.6); color: rgba(0,59,142,0.65);
    padding: 5px 8px; font-size: 9px; font-weight: bold;
    letter-spacing: 0.08em; transform: rotate(4deg);
    text-align: center; line-height: 1.5; pointer-events: none;
  }
</style>
</head>
<body>
<div class="doc-wrap">
  ${docHTML}
</div>
</body>
</html>`;
}

/* ═══════════════════════════════════════════════════
   BUILD DOC HTML (shared between screen + download)
═══════════════════════════════════════════════════ */
function buildDocHTML({ name, surname, age, date, house, statusNote, fact, quote }) {
  const statusCls = status === "ANOMALY" ? "anomaly" : "stable";

  return `
  <style>
    #paper * { box-sizing: border-box; }
    .house-bar {
      width: 100%; padding: 12px 24px;
      display: flex; align-items: center; gap: 14px;
      background: linear-gradient(90deg, ${house.color1} 0%, ${house.color2} 100%);
    }
    .house-crest { font-size: 28px; line-height: 1; }
    .house-info  { display: flex; flex-direction: column; }
    .house-name  { color: #fff; font-size: 13px; font-weight: bold; letter-spacing: 0.18em; text-shadow: 0 1px 3px rgba(0,0,0,0.5); font-family: 'Courier New', monospace; }
    .house-role  { color: rgba(255,255,255,0.75); font-size: 10px; letter-spacing: 0.12em; margin-top: 1px; font-family: 'Courier New', monospace; }
    .doc-body    { padding: 22px 26px 52px; font-family: 'Courier New', monospace; font-size: 13px; color: #1a1a1a; line-height: 1.8; position: relative; }
    .doc-title   { text-align: center; font-size: 12px; letter-spacing: 0.2em; font-weight: bold; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 2px solid #bbb; }
    .doc-title small { display: block; font-size: 10px; letter-spacing: 0.1em; color: #777; margin-top: 3px; font-weight: normal; }
    .doc-row     { display: flex; gap: 8px; margin: 3px 0; font-size: 12px; }
    .doc-key     { min-width: 150px; color: #666; text-transform: uppercase; letter-spacing: 0.06em; font-size: 11px; padding-top: 1px; }
    .doc-val     { color: #111; font-weight: bold; }
    .doc-hr      { border: none; border-top: 1px solid #c8bfa0; margin: 14px 0; }
    .doc-label   { font-size: 10px; color: #999; letter-spacing: 0.14em; text-transform: uppercase; margin: 12px 0 4px; }
    .doc-quote   { font-style: italic; color: #333; font-size: 12px; line-height: 1.7; padding-left: 10px; border-left: 2px solid #c8bfa0; margin: 0; }
    .doc-fact    { font-size: 11px; color: #555; line-height: 1.6; padding: 7px 10px; background: rgba(0,0,0,0.04); border-left: 3px solid ${house.color1}; margin: 4px 0 0; }
    .doc-motto   { font-size: 12px; color: #333; font-style: italic; padding-left: 10px; margin: 0; }
    .doc-status  { display: inline-block; padding: 2px 10px; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; border: 1px solid currentColor; }
    .doc-status.anomaly { color: #8b0000; border-color: #8b0000; background: rgba(139,0,0,0.06); }
    .doc-status.stable  { color: #1a472a; border-color: #1a472a; background: rgba(26,71,42,0.06); }
    .doc-footer  { font-size: 10px; color: #aaa; margin-top: 16px; line-height: 1.6; }
    .stamp-rec {
      position: absolute; top: 12px; right: 16px;
      border: 3px solid rgba(139,0,0,0.65); color: rgba(139,0,0,0.7);
      padding: 5px 8px; font-size: 9px; font-weight: bold;
      letter-spacing: 0.1em; transform: rotate(-7deg);
      text-align: center; line-height: 1.5;
      font-family: 'Courier New', monospace;
    }
    .stamp-ver {
      position: absolute; bottom: 16px; right: 18px;
      border: 3px solid rgba(0,59,142,0.55); color: rgba(0,59,142,0.6);
      padding: 4px 7px; font-size: 8px; font-weight: bold;
      letter-spacing: 0.08em; transform: rotate(4deg);
      text-align: center; line-height: 1.5;
      font-family: 'Courier New', monospace;
    }
  </style>

  <div class="house-bar">
    <span class="house-crest">${house.crest}</span>
    <div class="house-info">
      <span class="house-name">${house.label}</span>
      <span class="house-role">${house.title} &mdash; Szkoła Magii Salem</span>
    </div>
  </div>

  <div class="doc-body">
    <div class="stamp-rec">RECOVERED<br>FILE</div>
    <div class="stamp-ver">BACKROOMS<br>INSTITUTE<br>VERIFIED</div>

    <div class="doc-title">
      AKTA REKRUTA
      <small>NODE-0 // SYSTEM NADZORCA v.2026.0</small>
    </div>

    <div class="doc-row"><span class="doc-key">ID systemu</span><span class="doc-val">${userID}</span></div>
    <div class="doc-row"><span class="doc-key">Imię</span><span class="doc-val">${name}</span></div>
    <div class="doc-row"><span class="doc-key">Nazwisko</span><span class="doc-val">${surname}</span></div>
    <div class="doc-row"><span class="doc-key">Wiek</span><span class="doc-val">${age}</span></div>
    <div class="doc-row"><span class="doc-key">Dom</span><span class="doc-val">${house.label}</span></div>
    <div class="doc-row"><span class="doc-key">Tytuł</span><span class="doc-val">${house.title}</span></div>
    <div class="doc-row"><span class="doc-key">Data rejestracji</span><span class="doc-val">${date}</span></div>

    <div class="doc-hr"></div>

    <div class="doc-row">
      <span class="doc-key">Status</span>
      <span class="doc-val"><span class="doc-status ${statusCls}">${status}</span></span>
    </div>
    <div class="doc-row"><span class="doc-key">Uwaga</span><span class="doc-val" style="font-weight:normal;font-size:11px;">${statusNote}</span></div>

    <div class="doc-hr"></div>

    <div class="doc-label">Motto domu</div>
    <p class="doc-motto">&ldquo;${house.motto}&rdquo;</p>

    <div class="doc-label">Notatka systemowa</div>
    <div class="doc-fact">${fact}</div>

    <div class="doc-hr"></div>

    <div class="doc-label">Cytat Nadzorcy</div>
    <p class="doc-quote">&ldquo;${quote}&rdquo;</p>

    <div class="doc-hr"></div>

    <div class="doc-row"><span class="doc-key">Rekomendacja</span><span class="doc-val">CONTINUOUS OBSERVATION</span></div>

    <p class="doc-footer">
      Dokument wygenerowany automatycznie przez system NADZORCA v.2026.0.<br>
      Wszelkie próby edycji zostaną odnotowane i przekazane do weryfikacji.
    </p>
  </div>`;
}
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
