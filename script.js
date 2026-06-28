let audioOn = false;
let status = "STABILNY";

/* AUDIO */
function toggleAudio(){
  audioOn = !audioOn;

  document.querySelector("#audioPanel button").innerText =
    audioOn ? "AUDIO: ON" : "AUDIO: OFF";

  if(audioOn){
    document.getElementById("hum").volume = 0.05;
    document.getElementById("hum").play();
  } else {
    document.getElementById("hum").pause();
  }
}

/* GLITCH */
function glitch(){
  const g = document.getElementById("glitchOverlay");
  g.style.opacity = 0.6;
  setTimeout(()=> g.style.opacity = 0, 120);
}

/* SCREEN ENGINE */
function next(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.getElementById("click").play();

  if(id === "intro"){
    updateNadzorca("Jednostka wykryta. Rozpoczynanie procedury.");
  }

  if(id === "form"){
    updateNadzorca("Rejestracja aktywna.");
  }

  if(id === "quiz"){
    updateNadzorca("Przetwarzanie odpowiedzi...");
  }

  glitch();
}

/* NADZORCA */
function updateNadzorca(text){
  document.getElementById("nadzorca").innerText = text;
}

/* INTRO TEXT */
window.onload = ()=>{
  updateNadzorca("SYSTEM BOOT");
  document.getElementById("introText").innerText =
  "Nie opuszczaj procedury. Dane zostaną zapisane w Instytucie.";
};

/* ANALIZA */
function analyze(){

  const score =
    (q1.value==="TAK"?1:0)+
    (q2.value==="TAK"?1:0)+
    (q3.value==="TAK"?1:0)+
    (q4.value==="TAK"?1:0);

  if(score>=3) status="ANOMALIA";
  else if(score===2) status="NIESTABILNY";
  else status="STABILNY";

  updateNadzorca("Analiza zakończona: " + status);

  document.getElementById("analysisText").innerText =
    "STATUS: " + status;

  setTimeout(()=>generateDoc(),1500);
  setTimeout(()=>next("document"),1800);
}

/* AKTA */
function generateDoc(){

  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const age = document.getElementById("age").value;
  const role = document.getElementById("role").value;

  const html = `
  <div class="stamp">RECOVERED FILE</div>

  <h2>AKTA REKRUTA // BACKROOMS INSTITUTE</h2>

  <p><b>IMIĘ:</b> ${name}</p>
  <p><b>NAZWISKO:</b> ${surname}</p>
  <p><b>WIEK:</b> ${age}</p>
  <p><b>DOM/FUNKCJA:</b> ${role}</p>

  <div class="stamp">STATUS: ${status}</div>

  <p>
  Jednostka zakwalifikowana do obserwacji.
  Nadzorca zaleca ciągły monitoring.
  </p>
  `;

  document.getElementById("paperDoc").innerHTML = html;

  window.fileData = `
BACKROOMS INSTITUTE FILE

IMIĘ: ${name}
NAZWISKO: ${surname}
WIEK: ${age}
FUNKCJA: ${role}
STATUS: ${status}

-- END OF FILE --
`;
}

/* DOWNLOAD */
function downloadDoc(){
  const blob = new Blob([window.fileData], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "AKTA_INSTYTUTU.txt";
  a.click();
}
