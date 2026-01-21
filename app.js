// 🔗 URL SheetDB
const API_URL = "https://sheetdb.io/api/v1/rfvit8a5ilisb";

// ====== AUTO LOGIN ======
window.onload = function() {
  if (localStorage.getItem("email")) {
    showDashboard();
  }
};

// ====== LOGIN ======
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  fetch(API_URL + "/search?email=" + email)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) return alert("Utilisateur non trouvé");

      const user = data[0];

      if (user.mot_de_passe !== password) {
        return alert("Mot de passe incorrect");
      }

      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.nom);

      showDashboard();
    })
    .catch(err => {
      console.error(err);
      alert("Erreur de connexion");
    });
}

function logout() {
  localStorage.clear();
  location.reload();
}

// ====== DASHBOARD ======
function showDashboard() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  document.getElementById("login").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("welcome").innerText = `Bienvenue ${name} (${role})`;

  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  // ACCORDION
  const accordion = document.createElement("div");
  accordion.className = "accordion";
  menu.appendChild(accordion);

  // ADMIN
  if (role === "admin") {
    accordion.appendChild(createAccordionItem("Admin", [
      { name: "Colis", func: gestionColis },
      { name: "Utilisateurs", func: gestionUsers },
      { name: "Transferts", func: gestionTransferts },
      { name: "Revenus", func: gestionRevenus },
      { name: "Profil", func: profilPage }
    ]));
  }

  // AGENT
  if (role === "agent") {
    accordion.appendChild(createAccordionItem("Agent", [
      { name: "Colis", func: gestionColis },
      { name: "Transferts", func: gestionTransferts },
      { name: "Profil", func: profilPage }
    ]));
  }

  // CLIENT
  if (role === "client") {
    accordion.appendChild(createAccordionItem("Client", [
      { name: "Suivi colis", func: suiviColis },
      { name: "Profil", func: profilPage }
    ]));
  }
}

function addMenu(name, func) {
  const btn = document.createElement("button");
  btn.innerText = name;
  btn.onclick = () => {
    document.querySelectorAll("#menu button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    func();
  };
  document.getElementById("menu").appendChild(btn);
}

function createAccordionItem(title, items) {
  const item = document.createElement("div");
  item.className = "accordion-item";

  const header = document.createElement("div");
  header.className = "accordion-header";
  header.innerText = title;
  item.appendChild(header);

  const body = document.createElement("div");
  body.className = "accordion-body";
  item.appendChild(body);

  header.onclick = () => {
    body.style.display = body.style.display === "block" ? "none" : "block";
  };

  items.forEach(i => {
    const btn = document.createElement("button");
    btn.className = "accordion-btn";
    btn.innerText = i.name;
    btn.onclick = () => {
      body.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      i.func();
    };
    body.appendChild(btn);
  });

  return item;
}

/* ====== COLIS ====== */
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
  fetch(API_URL + "/colis")
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

  fetch(API_URL + "/colis", {
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

  fetch(API_URL + "/colis/" + id, {
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
  fetch(API_URL + "/colis/" + id, { method: "DELETE" })
    .then(() => {
      alert("Colis supprimé !");
      gestionColis();
    });
}

/* ====== UTILISATEURS ====== */
function gestionUsers() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>👥 Gestion des utilisateurs</h2>
      <button onclick="showAddUser()">➕ Ajouter un utilisateur</button>
      <br><br>
      <input id="searchUser" placeholder="Rechercher par email ou nom" onkeyup="searchUser()">
      <div id="listUsers"></div>
    </div>
  `;
  loadUsers();
}

function loadUsers() {
  fetch(API_URL + "/users")
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("usersData", JSON.stringify(data));
      renderUsers(data);
    });
}

function renderUsers(data) {
  const list = document.getElementById("listUsers");
  list.innerHTML = "";

  data.forEach(u => {
    list.innerHTML += `
      <div class="item">
        <b>ID:</b> ${u.id_user} <br>
        <b>Nom:</b> ${u.nom} <br>
        <b>Email:</b> ${u.email} <br>
        <b>Role:</b> ${u.role} <br>
        <b>Téléphone:</b> ${u.telephone} <br>
        <b>Date inscription:</b> ${u.date_inscription} <br>
        <button onclick="editUser('${u.id_user}')">✏️ Modifier</button>
        <button onclick="deleteUser('${u.id_user}')">🗑️ Supprimer</button>
      </div>
    `;
  });
}

function searchUser() {
  const q = document.getElementById("searchUser").value.toLowerCase();
  const data = JSON.parse(localStorage.getItem("usersData") || "[]");

  const filtered = data.filter(u =>
    u.email.toLowerCase().includes(q) ||
    u.nom.toLowerCase().includes(q)
  );

  renderUsers(filtered);
}

function showAddUser() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>➕ Ajouter un utilisateur</h2>
      <input id="uNom" placeholder="Nom">
      <input id="uEmail" placeholder="Email">
      <input id="uRole" placeholder="Role (admin / agent / client)">
      <input id="uTel" placeholder="Téléphone">
      <input id="uPass" placeholder="Mot de passe">
      <button onclick="addUser()">Ajouter</button>
    </div>
  `;
}

function addUser() {
  const nom = document.getElementById("uNom").value;
  const email = document.getElementById("uEmail").value;
  const role = document.getElementById("uRole").value;
  const telephone = document.getElementById("uTel").value;
  const mot_de_passe = document.getElementById("uPass").value;

  fetch(API_URL + "/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { nom, email, role, telephone, mot_de_passe } })
  })
  .then(res => res.json())
  .then(() => {
    alert("Utilisateur ajouté !");
    gestionUsers();
  });
}

function editUser(id_user) {
  const data = JSON.parse(localStorage.getItem("usersData") || "[]");
  const user = data.find(u => u.id_user == id_user);

  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>✏️ Modifier utilisateur #${id_user}</h2>
      <input id="eNom" value="${user.nom}">
      <input id="eEmail" value="${user.email}">
      <input id="eRole" value="${user.role}">
      <input id="eTel" value="${user.telephone}">
      <input id="ePass" value="${user.mot_de_passe}">
      <button onclick="updateUser('${id_user}')">Enregistrer</button>
    </div>
  `;
}

function updateUser(id_user) {
  const nom = document.getElementById("eNom").value;
  const email = document.getElementById("eEmail").value;
  const role = document.getElementById("eRole").value;
  const telephone = document.getElementById("eTel").value;
  const mot_de_passe = document.getElementById("ePass").value;

  fetch(API_URL + "/users/" + id_user, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { nom, email, role, telephone, mot_de_passe } })
  })
  .then(res => res.json())
  .then(() => {
    alert("Utilisateur modifié !");
    gestionUsers();
  });
}

function deleteUser(id_user) {
  fetch(API_URL + "/users/" + id_user, { method: "DELETE" })
    .then(() => {
      alert("Utilisateur supprimé !");
      gestionUsers();
    });
}

/* ====== TRANSFERTS ====== */
function gestionTransferts() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>💸 Gestion des transferts</h2>
      <button onclick="showAddTransfert()">➕ Ajouter un transfert</button>
      <br><br>
      <input id="searchTransfert" placeholder="Rechercher par id ou client" onkeyup="searchTransfert()">
      <div id="listTransferts"></div>
    </div>
  `;
  loadTransferts();
}

function loadTransferts() {
  fetch(API_URL + "/transferts")
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("transfertsData", JSON.stringify(data));
      renderTransferts(data);
    });
}

function renderTransferts(data) {
  const list = document.getElementById("listTransferts");
  list.innerHTML = "";

  data.forEach(t => {
    list.innerHTML += `
      <div class="item">
        <b>ID:</b> ${t.id_transfert} <br>
        <b>Client:</b> ${t.client} <br>
        <b>Montant:</b> ${t.montant} <br>
        <b>Date:</b> ${t.date} <br>
        <b>Status:</b> ${t.status} <br>
        <button onclick="editTransfert('${t.id_transfert}')">✏️ Modifier</button>
        <button onclick="deleteTransfert('${t.id_transfert}')">🗑️ Supprimer</button>
      </div>
    `;
  });
}

function searchTransfert() {
  const q = document.getElementById("searchTransfert").value.toLowerCase();
  const data = JSON.parse(localStorage.getItem("transfertsData") || "[]");

  const filtered = data.filter(t =>
    t.id_transfert.toString().includes(q) ||
    t.client.toLowerCase().includes(q)
  );

  renderTransferts(filtered);
}

function showAddTransfert() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>➕ Ajouter un transfert</h2>
      <input id="tClient" placeholder="Client">
      <input id="tMontant" placeholder="Montant">
      <input id="tDate" placeholder="Date">
      <input id="tStatus" placeholder="Status">
      <button onclick="addTransfert()">Ajouter</button>
    </div>
  `;
}

function addTransfert() {
  const client = document.getElementById("tClient").value;
  const montant = document.getElementById("tMontant").value;
  const date = document.getElementById("tDate").value;
  const status = document.getElementById("tStatus").value;

  fetch(API_URL + "/transferts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { client, montant, date, status } })
  })
  .then(res => res.json())
  .then(() => {
    alert("Transfert ajouté avec succès !");
    gestionTransferts();
  });
}

function editTransfert(id_transfert) {
  const data = JSON.parse(localStorage.getItem("transfertsData") || "[]");
  const t = data.find(t => t.id_transfert == id_transfert);

  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>✏️ Modifier transfert #${id_transfert}</h2>
      <input id="eClient" value="${t.client}">
      <input id="eMontant" value="${t.montant}">
      <input id="eDate" value="${t.date}">
      <input id="eStatus" value="${t.status}">
      <button onclick="updateTransfert('${id_transfert}')">Enregistrer</button>
    </div>
  `;
}

function updateTransfert(id_transfert) {
  const client = document.getElementById("eClient").value;
  const montant = document.getElementById("eMontant").value;
  const date = document.getElementById("eDate").value;
  const status = document.getElementById("eStatus").value;

  fetch(API_URL + "/transferts/" + id_transfert, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { client, montant, date, status } })
  })
  .then(res => res.json())
  .then(() => {
    alert("Transfert modifié !");
    gestionTransferts();
  });
}

function deleteTransfert(id_transfert) {
  fetch(API_URL + "/transferts/" + id_transfert, { method: "DELETE" })
    .then(() => {
      alert("Transfert supprimé !");
      gestionTransferts();
    });
}

/* ====== REVENUS ====== */
function gestionRevenus() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>💰 Revenus</h2>
      <button onclick="showAddRevenu()">➕ Ajouter un revenu</button>
      <br><br>
      <input id="searchRevenu" placeholder="Rechercher par source ou reference" onkeyup="searchRevenu()">
      <div id="listRevenus"></div>
      <div id="totauxRevenus" class="totaux"></div>
    </div>
  `;
  loadRevenus();
}

function loadRevenus() {
  fetch(API_URL + "/revenus")
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("revenusData", JSON.stringify(data));
      renderRevenus(data);
      calculTotaux(data);
    });
}

function renderRevenus(data) {
  const list = document.getElementById("listRevenus");
  list.innerHTML = "";

  data.forEach(r => {
    list.innerHTML += `
      <div class="item">
        <b>ID:</b> ${r.id} <br>
        <b>Source:</b> ${r.source} <br>
        <b>Reference:</b> ${r.reference} <br>
        <b>Montant brut:</b> ${r.montant_brut} <br>
        <b>Commission agent:</b> ${r.commission_agent} <br>
        <b>Bénéfice net:</b> ${r.benefice_net} <br>
        <b>Date:</b> ${r.date_revenu} <br>
        <button onclick="editRevenu('${r.id}')">✏️ Modifier</button>
        <button onclick="deleteRevenu('${r.id}')">🗑️ Supprimer</button>
      </div>
    `;
  });
}

function calculTotaux(data) {
  let totalBrut = 0;
  let totalCommission = 0;
  let totalBenefice = 0;

  data.forEach(r => {
    totalBrut += parseFloat(r.montant_brut) || 0;
    totalCommission += parseFloat(r.commission_agent) || 0;
    totalBenefice += parseFloat(r.benefice_net) || 0;
  });

  document.getElementById("totauxRevenus").innerHTML = `
    <div class="item">
      <h3>📌 Totaux</h3>
      <b>Total Montant Brut:</b> ${totalBrut} <br>
      <b>Total Commission Agent:</b> ${totalCommission} <br>
      <b>Total Bénéfice Net:</b> ${totalBenefice} <br>
    </div>
  `;
}

function searchRevenu() {
  const q = document.getElementById("searchRevenu").value.toLowerCase();
  const data = JSON.parse(localStorage.getItem("revenusData") || "[]");

  const filtered = data.filter(r =>
    r.source.toLowerCase().includes(q) ||
    r.reference.toLowerCase().includes(q)
  );

  renderRevenus(filtered);
  calculTotaux(filtered);
}

function showAddRevenu() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>➕ Ajouter un revenu</h2>
      <input id="rSource" placeholder="Source">
      <input id="rReference" placeholder="Reference">
      <input id="rMontantBrut" placeholder="Montant brut">
      <input id="rCommission" placeholder="Commission agent">
      <input id="rBenefice" placeholder="Bénéfice net">
      <input id="rDate" placeholder="Date">
      <button onclick="addRevenu()">Ajouter</button>
    </div>
  `;
}

function addRevenu() {
  const source = document.getElementById("rSource").value;
  const reference = document.getElementById("rReference").value;
  const montant_brut = document.getElementById("rMontantBrut").value;
  const commission_agent = document.getElementById("rCommission").value;
  const benefice_net = document.getElementById("rBenefice").value;
  const date_revenu = document.getElementById("rDate").value;

  fetch(API_URL + "/revenus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { source, reference, montant_brut, commission_agent, benefice_net, date_revenu } })
  })
  .then(res => res.json())
  .then(() => {
    alert("Revenu ajouté !");
    gestionRevenus();
  });
}

function editRevenu(id) {
  const data = JSON.parse(localStorage.getItem("revenusData") || "[]");
  const r = data.find(r => r.id == id);

  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>✏️ Modifier revenu #${id}</h2>
      <input id="eSource" value="${r.source}">
      <input id="eReference" value="${r.reference}">
      <input id="eMontantBrut" value="${r.montant_brut}">
      <input id="eCommission" value="${r.commission_agent}">
      <input id="eBenefice" value="${r.benefice_net}">
      <input id="eDate" value="${r.date_revenu}">
      <button onclick="updateRevenu('${id}')">Enregistrer</button>
    </div>
  `;
}

function updateRevenu(id) {
  const source = document.getElementById("eSource").value;
  const reference = document.getElementById("eReference").value;
  const montant_brut = document.getElementById("eMontantBrut").value;
  const commission_agent = document.getElementById("eCommission").value;
  const benefice_net = document.getElementById("eBenefice").value;
  const date_revenu = document.getElementById("eDate").value;

  fetch(API_URL + "/revenus/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { source, reference, montant_brut, commission_agent, benefice_net, date_revenu } })
  })
  .then(res => res.json())
  .then(() => {
    alert("Revenu modifié !");
    gestionRevenus();
  });
}

function deleteRevenu(id) {
  fetch(API_URL + "/revenus/" + id, { method: "DELETE" })
    .then(() => {
      alert("Revenu supprimé !");
      gestionRevenus();
    });
}

/* ====== PROFIL ====== */
function profilPage() {
  const email = localStorage.getItem("email");

  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>🔒 Profil</h2>
      <p>Email : ${email}</p>
      <input id="oldPass" type="password" placeholder="Ancien mot de passe">
      <input id="newPass" type="password" placeholder="Nouveau mot de passe">
      <button onclick="changePassword()">Changer mot de passe</button>
    </div>
  `;
}

function changePassword() {
  const email = localStorage.getItem("email");
  const oldPass = document.getElementById("oldPass").value;
  const newPass = document.getElementById("newPass").value;

  if (!oldPass || !newPass) {
    return alert("Veuillez remplir tous les champs");
  }

  fetch(API_URL + "/search?email=" + email)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) return alert("Utilisateur non trouvé");

      const user = data[0];

      if (user.mot_de_passe !== oldPass) {
        return alert("Ancien mot de passe incorrect");
      }

      // update password
      fetch(API_URL + "/users/" + user.id_user, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { mot_de_passe: newPass } })
      })
      .then(res => res.json())
      .then(() => {
        alert("Mot de passe changé avec succès !");
        logout();
      });
    });
}

/* ====== SUIVI COLIS (CLIENT) ====== */
function suiviColis() {
  document.getElementById("content").innerHTML = `
    <div class="item">
      <h2>📦 Suivi colis</h2>
      <input id="trackId" placeholder="Entrer ID colis">
      <button onclick="trackColis()">Suivre</button>
      <div id="trackResult"></div>
    </div>
  `;
}

function trackColis() {
  const id = document.getElementById("trackId").value;

  fetch(API_URL + "/colis/" + id)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) return alert("Colis introuvable");
      const c = data[0];

      document.getElementById("trackResult").innerHTML = `
        <b>ID:</b> ${c.id} <br>
        <b>Client:</b> ${c.client} <br>
        <b>Statut:</b> ${c.statut} <br>
        <b>Date:</b> ${c.date} <br>
      `;
    });
}