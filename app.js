// 🔗 URL SheetDB
const API_URL = "https://sheetdb.io/api/v1/rfvit8a5ilisb";

// 🔐 Connexion
function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();

  if (!email) {
    alert("Veuillez entrer votre email");
    return;
  }

  fetch(`${API_URL}/search?email=${email}`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert("Utilisateur non trouvé");
        return;
      }

      const user = data[0];
      const role = user.role.toLowerCase();

      // 💾 Session
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", role);
      localStorage.setItem("nom", user.nom);

      // 🎯 Interface
      document.getElementById("login").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      document.getElementById("welcome").innerText =
        `Bienvenue ${user.nom} (${role})`;

      loadMenu(role);
    })
    .catch(err => {
      console.error(err);
      alert("Erreur de connexion");
    });
}

// 📂 Menu selon rôle
function loadMenu(role) {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  if (role === "admin") {
    menu.innerHTML = `
      <p>📊 Tableau de bord Admin</p>
      <p>👥 Gestion des utilisateurs</p>
      <p>💰 Revenus</p>
    `;
  }

  if (role === "agent") {
    menu.innerHTML = `
      <p>📦 Enregistrer un colis</p>
      <p>💸 Effectuer un transfert</p>
    `;
  }

  if (role === "client") {
    menu.innerHTML = `
      <p>📦 Suivre mon colis</p>
      <p>💸 Mes transferts</p>
    `;
  }
}

// 🔓 Déconnexion
function logout() {
  localStorage.clear();
  location.reload();
} 