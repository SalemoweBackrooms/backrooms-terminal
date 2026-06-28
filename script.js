let audioStarted = false;
let status = "UNKNOWN";
let userID = "";
let fileHTML = "";

/* AUDIO */
document.addEventListener("click", () => {
  if(audioStarted) return;

  document.getElementById("hum").volume = 0.05;
  document.getElementById("hum").play().catch(()=>{});

  audioStarted = true;
});

/* SAFE AUDIO */
function playSafe(id){
  const a = document.getElementById(id);
  if(!a) return;
  a.pause();
  a.currentTime = 0;
  a.play().catch(()=>{});
}

/* GLITCH */
function glitch(){
  document.body.classList.add("glitching");

  const g = document.getElementById("glitchOverlay");
  g.style.opacity = 0.4;

  setTimeout(()=>{
    g.style.opacity = 0;
    document.body.classList.remove("glitching");
  },140);
}

/* SCREEN SYSTEM */
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  playSafe("glitch");
  glitch();
}

function next(id){
  playSafe("activity");
  show(id);
}

/* NADZORCA */
let nadzorcaMessages = [
  "System obserwuje...",
  "Nie wykonuj zbędnych ruchów.",
  "Twoje tempo jest nieregularne.",
  "Obserwacja aktywna.",
  "Brak pełnej zgodności danych.",
  "…czy nadal jesteś przy terminalu?"
];

function randomNadzorcaTick(){
  let msg = nadzorcaMessages[Math.floor(Math.random()*nadzorcaMessages.length)];

  if(Math.random()>0.5){
    msg = msg.replace(/ /g," ... ").slice(0, msg.length*0.7);
  }

  document.getElementById("nadzorca").innerText =
    "NADZORCA: " + msg;

  setTimeout(randomNadzorcaTick, 8000 + Math.random()*5000);
}

window.onload = () => {
  document.getElementById("introText").innerText =
    "System monitoruje wejście...";

  randomNadzorcaTick();
};

/* ID */
function generateID(){
  return "BR-" + Math.floor(Math.random()*90) + "-" +
         Math.floor(1000+Math.random()*9000) + "-2026";
}

/* ANALIZA */
function analyze(){

  let score =
    (q1.value==="TAK"?1:0)+
    (q2.value==="TAK"?1:0)+
    (q3.value==="TAK"?1:0);

  status = score>=2 ? "ANOMALY" : "STABLE";
  userID = generateID();

  document.getElementById("analysisText").innerText =
    "STATUS: " + status;

  show("loading");
  loadingSequence();
}

/* LOADING */
function loadingSequence(){

  const texts = [
    "ANALYZING SUBJECT...",
    "SYNC NODE 0...",
    "ERROR DETECTED...",
    "REALITY DRIFT...",
    "COMPLETE..."
  ];

  let i = 0;
  let progress = 0;

  const interval = setInterval(()=>{

    document.getElementById("loadingText").innerText = texts[i];

    i++;
    progress += 25;

    document.getElementById("loadingFill").style.width = progress + "%";

    if(i >= texts.length){
      clearInterval(interval);
      setTimeout(intervention, 700);
    }

  },500);
}

/* INTERVENTION */
function intervention(){

  show("intervention");

  const msgs = [
    "Dokument wygenerowany.",
    "System obserwuje.",
    "Nie zaleca się interpretacji.",
    "Twoje dane są niestabilne.",
    "…to nie pierwszy przypadek."
  ];

  document.getElementById("nadzorcaMsg").innerText =
    "NADZORCA: " + msgs[Math.floor(Math.random()*msgs.length)];

  generateDocs();
}

/* AKTA — FIX (NAJWAŻNIEJSZE) */
function generateDocs(){

  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const age = document.getElementById("age").value;
  const role = document.getElementById("role").value;

  userID = userID || generateID();

  const quotes = [
    "Jednostka wykazuje adaptację do niestabilnych struktur rzeczywistości.",
    "Obserwacje wskazują na brak pełnej zgodności percepcyjnej.",
    "Podmiot reaguje spokojem na anomalie środowiskowe.",
    "Wykryto tendencję do akceptacji systemów nieznanego pochodzenia.",
    "Profil zgodny z ekspozycją na Level 0."
  ];

  const quote = quotes[Math.floor(Math.random()*quotes.length)];

  const paper = document.getElementById("paper");

  paper.innerHTML = `
    <div class="stamp">RECOVERED FILE</div>
    <div class="stamp2">BACKROOMS INSTITUTE VERIFIED</div>

    <h3>AKTA REKRUTA</h3>

    <p><b>ID:</b> ${userID}</p>
    <p><b>IMIĘ:</b> ${name}</p>
    <p><b>NAZWISKO:</b> ${surname}</p>
    <p><b>WIEK:</b> ${age}</p>
    <p><b>FUNKCJA:</b> ${role}</p>
    <p><b>STATUS:</b> ${status}</p>

    <hr>

    <p><b>CYTAT SYSTEMOWY:</b></p>
    <p><i>"${quote}"</i></p>

    <p><b>REKOMENDACJA:</b> CONTINUOUS OBSERVATION</p>
  `;

  fileHTML = paper.innerHTML;
}

/* DOWNLOAD */
function downloadFile(){
  if(!fileHTML){
    alert("FILE NOT READY");
    return;
  }

  const blob = new Blob([fileHTML], {type:"text/html"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "BACKROOMS_AKTA.html";
  a.click();
}
