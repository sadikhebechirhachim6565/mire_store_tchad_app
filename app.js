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

      // Redirection simple
      document.body.innerHTML = `
        <h2>Bienvenue ${user.nom}</h2>
        <p>Rôle : ${userRole}</p>
        <button onclick="logout()">Déconnexion</button>
      `;
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