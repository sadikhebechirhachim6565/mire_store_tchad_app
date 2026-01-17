function login() {
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    if (!email || !role) {
        alert("Veuillez entrer votre email et votre rôle.");
        return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);

    showHome();
}

function showHome() {
    document.body.innerHTML = `
        <h1>Bienvenue dans Mire Store Tchad</h1>
        <p>Vous êtes connecté en tant que : ${localStorage.getItem("userRole")}</p>

        <button onclick="goToColis()">Colis</button>
        <button onclick="goToTransferts()">Transferts</button>
        <button onclick="goToRevenus()">Revenus</button>
        <button onclick="logout()">Déconnexion</button>

        <div id="content"></div>
    `;
}

function logout() {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    location.reload();
}

function goToColis() {
    const role = localStorage.getItem("userRole");

    document.getElementById("content").innerHTML = `
        <h2>Colis</h2>

        <h3>Ajouter un colis</h3>
        <input id="numero_colis" placeholder="Numéro colis">
        <input id="client_nom" placeholder="Nom client">
        <input id="agent_nom" placeholder="Nom agent">
        <input id="montant" placeholder="Montant">
        <input id="pays_destination" placeholder="Pays destination">
        <input id="ville_destination" placeholder="Ville destination">
        <input id="date_envoi" placeholder="Date envoi">

        <button onclick="addColis()">Ajouter</button>

        <div id="listeColis"></div>
    `;

    if (role === "client") {
        document.getElementById("numero_colis").disabled = true;
        document.getElementById("client_nom").disabled = true;
        document.getElementById("agent_nom").disabled = true;
        document.getElementById("montant").disabled = true;
        document.getElementById("pays_destination").disabled = true;
        document.getElementById("ville_destination").disabled = true;
        document.getElementById("date_envoi").disabled = true;
        document.querySelector("button").disabled = true;
    }

    renderColis();
}

function addColis() {
    const colis = {
        id: Date.now(),
        numero_colis: document.getElementById("numero_colis").value,
        client_nom: document.getElementById("client_nom").value,
        agent_nom: document.getElementById("agent_nom").value,
        montant: document.getElementById("montant").value,
        pays_destination: document.getElementById("pays_destination").value,
        ville_destination: document.getElementById("ville_destination").value,
        date_envoi: document.getElementById("date_envoi").value,
        statut_colis: "en_cours"
    };

    let colisList = JSON.parse(localStorage.getItem("colisList")) || [];
    colisList.push(colis);
    localStorage.setItem("colisList", JSON.stringify(colisList));

    renderColis();
}

function renderColis() {
    const colisList = JSON.parse(localStorage.getItem("colisList")) || [];
    let html = "<h3>Liste des colis</h3>";

    colisList.forEach(c => {
        html += `
            <div style="border:1px solid #000; padding:10px; margin:10px 0;">
                <b>${c.numero_colis}</b><br>
                Client: ${c.client_nom}<br>
                Agent: ${c.agent_nom}<br>
                Montant: ${c.montant}<br>
                Pays: ${c.pays_destination}<br>
                Ville: ${c.ville_destination}<br>
                Date: ${c.date_envoi}<br>
                Statut: ${c.statut_colis}
            </div>
        `;
    });

    document.getElementById("listeColis").innerHTML = html;
}

function goToTransferts() {
    const role = localStorage.getItem("userRole");

    document.getElementById("content").innerHTML = `
        <h2>Transferts</h2>

        <h3>Ajouter un transfert</h3>
        <input id="reference_transfert" placeholder="Référence">
        <input id="client_nom_t" placeholder="Nom client">
        <input id="agent_nom_t" placeholder="Nom agent">
        <input id="montant_t" placeholder="Montant">
        <input id="frais_t" placeholder="Frais">
        <input id="pays_destination_t" placeholder="Pays destination">
        <input id="date_transfert" placeholder="Date transfert">

        <button onclick="addTransfert()">Ajouter</button>

        <div id="listeTransferts"></div>
    `;

    if (role === "client") {
        document.getElementById("reference_transfert").disabled = true;
        document.getElementById("client_nom_t").disabled = true;
        document.getElementById("agent_nom_t").disabled = true;
        document.getElementById("montant_t").disabled = true;
        document.getElementById("frais_t").disabled = true;
        document.getElementById("pays_destination_t").disabled = true;
        document.getElementById("date_transfert").disabled = true;
        document.querySelector("button").disabled = true;
    }

    renderTransferts();
}

function addTransfert() {
    const transfert = {
        id: Date.now(),
        reference_transfert: document.getElementById("reference_transfert").value,
        client_nom: document.getElementById("client_nom_t").value,
        agent_nom: document.getElementById("agent_nom_t").value,
        montant: document.getElementById("montant_t").value,
        frais: document.getElementById("frais_t").value,
        pays_destination: document.getElementById("pays_destination_t").value,
        date_transfert: document.getElementById("date_transfert").value,
        statut_transfert: "en_cours"
    };

    let transfertList = JSON.parse(localStorage.getItem("transfertList")) || [];
    transfertList.push(transfert);
    localStorage.setItem("transfertList", JSON.stringify(transfertList));

    renderTransferts();
}

function renderTransferts() {
    const transfertList = JSON.parse(localStorage.getItem("transfertList")) || [];
    let html = "<h3>Liste des transferts</h3>";

    transfertList.forEach(t => {
        html += `
            <div style="border:1px solid #000; padding:10px; margin:10px 0;">
                <b>${t.reference_transfert}</b><br>
                Client: ${t.client_nom}<br>
                Agent: ${t.agent_nom}<br>
                Montant: ${t.montant}<br>
                Frais: ${t.frais}<br>
                Pays: ${t.pays_destination}<br>
                Date: ${t.date_transfert}<br>
                Statut: ${t.statut_transfert}
            </div>
        `;
    });

    document.getElementById("listeTransferts").innerHTML = html;
}

function goToRevenus() {
    const role = localStorage.getItem("userRole");

    if (role !== "admin" && role !== "agent") {
        alert("Vous n'avez pas accès aux revenus.");
        return;
    }

    document.getElementById("content").innerHTML = `
        <h2>Revenus</h2>

        <h3>Ajouter un revenu</h3>
        <input id="source" placeholder="Source (colis / transfert)">
        <input id="reference" placeholder="Référence">
        <input id="montant_brut" placeholder="Montant brut">
        <input id="commission_agent" placeholder="Commission agent">
        <input id="date_revenu" placeholder="Date">

        <button onclick="addRevenu()">Ajouter</button>

        <div id="listeRevenus"></div>
    `;

    renderRevenus();
}

function addRevenu() {
    const revenu = {
        id: Date.now(),
        source: document.getElementById("source").value,
        reference: document.getElementById("reference").value,
        montant_brut: parseFloat(document.getElementById("montant_brut").value),
        commission_agent: parseFloat(document.getElementById("commission_agent").value),
        benefice_net: 0,
        date_revenu: document.getElementById("date_revenu").value
    };

    revenu.benefice_net = revenu.montant_brut - revenu.commission_agent;

    let revenuList = JSON.parse(localStorage.getItem("revenuList")) || [];
    revenuList.push(revenu);
    localStorage.setItem("revenuList", JSON.stringify(revenuList));

    renderRevenus();
}

function renderRevenus() {
    const revenuList = JSON.parse(localStorage.getItem("revenuList")) || [];
    let html = "<h3>Liste des revenus</h3>";

    revenuList.forEach(r => {
        html += `
            <div style="border:1px solid #000; padding:10px; margin:10px 0;">
                <b>${r.source}</b><br>
                Référence: ${r.reference}<br>
                Montant brut: ${r.montant_brut}<br>
                Commission: ${r.commission_agent}<br>
                Bénéfice net: ${r.benefice_net}<br>
                Date: ${r.date_revenu}
            </div>
        `;
    });

    document.getElementById("listeRevenus").innerHTML = html;
}
// ===== CONNEXION GOOGLE SHEETS =====

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjLL19OT5rk_YOVzv5U-Qko9liOc4QNQA3zn6HL9DIdQtqOfbGY5Up1may0OffD9i6Uw/exec";

function enregistrerColis() {
    const data = {
        numero_colis: document.getElementById("numero_colis").value,
        client: document.getElementById("client").value,
        agent: document.getElementById("agent").value,
        montant: document.getElementById("montant").value,
        pays_destination: document.getElementById("pays").value,
        ville_destination: document.getElementById("ville").value,
        date_envoi: document.getElementById("date").value,
        statut_colis: document.getElementById("statut").value
    };

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(() => {
        alert("Colis enregistré avec succès !");
    })
    .catch(() => {
        alert("Erreur d’enregistrement");
    });
}