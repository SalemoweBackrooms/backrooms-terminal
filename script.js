let audioOn = false;

function toggleAudio(){
  audioOn = !audioOn;

  document.getElementById("audioToggle").innerText =
    audioOn ? "AUDIO: ON" : "AUDIO: OFF";

  if(audioOn){
    document.getElementById("hum").volume = 0.05;
    document.getElementById("hum").play();
  } else {
    document.getElementById("hum").pause();
  }
}

/* BOOT */
window.onload = function(){

  setTimeout(()=>{
    document.getElementById("boot").classList.add("hidden");
    document.getElementById("nadzorcaBox").classList.remove("hidden");

    document.getElementById("nadzorcaText").innerText =
      "System aktywny. Rekrut oczekuje na inicjację.";
  },2000);
};

/* FLOW */
function startForm(){
  document.getElementById("nadzorcaBox").classList.add("hidden");
  document.getElementById("form").classList.remove("hidden");
}

function toQuestionnaire(){
  document.getElementById("form").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
}

function analyze(){

  let score = 0;

  ["q1","q2","q3","q4"].forEach(id=>{
    if(document.getElementById(id).value === "TAK") score++;
  });

  let status =
    score >= 3 ? "ANOMALIA"
    : score === 2 ? "NIESTABILNY"
    : "STABILNY";

  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("analysis").classList.remove("hidden");

  document.getElementById("analysisText").innerText =
    "Status: " + status;

  setTimeout(()=>{
    generateFile(status);
  },2000);
}

/* AKTA HTML */
function generateFile(status){

  let name = document.getElementById("name").value;
  let surname = document.getElementById("surname").value;
  let age = document.getElementById("age").value;
  let role = document.getElementById("role").value;

  let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>AKTA INSTYTUTU</title>

<style>
body{
  background: repeating-linear-gradient(0deg,#1c1c1c,#1c1c1c 2px,#222 4px);
  font-family:Courier New;
  padding:40px;
}

.doc{
  background:#f3f0df;
  padding:30px;
  border:3px solid black;
  max-width:900px;
  margin:auto;
}

.warning{
  border-left:8px solid darkred;
  background:#fff1d6;
  padding:10px;
}

.top{
  background:black;
  color:white;
  padding:10px;
}
</style>
</head>

<body>

<div class="doc">

<div class="top">BACKROOMS INSTITUTE // ARCHIVE NODE</div>

<h2>AKTA REKRUTA</h2>

<div class="warning">
RECOVERED FILE // PARTIAL INTEGRITY
</div>

<p><b>IMIĘ:</b> ${name}</p>
<p><b>NAZWISKO:</b> ${surname}</p>
<p><b>WIEK:</b> ${age}</p>
<p><b>DOM/FUNKCJA:</b> ${role}</p>

<p><b>STATUS:</b> ${status}</p>

<div class="warning">
REKOMENDACJA: STAŁA OBSERWACJA
</div>

<p>SYSTEM: jednostka zakwalifikowana do monitoringu Instytutu.</p>

</div>

</body>
</html>
`;

  document.getElementById("files").classList.remove("hidden");
  document.getElementById("document").innerText = html;
  window.generatedFile = html;
}

/* DOWNLOAD */
function downloadFile(){
  let blob = new Blob([window.generatedFile], {type:"text/html"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "AKTA_INSTYTUTU.html";
  a.click();
}
