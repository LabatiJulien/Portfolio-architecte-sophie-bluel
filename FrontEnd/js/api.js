let data

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

const modal = document.querySelector(".modal");

  function displayGalleryContent() {
    console.log("Display Gallery Content Clicked");
    
    // Efface le contenu existant de la modale
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
  
  // Appelle la fonction pour créer les icônes de corbeille
  createTrashIcons(galleryClone.querySelectorAll("figure"));

    // Ajoute le bouton "Ajouter une photo" à la modale
    const addButton = document.createElement("button");
    addButton.id = "boutonAjoutdePhoto";
    addButton.className = "modal-button";
    addButton.textContent = "Ajouter une photo";
    modalContent.appendChild(addButton);
  
    // Attache un gestionnaire d'événements au bouton "Ajouter une photo"
  addButton.addEventListener("click", handleAddPhotoButtonClick);
    
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
        
        console.log("L'utilisateur n'est pas connecté.");

        // Appel de la fonction pour afficher dynamiquement les travaux même pour les utilisateurs non connectés
        fetchData();
      }
    }
  }
});

 // Déclaration de la fonction pour gérer le clic sur l'overlay
 function overlayClickHandler(event) {
  console.log("Overlay Clicked");
  if (event.target.classList.contains('overlay')) {
    toggleModal();
  }
}

// Déclaration de la fonction pour afficher ou masquer la modale
function toggleModal() {
  console.log("Toggle Modal");
  const modalContainer = document.querySelector(".modal-container");
  const overlay = document.querySelector(".overlay");

  // Inverse la classe pour afficher ou masquer la modale
  modalContainer.classList.toggle("active");

  // Ajoute ou supprime le gestionnaire d'événements sur l'overlay
  if (modalContainer.classList.contains("active")) {
    overlay.addEventListener("click", overlayClickHandler);
  } else {
    overlay.removeEventListener("click", overlayClickHandler);
  }
}

function updatePhotoList(newPhotoData) {
  console.log("Ajout à la galerie principale : ", newPhotoData.imageUrl);

  const galleryContainer = document.getElementById("gallery");
  console.log("Container de la galerie principale : ", galleryContainer);

  const newFigureElement = document.createElement("figure");
  const newImgElement = document.createElement("img");
  newImgElement.src = newPhotoData.imageUrl;
  newImgElement.alt = newPhotoData.title;

  const newFigcaptionElement = document.createElement("figcaption");
  newFigcaptionElement.textContent = newPhotoData.title;

  const newTrashIcon = document.createElement("i");
  newTrashIcon.className = "fa-regular fa-trash-can";
  newTrashIcon.style.color = "#000000";
 
  const newIconContainer = document.createElement("div");
  newIconContainer.className = "icon-container";
  newIconContainer.appendChild(newTrashIcon);

  newFigureElement.appendChild(newImgElement);
  newFigureElement.appendChild(newFigcaptionElement);
  newFigureElement.appendChild(newIconContainer);

  galleryContainer.appendChild(newFigureElement);

  // Mise à jour de l'écouteur d'événements pour l'icône de la corbeille nouvellement ajoutée
  newTrashIcon.addEventListener("click", handleTrashIconClick);

  console.log("Mise à jour de la liste existante de photos");
  updateGallery();
}

// Fonction appelée lorsque le bouton "Ajouter une photo" est cliqué
async function handleAddPhotoButtonClick() {
 
  // La logique que vous souhaitez exécuter lorsque le bouton est cliqué
  console.log("Bouton 'Ajouter une photo' cliqué !");

  // Récupère le conteneur existant de la modale
  const modalContent = modal.querySelector("div");

 // Remplace le contenu existant par celui de la nouvelle modale
 modalContent.innerHTML = `
  
  <div id="container">
  <i class="fa-solid fa-arrow-left" id="backButton"></i>
  <h2 class="form-title">Ajout de photo</h2>
      
  <form id="addPhotoForm">
  
  <div id="fileSectionContainer">
  <div id="preview">
  <i class="fa-regular fa-image" id="defaultImage"></i>
</div>

        
        <label for="fileInput" id="customFileLabel">+ Ajouter une photo</label>
            <input type="file" id="fileInput" accept="image/jpeg, image/png" onchange="previewImage(event)" required>
            
            <!-- Aperçu de la photo sélectionnée -->
        <img id="photoPreview" style="max-width: 100%; max-height: 200px; margin-top: 10px;">
        <div id="fileInfo">jpg, png : 4 Mo max</div>
        </div>
       
        <h2 class="form-category">Titre de la photo:</h2>
        <input type="text" id="photoTitle" name="photoTitle" required>

        <h2 class="form-category">Catégorie:</h2>
        <select id="category" name="category" required>
          <option value=""></option>
          <option value="1">Objets</option>
          <option value="2">Appartements</option>
          <option value="3">Hotels & restaurants</option>
        </select>
        <hr>
        <button class="new-modal-button" type="submit">Valider</button>
      </form>
    </div>
    <!-- Bouton pour fermer la nouvelle modale -->
    <button class="close-new-modal">X</button>
  `;

  const scriptElement = document.createElement("script");
scriptElement.text = `
  function previewImage(event) {
    var input = event.target;
    var preview = document.getElementById('photoPreview');
    var fileInput = document.getElementById('fileInput');
    var defaultImage = document.getElementById('defaultImage');
    var customFileLabel = document.getElementById('customFileLabel');

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        defaultImage.style.display = 'none';
        customFileLabel.style.display = 'none';

        // Ajouter des styles pour centrer l'image de preview
        preview.style.margin = 'auto';
        preview.style.display = 'block';
      };

      reader.readAsDataURL(input.files[0]);

      // Désactiver l'élément fileInput après la sélection d'une image
      fileInput.disabled = true;
    } else {
      preview.src = '';
      preview.style.display = 'none';
      defaultImage.style.display = 'block';
      customFileLabel.style.display = 'block';

      // Activer l'élément fileInput si aucune image est sélectionnée
      fileInput.disabled = false;
    }
  }
`;
document.head.appendChild(scriptElement);

  // Ajoutez un gestionnaire d'événements au bouton "Fermer" de la nouvelle modale
  const closeNewModalButton = modalContent.querySelector(".close-new-modal");
  if (closeNewModalButton) {
    closeNewModalButton.addEventListener("click", function () {
      
    });

   // Ajoutez un gestionnaire d'événements à l'icône de flèche gauche
const backButton = modalContent.querySelector("#backButton");
if (backButton) {
  backButton.addEventListener("click", function () {
    // Logique à exécuter lorsque le bouton de retour est cliqué
    console.log("Bouton de retour cliqué !");
    
    // Affichez à nouveau la modale mise à jour dynamiquement
    displayGalleryContent();
  });
}

  }

  // Ajoutez un gestionnaire d'événements au formulaire
  const addPhotoForm = modalContent.querySelector("#addPhotoForm");
  if (addPhotoForm) {
    addPhotoForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData();
      formData.append("image", document.getElementById("fileInput").files[0]);
      formData.append("title", document.getElementById("photoTitle").value);
      formData.append("category", document.getElementById("category").value);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        data = await response.json();
        console.log("Réponse de l'API :", data);

        updatePhotoList(data);
      // Fermer la modale après l'ajout de la photo
      toggleModal();
    } catch (error) {
      console.error("Erreur lors de la demande POST :", error);
    }
    });
  }

}

function displayGalleryItems(data) {
  console.log("Displaying gallery items with data:", data);
  const galleryDiv = document.getElementById("gallery");

  // Vérifie si l'élément "gallery" existe sur la page
  if (galleryDiv) {
    galleryDiv.innerHTML = "";

    data.forEach(item => {
      const figureElement = document.createElement("figure");
      figureElement.dataset.id = item.id; // Ajoute un attribut data-id avec l'ID de l'image

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
  let allWorks = window.allWorks || [];

  // Filtrer les travaux en fonction de la catégorie
  const filteredWorks = (categoryId === 'all') ?
    allWorks :
    allWorks.filter(work => work.categoryId === categoryId);

  // Appel de la fonction pour afficher dynamiquement les travaux filtrés dans la galerie
  displayGalleryItems(filteredWorks);
}

// Fonction asynchrone pour récupérer les données de l'API
async function fetchData() {
  const apiUrl = "http://localhost:5678/api/works";
  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();
      console.log("La requête vers l'API a réussi. Statut :", response.status);
      console.log("Données récupérées de l'API :", data);

      // Supprimer l'image si elle a été marquée pour suppression
      if (window.imageToDelete) {
        await deleteImage(window.imageToDelete);
        window.imageToDelete = null; // Réinitialiser la variable après la suppression
      }

      // Stocke les données pour les utiliser lors du filtrage
      window.allWorks = data;

      // Appel de la fonction pour afficher dynamiquement les travaux
      displayGalleryItems(data);

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

// Fonction pour mettre à jour la visibilité des filtres en fonction de la connexion
function updateFilterVisibility() {
  const filtersContainer = document.getElementById("categoryButtons");
  if (filtersContainer) {
    
    filtersContainer.classList.toggle("hidden", isLoggedIn());
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
   
    // Mise à jour de la visibilité des filtres
    updateFilterVisibility();

    toggleEditModeBanner(true);
  } else {
   
    // Utilisateur non connecté
    // Remplace le bouton "Logout" par le lien "Login"
    if (logoutButton && loginLink) {
      logoutButton.replaceWith(loginLink);
    }

    // Mise à jour de la visibilité des filtres
    updateFilterVisibility();

    toggleEditModeBanner(false);
  }
}

// Fonction pour mettre à jour la galerie principale
async function updateGallery() {
  const apiUrl = "http://localhost:5678/api/works";
  try {
    // Supprimer l'image si elle a été marquée pour suppression
    if (window.imageToDelete) {
      await deleteImage(window.imageToDelete);
      window.imageToDelete = null; // Réinitialiser la variable après la suppression
    }

    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();
      console.log("Mise à jour de la galerie. Données récupérées de l'API :", data);

      // Appel de la fonction pour afficher dynamiquement les travaux
      displayGalleryItems(data);

      // Mettez à jour la variable globale pour une utilisation ultérieure lors du filtrage
      window.allWorks = data;

      console.log("Galerie mise à jour avec succès !");
    } else {
      console.error("Erreur lors de la récupération des données de l'API. Statut :", response.status);
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la requête :", error);
  }
}

// Gestionnaire d'événements pour l'icône de la corbeille
async function handleTrashIconClick(event) {
  const figureElement = event.target.closest("figure");
  if (!figureElement) {
    console.error("Élément figure introuvable.");
    return;
  }

  const imageId = figureElement.dataset.id;
  if (!imageId) {
    console.error("ID de l'image introuvable.");
    return;
  }

  // Effectuer la demande de suppression à l'API en utilisant imageId
  try {
    const apiUrl = `http://localhost:5678/api/works/${imageId}`;
    const token = localStorage.getItem('token');
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    console.log("Réponse de l'API (Suppression) :", response.statusText);

    // Si la suppression côté serveur réussit, mettez à jour le tableau allWorks localement
    const indexOfDeleted = window.allWorks.findIndex(work => work.id === imageId);
    if (indexOfDeleted !== -1) {
      window.allWorks.splice(indexOfDeleted, 1);
    }

    // Mettre également à jour la variable globale data
    data = window.allWorks;

    // Mettre à jour l'affichage
    displayGalleryItems(window.allWorks);
    updateGallery();

  } catch (error) {
    console.error("Erreur lors de la demande DELETE :", error);
    throw error;
  }
}

async function deleteImage(imageId) {
  const apiUrl = `http://localhost:5678/api/works/${imageId}`;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("Réponse de l'API (Suppression) :", response.statusText);

    // Si la suppression côté serveur est réussie, mettez à jour le tableau allWorks localement
    const indexOfDeleted = window.allWorks.findIndex(work => work.id === imageId);
    if (indexOfDeleted !== -1) {
      window.allWorks.splice(indexOfDeleted, 1);
    }

    // Mettre à jour la variable globale data également
    data = window.allWorks;

    // Mettre à jour l'affichage
    displayGalleryItems(window.allWorks);

  } catch (error) {
    console.error("Erreur lors de la demande DELETE :", error);
    throw error;
  }
}

// Création des icônes de corbeille 
function createTrashIcons(figures) {
  figures.forEach(figure => {
    figure.removeChild(figure.querySelector("figcaption"));

    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-regular fa-trash-can";
    trashIcon.addEventListener("click", handleTrashIconClick);

    const iconContainer = document.createElement("div");
    iconContainer.className = "icon-container";
    iconContainer.style.position = "absolute";
    iconContainer.style.top = "10px";
    iconContainer.style.right = "5px";
    iconContainer.style.padding = "5px";
    iconContainer.style.backgroundColor = "#000";  // Fond noir

    // Style pour l'icône blanche
    trashIcon.style.color = "#fff"; 

    iconContainer.appendChild(trashIcon);

    figure.style.position = "relative";
    figure.appendChild(iconContainer);
  });
}