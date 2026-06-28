window.onload = function() {
  setTimeout(() => {
    document.getElementById("boot").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    document.getElementById("nadzorca").innerText =
      "SYSTEM AKTYWNY. CZEKAM NA REKRUTACJĘ.";
  }, 1500);
};

function startForm() {
  document.getElementById("form").classList.remove("hidden");
}

function submitForm() {
  let name = document.getElementById("name").value;
  let age = document.getElementById("age").value;

  document.getElementById("form").classList.add("hidden");

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("result").innerHTML =
    "REKRUT ZAREJESTROWANY<br><br>" +
    "IMIĘ: " + name + "<br>" +
    "WIEK: " + age + "<br><br>" +
    "STATUS: W TRAKCIE ANALIZY";
}
