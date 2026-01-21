// 🔗 URL SheetDB
const API_URL = "https://sheetdb.io/api/v1/rfvit8a5ilisb";

// 🔐 Fonction de connexion
function login() {
  const email = document.getElementById("email").value.trim();
  const roleInput = document.getElementById("role").value.trim().toLowerCase();

  if (!email || !roleInput) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  fetch(API_URL + "/search?email=" + email)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        alert("Utilisateur non trouvé");
        return;
      }

      const user = data[0];

      // Acceptation avec ou sans espace
      const userRole = (
        user["rôle"] ||
        user["rôle "] ||
        user["role"] ||
        user["role "] ||
        ""
      ).toLowerCase();

      if (userRole !== roleInput) {
        alert("Rôle incorrect");
        return;
      }

      // Session
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", userRole);

    // Affichage dashboard
document.getElementById("login").style.display = "none";
document.getElementById("dashboard").style.display = "block";

document.getElementById("welcome").innerText =
  "Bienvenue " + user.nom + " (" + userRole + ")";

const menu = document.getElementById("menu");
menu.innerHTML = "";

// Menus selon rôle
if (userRole === "admin") {
  menu.innerHTML += `<button onclick="alert('Utilisateurs')">👤 Utilisateurs</button><br><br>`;
  menu.innerHTML += `<button onclick="alert('Colis')">📦 Colis</button><br><br>`;
  menu.innerHTML += `<button onclick="alert('Transferts')">💸 Transferts</button><br><br>`;
  menu.innerHTML += `<button onclick="alert('Revenus')">📊 Revenus</button>`;
}

if (userRole === "agent") {
  menu.innerHTML += `<button onclick="alert('Colis')">📦 Colis</button><br><br>`;
  menu.innerHTML += `<button onclick="alert('Transferts')">💸 Transferts</button>`;
}

if (userRole === "client") {
  menu.innerHTML += `<button onclick="alert('Mes colis')">📦 Mes colis</button><br><br>`;
  menu.innerHTML += `<button onclick="alert('Mes transferts')">💸 Mes transferts</button>`;
}
    })
    .catch(error => {
      alert("Erreur de connexion : " + error.message);
    });
}

// 🔓 Déconnexion
function logout() {
  localStorage.clear();
  location.reload();
}