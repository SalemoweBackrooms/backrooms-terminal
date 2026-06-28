const hum = document.getElementById("hum");
const activity = document.getElementById("activity");
const glitch = document.getElementById("glitch");

let data = {};

function boot() {
  const text = [
    "[SYSTEM INSTYTUTU]",
    "łączenie z warstwą BACKROOMS...",
    "analiza struktury...",
    "ładowanie NADZORCY...",
    "WEJŚCIE ZAAKCEPTOWANE"
  ];

  let i = 0;
  const el = document.getElementById("bootText");

  const interval = setInterval(() => {
    el.innerHTML += text[i] + "<br>";
    if(i === 2) playGlitch();
    i++;

    if(i >= text.length){
      clearInterval(interval);
      document.getElementById("boot").classList.add("hidden");
      document.getElementById("terminal").classList.remove("hidden");

      hum.volume = 0.05;
      hum.loop = true;
      hum.play();

      nadzorca();
    }
  }, 900);
}

function nadzorca() {
  document.getElementById("nadzorca").innerHTML =
  "[NADZORCA]<br>System aktywny. Rozpocznij rejestrację.";
}

function startForm() {
  document.getElementById("terminal").classList.add("hidden");
  document.getElementById("form").classList.remove("hidden");
  activity.play();
}

function submitForm() {
  data.name = document.getElementById("name").value;
  data.age = document.getElementById("age").value;
  data.q1 = document.getElementById("q1").value;
  data.q2 = document.getElementById("q2").value;
  data.q3 = document.getElementById("q3").value;
  data.q4 = document.getElementById("q4").value;

  document.getElementById("form").classList.add("hidden");
  document.getElementById("files").classList.remove("hidden");

  generateFile();
}

function generateFile() {
  let score = [data.q1,data.q2,data.q3,data.q4].filter(x=>x==="TAK").length;

  let status =
    score >= 3 ? "ANOMALIA"
    : score === 2 ? "NIESTABILNY"
    : "STABILNY";

  document.getElementById("file").innerHTML =
`
ID: INST-${Math.floor(Math.random()*99999)}<br>
IMIĘ: ${data.name}<br>
WIEK: ${data.age}<br>
STATUS: ${status}<br><br>

[ANALIZA NADZORCY]<br>
Poziom zgodności: ${score}/4<br>
Status psychiczny: ${status}<br><br>

Podmiot objęty stałą obserwacją Instytutu.
`;

  playGlitch();
}

function downloadFile() {
  const content = document.getElementById("file").innerText;
  const blob = new Blob([content], {type:"text/plain"});
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "AKTA_INSTYTUTU.txt";
  a.click();
}

function playGlitch(){
  glitch.currentTime = 0;
  glitch.play();
  document.body.classList.add("glitch");
  setTimeout(()=>document.body.classList.remove("glitch"),300);
}

document.body.addEventListener("click", ()=>{
  hum.play();
}, {once:true});

window.onload = boot;
