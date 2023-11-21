// Déclaration de la fonction pour afficher dynamiquement les travaux
function displayGalleryItems(data) {
  const galleryDiv = document.getElementById("gallery");

  // Vérifie si l'élément "gallery" existe sur la page
  if (galleryDiv) {
    galleryDiv.innerHTML = "";

    data.forEach(item => {
      const figureElement = document.createElement("figure");
      const imgElement = document.createElement("img");
      imgElement.src = item.imageUrl;
      imgElement.alt = item.title;

      const figcaptionElement = document.createElement("figcaption");
      figcaptionElement.textContent = item.title;

      figureElement.appendChild(imgElement);
      figureElement.appendChild(figcaptionElement);

      galleryDiv.appendChild(figureElement);
    });
  }
}

// Déclaration de la fonction pour filtrer les travaux par catégorie
function filterByCategory(categoryId) {
  // Récupère tous les travaux depuis la variable globale
  const allWorks = window.allWorks || [];

  // Filtrer les travaux en fonction de la catégorie
  const filteredWorks = (categoryId === 'all') ?
    allWorks :
    allWorks.filter(work => work.categoryId === categoryId);

  // Appel de la fonction pour afficher dynamiquement les travaux filtrés dans la galerie
  displayGalleryItems(filteredWorks);
}

// Déclaration de la fonction asynchrone pour récupérer les données de l'API
async function fetchData() {
  const apiUrl = "http://localhost:5678/api/works";
  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();
      console.log("La requête vers l'API a réussi. Statut :", response.status);
      console.log("Données récupérées de l'API :", data);

      // Appel de la fonction pour afficher dynamiquement les travaux
      displayGalleryItems(data);

      // Stocke les données pour les utiliser lors du filtrage
      window.allWorks = data;

      // Mise à jour de l'affichage du bouton Login/Logout
      updateLoginLogoutButton();
    } else {
      console.error("Erreur lors de la récupération des données de l'API. Statut :", response.status);
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la requête :", error);
  }
}

function updateLoginLogoutButton() {
  const token = localStorage.getItem('token');
  const loginLink = document.querySelector("nav li a[href='login/login.html']");
  const logoutButton = document.getElementById("logoutButton");

  if (token) {
    // Utilisateur connecté
    // Remplace le lien "Login" par le bouton "Logout"
    if (loginLink && logoutButton) {
      loginLink.replaceWith(logoutButton);
    }
  } else {
    // Utilisateur non connecté
    // Remplace le bouton "Logout" par le lien "Login"
    if (logoutButton && loginLink) {
      logoutButton.replaceWith(loginLink);
    }
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM Content Loaded. Calling fetchData...");

  // Vérifie si la page actuelle est index.html
  const isIndexPage = window.location.pathname.includes("index.html");

  if (isIndexPage) {
    // Vérifie si l'élément "gallery" existe sur la page
    const galleryDiv = document.getElementById("gallery");
    if (galleryDiv) {
      // Vérifie si un token est présent dans le stockage local
      const token = localStorage.getItem('token');

      if (token) {
        // Utilisateur connecté
        fetchData();

        // Ajoutez dynamiquement un bouton de déconnexion
        const logoutButton = document.createElement("button");
        logoutButton.id = "logoutButton";
        logoutButton.textContent = "Logout";
        logoutButton.addEventListener("click", function () {
          // Déconnectez l'utilisateur en supprimant le token
          localStorage.removeItem('token');
          // Redirigez l'utilisateur vers la page de connexion
          window.location.href = "/login/login.html";
        });

        // Ajoutez le bouton à un élément existant sur la page (par exemple, le header)
        const header = document.querySelector("header");
        if (header) {
          header.appendChild(logoutButton);
        }
      } else {
        // Utilisateur non connecté
        // Vous pouvez également masquer ou désactiver des éléments réservés aux utilisateurs authentifiés
        console.log("L'utilisateur n'est pas connecté.");

        // Appel de la fonction pour afficher dynamiquement les travaux même pour les utilisateurs non connectés
        fetchData();
      }
    }
  }

  // Ajout des gestionnaires d'événements pour le filtrage par catégorie
  const allButton = document.getElementById("allButton");
  const objectsButton = document.getElementById("objectsButton");
  const apartmentsButton = document.getElementById("apartmentsButton");
  const hotelsButton = document.getElementById("hotelsButton");

  if (allButton) {
    allButton.addEventListener("click", function () {
      filterByCategory('all');
    });
  }

  if (objectsButton) {
    objectsButton.addEventListener("click", function () {
      filterByCategory(1);
    });
  }

  if (apartmentsButton) {
    apartmentsButton.addEventListener("click", function () {
      filterByCategory(2);
    });
  }

  if (hotelsButton) {
    hotelsButton.addEventListener("click", function () {
      filterByCategory(3);
    });
  }
});
