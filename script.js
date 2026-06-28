// =========================
// 🔊 AUDIO SYSTEM
// =========================

const AudioSystem = {
  hum: document.getElementById("hum"),
  activity: document.getElementById("activity"),
  glitch: document.getElementById("glitch"),

  state: "boot",

  init() {
    this.hum.volume = 0.05;
    this.hum.loop = true;

    this.activity.volume = 0.1;
    this.glitch.volume = 0.15;

    this.hum.play().catch(()=>{});

    this.ambientLoop();
  },

  playActivity() {
    this.activity.currentTime = 0;
    this.activity.play().catch(()=>{});
  },

  playGlitch() {
    this.glitch.currentTime = 0;
    this.glitch.play().catch(()=>{});

    document.body.classList.add("glitch");

    setTimeout(() => {
      document.body.classList.remove("glitch");
    }, 300);
  },

  setState(state) {
    this.state = state;

    if(state === "terminal") this.hum.volume = 0.06;
    if(state === "form") this.hum.volume = 0.08;
    if(state === "files") this.hum.volume = 0.12;
  },

  ambientLoop() {
    setInterval(() => {
      const r = Math.random();

      if (this.state !== "boot" && r > 0.75) {
        this.playActivity();
      }

      if (r > 0.95) {
        this.playGlitch();
      }

    }, 6000);
  }
};

// =========================
// ⚡ BOOT SEQUENCE
// =========================

const bootLines = [
"[ SYSTEM INSTYTUTU ]",
"łączenie z BACKROOMS...",
"analiza struktury...",
"ładowanie NADZORCY...",
"stabilizacja interfejsu...",
"WEJŚCIE ZAAKCEPTOWANE"
];

let i = 0;

function boot() {
  const el = document.getElementById("boot-text");

  const interval = setInterval(() => {

    if (i < bootLines.length) {
      el.innerHTML += bootLines[i] + "<br>";

      if (i === 3) AudioSystem.playGlitch();

      i++;
    } else {
      clearInterval(interval);

      document.getElementById("boot-screen").style.display = "none";
      document.getElementById("terminal").classList.remove("hidden");

      AudioSystem.setState("terminal");
      AudioSystem.init();

      nadzorcaIntro();
    }

  }, 900);
}

// =========================
// 🤖 NADZORCA
// =========================

function nadzorcaIntro() {
  const n = document.getElementById("nadzorca");

  typeText(n,
`[ NADZORCA ]
System aktywny.
Witaj w instytucie obserwacyjnym.

Rozpocznij rejestrację.`);
}

// =========================
// ✍️ TYPEWRITER
// =========================

function typeText(el, text) {
  let i = 0;
  el.innerHTML = "";

  const interval = setInterval(() => {
    el.innerHTML += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 20);
}

// =========================
// 🧾 FLOW
// =========================

function startForm() {
  AudioSystem.setState("form");

  document.getElementById("terminal").classList.add("hidden");
  document.getElementById("form").classList.remove("hidden");
}

function submitForm() {
  AudioSystem.setState("files");

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const observe = document.getElementById("observe").value;

  document.getElementById("form").classList.add("hidden");
  document.getElementById("files").classList.remove("hidden");

  AudioSystem.playActivity();

  generateFile(name, age, observe);
}

// =========================
// 📄 AKTA
// =========================

function generateFile(name, age, observe) {
  const el = document.getElementById("file-content");

  const status = observe === "TAK"
    ? "STABILNY"
    : "NIEJEDNOZNACZNY";

  el.innerHTML = `
ID: INST-${Math.floor(Math.random()*99999)}<br>
IMIĘ: ${name}<br>
WIEK: ${age}<br>
STATUS: ${status}<br><br>

[ NADZORCA ]<br>
Rekrutacja zakończona.<br>
System kontynuuje obserwację.
`;

  AudioSystem.playGlitch();
}

// =========================
// 🚀 START + AUDIO UNLOCK
// =========================

// autoplay fix
document.body.addEventListener("click", () => {
  AudioSystem.init();
}, { once: true });

window.onload = boot;
