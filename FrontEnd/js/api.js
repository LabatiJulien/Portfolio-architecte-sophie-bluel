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

function toggleEditModeBanner(isEditMode) {
  const header = document.querySelector("header");

  // Vérifie si l'élément du header existe
  if (header) {
    // Vérifie si le mode édition est activé
    if (isEditMode) {
      // Crée la bande noire avec le texte "Mode édition"
      const editModeBanner = document.createElement("div");
      editModeBanner.className = "edit-mode-banner";

      // Crée l'icône Font Awesome
      const iconElement = document.createElement("i");
      iconElement.classList.add("fa-regular", "fa-pen-to-square", "fa-xs");

      // Ajoute l'icône à la bannière
      editModeBanner.appendChild(iconElement);

      // Crée l'élément pour le texte "Mode édition"
      const textElement = document.createElement("span");
      textElement.textContent = " Mode édition";

      // Ajoute le texte à la bannière
      editModeBanner.appendChild(textElement);

      // Ajoute la bande noire au-dessus du header
      header.parentNode.insertBefore(editModeBanner, header);

      // Ajoute une classe au header pour ajuster la position
      header.classList.add("header-with-banner");
    } else {
      // Supprime la bande noire et la classe du header
      const editModeBanner = document.querySelector(".edit-mode-banner");
      if (editModeBanner) {
        editModeBanner.remove();
      }

      header.classList.remove("header-with-banner");
    }
  }
}

// Déclaration de la fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
  const token = localStorage.getItem('token');
  return !!token; 
}

function updateLoginLogoutButton() {
  const token = localStorage.getItem('token');
  const loginLink = document.querySelector("nav li a[href='login/login.html']");
  const logoutButton = document.getElementById("logoutButton");
  const filtersContainer = document.getElementById("categoryButtons"); 

  if (token) {
    // Utilisateur connecté
    // Remplace le lien "Login" par le bouton "Logout"
    if (loginLink && logoutButton) {
      loginLink.replaceWith(logoutButton);
    }

    // Ajoute la classe pour masquer les filtres
    if (filtersContainer) {
      filtersContainer.classList.add("hidden");
    }
    toggleEditModeBanner(true);
  } else {
    // Utilisateur non connecté
    // Remplace le bouton "Logout" par le lien "Login"
    if (logoutButton && loginLink) {
      logoutButton.replaceWith(loginLink);
    }

    // Retire la classe pour afficher les filtres
    if (filtersContainer) {
      filtersContainer.classList.remove("hidden");
    }
    toggleEditModeBanner(false);
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

      // Ajout de la modale
      const modalTriggers = document.querySelectorAll(".modal-btn.modal-trigger");
      const overlay = document.querySelector(".overlay");
      const galleryContent = document.getElementById("gallery");

      // Ajoutez un gestionnaire d'événements persistant pour le clic sur l'overlay
overlay.addEventListener("click", overlayClickHandler);

      // Vérifie si l'utilisateur est connecté
      const isUserLoggedIn = isLoggedIn();

      // Affiche ou masque le bouton "modifier" en fonction de la connexion
      modalTriggers.forEach(trigger => {
        trigger.style.display = isUserLoggedIn ? "block" : "none";
      });

      // Ajout des gestionnaires d'événements de la modal
      modalTriggers.forEach(trigger => {
        trigger.addEventListener("click", function () {
          console.log("Modal Trigger Clicked");
          toggleModal();
          displayGalleryContent();
        });
      });

      const closeModalButton = document.querySelector(".close-modal");
      if (closeModalButton) {
        closeModalButton.addEventListener("click", function () {
          console.log("Close Modal Clicked");
          toggleModal();
        });
      }

      function toggleModal() {
        console.log("Toggle Modal");
        const modalContainer = document.querySelector(".modal-container");
        const overlay = document.querySelector(".overlay");
    
        // Inverse la classe pour afficher ou masquer la modale
        modalContainer.classList.toggle("active");
    
        if (modalContainer.classList.contains("active")) {
            // Ajoute un gestionnaire d'événements pour fermer la modale en cliquant sur l'overlay
            overlay.addEventListener("click", overlayClickHandler);
        } else {
            // Supprime le gestionnaire d'événements lorsqu'on ferme la modale
            overlay.removeEventListener("click", overlayClickHandler);
        }
    }
    
    function overlayClickHandler() {
        console.log("Overlay Clicked");
        console.log("Toggle Modal from overlayClickHandler");
        toggleModal();
    }
    
    function overlayClickHandler(event) {
      console.log("Overlay Clicked");
      console.log("Event target:", event.target);
      console.log("Overlay:", overlay);
      
      if (event.target.classList.contains('overlay')) {
          console.log("Toggle Modal from overlayClickHandler");
          toggleModal();
      }
  }
  
  function displayGalleryContent() {
    // Efface le contenu existant de la modale
    const modal = document.querySelector(".modal");
    modal.innerHTML = "";
  
    // Crée un conteneur pour le contenu de la modale
    const modalContent = document.createElement("div");
  
    // Ajoute le titre h1 à la modale
    const title = document.createElement("h1");
    title.textContent = "Galerie photo";
    modalContent.appendChild(title);
  
    // Clone le contenu de la galerie et l'ajoute au conteneur de la modale
    const galleryClone = galleryContent.cloneNode(true);
    galleryClone.classList.add("modal-gallery");
    modalContent.appendChild(galleryClone);
  
    // Ajoute le bouton "Ajouter une photo" à la modale
    const addButton = document.createElement("button");
    addButton.id = "boutonAjoutdePhoto";
    addButton.className = "modal-button";
    addButton.textContent = "Ajouter une photo";
    modalContent.appendChild(addButton);
  
    // Ajoute le conteneur de la modale à la modale
    modal.appendChild(modalContent);
  
    // Ajoute un gestionnaire d'événements pour fermer la modale
    const closeModalButton = document.createElement("button");
    closeModalButton.className = "close-modal modal-trigger";
    closeModalButton.textContent = "X";
    closeModalButton.addEventListener("click", function () {
      console.log("Close Modal Clicked");
      toggleModal();
    });
  
    modal.appendChild(closeModalButton);
  }
  
   
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
  function overlayClickHandler() {
    console.log("Overlay Clicked");
    console.log("Toggle Modal from overlayClickHandler");
    toggleModal();
  }
  // Ajoutez un gestionnaire d'événements persistant pour le clic sur l'overlay
  const overlay = document.querySelector(".overlay");
  overlay.addEventListener("click", overlayClickHandler);
});
