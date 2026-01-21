// ====== COLIS ======
function gestionColis() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>📦 Gestion des Colis</h2>
      <button onclick="showAddColis()">➕ Ajouter un colis</button>
      <br><br>
      <input id="searchColis" placeholder="Rechercher par id ou client" onkeyup="searchColis()">
      <div id="listColis"></div>
    </div>
  `;
  loadColis();
}

function loadColis() {
  fetch(API_URL + "?sheet=Colis")
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("colisData", JSON.stringify(data));
      renderColis(data);
    });
}

function renderColis(data) {
  const list = document.getElementById("listColis");
  list.innerHTML = "";

  data.forEach(c => {
    list.innerHTML += `
      <div class="item">
        <b>ID:</b> ${c.id} <br>
        <b>Client:</b> ${c.client} <br>
        <b>Adresse:</b> ${c.adresse} <br>
        <b>Statut:</b> ${c.statut} <br>
        <b>Date:</b> ${c.date} <br>
        <b>Poids:</b> ${c.poids} <br>
        <b>Montant:</b> ${c.montant} <br>
        <button onclick="editColis(${c.id})">✏️ Modifier</button>
        <button onclick="deleteColis(${c.id})">🗑️ Supprimer</button>
      </div>
    `;
  });
}

function searchColis() {
  const q = document.getElementById("searchColis").value.toLowerCase();
  const data = JSON.parse(localStorage.getItem("colisData") || "[]");

  const filtered = data.filter(c =>
    c.id.toString().includes(q) ||
    c.client.toLowerCase().includes(q)
  );

  renderColis(filtered);
}

function showAddColis() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>➕ Ajouter un colis</h2>
      <input id="cClient" placeholder="Client">
      <input id="cAdresse" placeholder="Adresse">
      <input id="cStatut" placeholder="Statut">
      <input id="cDate" placeholder="Date">
      <input id="cPoids" placeholder="Poids">
      <input id="cMontant" placeholder="Montant">
      <button onclick="addColis()">Ajouter</button>
    </div>
  `;
}

function addColis() {
  const client = document.getElementById("cClient").value;
  const adresse = document.getElementById("cAdresse").value;
  const statut = document.getElementById("cStatut").value;
  const date = document.getElementById("cDate").value;
  const poids = document.getElementById("cPoids").value;
  const montant = document.getElementById("cMontant").value;

  fetch(API_URL + "?sheet=Colis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { client, adresse, statut, date, poids, montant } })
  })
  .then(res => res.json())
  .then(() => {
    alert("Colis ajouté avec succès !");
    gestionColis();
  });
}

function editColis(id) {
  const data = JSON.parse(localStorage.getItem("colisData") || "[]");
  const colis = data.find(c => c.id == id);

  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>✏️ Modifier colis #${id}</h2>
      <input id="eClient" value="${colis.client}">
      <input id="eAdresse" value="${colis.adresse}">
      <input id="eStatut" value="${colis.statut}">
      <input id="eDate" value="${colis.date}">
      <input id="ePoids" value="${colis.poids}">
      <input id="eMontant" value="${colis.montant}">
      <button onclick="updateColis(${id})">Enregistrer</button>
    </div>
  `;
}

function updateColis(id) {
  const client = document.getElementById("eClient").value;
  const adresse = document.getElementById("eAdresse").value;
  const statut = document.getElementById("eStatut").value;
  const date = document.getElementById("eDate").value;
  const poids = document.getElementById("ePoids").value;
  const montant = document.getElementById("eMontant").value;

  fetch(API_URL + "?sheet=Colis&id=" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { client, adresse, statut, date, poids, montant } })
  })
  .then(res => res.json())
  .then(() => {
    alert("Colis modifié !");
    gestionColis();
  });
}

function deleteColis(id) {
  fetch(API_URL + "?sheet=Colis&id=" + id, { method: "DELETE" })
    .then(() => {
      alert("Colis supprimé !");
      gestionColis();
    });
}