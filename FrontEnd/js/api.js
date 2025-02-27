let data = [];

async function fetchData() {
  const apiUrl = "http://localhost:5678/api/works";
  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      data = await response.json();
      console.log("La requête vers l'API a réussi. Statut :", response.status);
      console.log("Données récupérées de l'API :", data);

      displayGalleryItems(); 
      updateLoginLogoutButton();
    } else {
      console.error("Erreur lors de la récupération des données de l'API. Statut :", response.status);
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la requête :", error);
  }
}

function displayGalleryItems(filteredData) {
    
  // Récupère l'élément de la galerie par son ID
  const galleryDiv = document.getElementById("gallery");

  // Arrête l'exécution si l'élément de la galerie n'est pas trouvé
  if (!galleryDiv) {
    return; 
  }
// Crée un fragment de document pour améliorer les performances des manipulations DOM
  const fragment = document.createDocumentFragment();
  // Détermine les éléments à afficher en fonction des données filtrées ou non filtrées
  const itemsToDisplay = (filteredData !== undefined) ? filteredData : data;
// Pour chaque élément à afficher, crée un élément figure et l'ajoute au fragment
  itemsToDisplay.forEach(item => {
    const figureElement = createFigureElement(item);
    figureElement.classList.add('modal-figure');
    fragment.appendChild(figureElement);
  });
  // Efface le contenu actuel de l'élément de la galerie
  clearGalleryDiv(galleryDiv);
  // Ajoute le fragment (contenant les nouvelles figures) à l'élément de la galerie
  galleryDiv.appendChild(fragment);
}

function createFigureElement(item) {
  const figureElement = document.createElement("figure");
  figureElement.dataset.id = item.id;

  const imgElement = document.createElement("img");
  imgElement.src = item.imageUrl;
  imgElement.alt = item.title;

  figureElement.appendChild(imgElement);

  return figureElement;
}

function filterByCategory(categoryId) {
  // Filtre les travaux en fonction de la catégorie
  const filteredWorks = (categoryId === 'all') ?
    data :
    data.filter(work => work.categoryId === categoryId);
  // Appel de la fonction pour afficher dynamiquement les travaux filtrés dans la galerie
  displayGalleryItems(filteredWorks);
}

// Fonction pour mettre à jour la visibilité des filtres en fonction de la connexion
function updateFilterVisibility() {
  const filtersContainer = document.getElementById("categoryButtons");
  if (filtersContainer) {
    // Utilise la méthode toggle pour ajouter ou retirer la classe "hidden" en fonction de la connexion
    filtersContainer.classList.toggle("hidden", isLoggedIn());
  }
}

function clearGalleryDiv(galleryDiv) {
  // Supprime tous les enfants de la galerie
  while (galleryDiv.firstChild) {
    galleryDiv.removeChild(galleryDiv.firstChild);
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
   
    if (logoutButton && loginLink) {
      logoutButton.replaceWith(loginLink);
    }

    updateFilterVisibility();

    toggleEditModeBanner(false);
  }
}

function isLoggedIn() {
  const token = localStorage.getItem('token');
  return !!token; 
}

function toggleEditModeBanner(isEditMode) {
  const header = document.querySelector("header");

  if (header) {
    if (isEditMode) {
      // Crée la bande noire avec le texte "Mode édition"
      const editModeBanner = document.createElement("div");
      editModeBanner.className = "edit-mode-banner";
 
      // Crée l'icône avec les classes FontAwesome
      const iconElement = document.createElement("i");
      iconElement.classList.add("fa-regular", "fa-pen-to-square", "fa-xs");
// Ajoute l'icône à la bande noire
      editModeBanner.appendChild(iconElement);

      // Crée l'élément pour le texte "Mode édition"
      const textElement = document.createElement("span");
      textElement.textContent = " Mode édition";

      editModeBanner.appendChild(textElement);

      header.parentNode.insertBefore(editModeBanner, header);

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

async function toggleModal() {
  console.log("Toggle Modal");
  const modalContainer = document.querySelector(".modal-container");
  const overlay = document.querySelector(".overlay");

  // Inverse la classe pour afficher ou masquer la modale
  modalContainer.classList.toggle("active");

  // Ajoute ou supprime le gestionnaire d'événements sur l'overlay
  if (modalContainer.classList.contains("active")) {
    overlay.addEventListener("click", overlayClickHandler);
  }
}
    function overlayClickHandler(event) {
      console.log("Overlay Clicked");
      if (event.target.classList.contains('overlay')) {
        toggleModal();
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
      
      // Appel de la fonction fetchData au chargement de la page
       fetchData();
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
      
      if (token) {
 
        // Ajoute dynamiquement un bouton de déconnexion
        const logoutButton = document.createElement("button");
        logoutButton.id = "logoutButton";
        logoutButton.textContent = "Logout";
        logoutButton.addEventListener("click", function () {
          localStorage.removeItem('token');
          window.location.href = "/login/login.html";
        });
       
        const header = document.querySelector("header");
        if (header) {
          header.appendChild(logoutButton);
        }
       }
       
// Initialisation de la variable modal à l'intérieur de la fonction DOMContentLoaded
modal = document.querySelector(".modal");
     
// Ajout de la modale
      const modalTriggers = document.querySelectorAll(".modal-btn.modal-trigger");
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
   
// Gestionnaire d'événements pour l'icône de la corbeille
async function handleTrashIconClick(event) {
  // Récupère l'élément figure le plus proche (ascendant) de l'icône de la corbeille
  const figureElement = event.target.closest("figure");
  if (!figureElement) {
    console.error("Figure element not found.");
    return;
  }

  const imageId = figureElement.dataset.id;
  if (!imageId) {
    console.error("Image ID not found.");
    return;
  }

  try {
    // Effectue la demande de suppression à l'API en utilisant imageId
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Supprime l'élément du DOM côté client
    figureElement.remove();

    // Efface la galerie pour refléter la suppression dynamique
    const galleryDiv = document.getElementById("gallery");
    clearGalleryDiv(galleryDiv);

    // Mise à jour de la galerie principale
    await updateGallery(true); 
  } catch (error) {
    console.error("Error deleting image:", error);
    await updateGallery(false); 
  }
}

async function handleAddPhotoButtonClick() {
  console.log("Bouton 'Ajouter une photo' cliqué !");
// Récupère l'élément contenant le contenu de la modale
  const modalContent = modal.querySelector("div");
// Remplace le contenu de la modale par un formulaire d'ajout de photo
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
// Crée un élément de script contenant une fonction de prévisualisation d'image
  const scriptElement = document.createElement("script");
  scriptElement.text = `
    function previewImage(event) {
      
      // Récupère l'élément input qui a déclenché l'événement
      var input = event.target;
      
      // Récupère les éléments du DOM nécessaires pour la prévisualisation
      var preview = document.getElementById('photoPreview');
      var fileInput = document.getElementById('fileInput');
      var defaultImage = document.getElementById('defaultImage');
      var customFileLabel = document.getElementById('customFileLabel');

      // Vérifie si un fichier a été sélectionné
      if (input.files && input.files[0]) {
        // Crée un objet FileReader pour lire le contenu du fichier
        var reader = new FileReader();
       
        // Définit une fonction à exécuter lorsque la lecture est terminée
        reader.onload = function(e) {
          // Met à jour l'élément img de prévisualisation avec le résultat de la lecture
          preview.src = e.target.result;

          // Affiche l'élément de prévisualisation et masque les éléments par défaut
          preview.style.display = 'block';
          defaultImage.style.display = 'none';
          customFileLabel.style.display = 'none';

          // Ajoute des styles pour centrer l'image de prévisualisation
          preview.style.margin = 'auto';
          preview.style.display = 'block';
        };
       
        // Démarre la lecture du fichier en tant que données URL
        reader.readAsDataURL(input.files[0]);

        // Désactive l'élément fileInput après la sélection d'une image
        fileInput.disabled = true;
      } else {
      
        // Si aucun fichier n'est sélectionné, réinitialise les éléments
        preview.src = '';
        preview.style.display = 'none';
        defaultImage.style.display = 'block';
        customFileLabel.style.display = 'block';

        // Active l'élément fileInput si aucune image n'est sélectionnée
        fileInput.disabled = false;
      }
    }
  `;
  document.head.appendChild(scriptElement);
 // Récupère le bouton de fermeture de la nouvelle modale
  const closeNewModalButton = modalContent.querySelector(".close-new-modal");
  if (closeNewModalButton) {
    closeNewModalButton.addEventListener("click", function () {
      
    });
 // Récupère le bouton de retour
    const backButton = modalContent.querySelector("#backButton");
if (backButton) {
  backButton.addEventListener("click", function () {
    console.log("Bouton de retour cliqué !");
    displayGalleryContent();
  });
}

  // Ajoute un gestionnaire d'événements au formulaire
  const addPhotoForm = modalContent.querySelector("#addPhotoForm");
  if (addPhotoForm) {
     // Ajoute un gestionnaire d'événements à la soumission du formulaire
    addPhotoForm.addEventListener("submit", async function (event) {
      event.preventDefault();
// Crée un objet FormData avec les valeurs du formulaire
      const formData = new FormData();
      formData.append("image", document.getElementById("fileInput").files[0]);
      formData.append("title", document.getElementById("photoTitle").value);
      formData.append("category", document.getElementById("category").value);

        const token = localStorage.getItem('token');
        try {
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
        
          await updateGallery();
        
          // Revenir à la modale après l'ajout de la photo
        displayGalleryContent();
      } catch (error) {
        console.error("Erreur lors de la demande POST :", error);
      }
    });
  }

}

  }
  
  async function updateGallery() {
    const apiUrl = "http://localhost:5678/api/works";
    try {
      const response = await fetch(apiUrl);
  
      if (response.ok) {
        data = await response.json();
        console.log("Mise à jour de la galerie. Données récupérées de l'API :", data);
  
        // Appel de la fonction pour afficher dynamiquement les travaux
        displayGalleryItems(data);
  
        // Si la modale est ouverte, met à jour la galerie dans la modale également
        if (modal.classList.contains("active")) {
          const modalGallery = modal.querySelector(".modal-gallery");
          createTrashIcons(modalGallery.querySelectorAll("figure"));
        }
  
        console.log("Mise à jour de la galerie terminée");
  
      } else {
        console.error("Erreur lors de la récupération des données de l'API. Statut :", response.status);
      }
  
    } catch (error) {
      console.error("Une erreur s'est produite lors de la requête :", error);
  
    }
  }

// Création des icônes de corbeille 
function createTrashIcons(figures) {
  figures.forEach(figure => {
    // Vérifiez si la figure a la classe spécifique
    if (figure.classList.contains('modal-figure')) {

      const trashIcon = document.createElement("i");
      trashIcon.className = "fa-regular fa-trash-can";
      trashIcon.addEventListener("click", handleTrashIconClick);

      const iconContainer = document.createElement("div");
      iconContainer.className = "icon-container";
      iconContainer.style.position = "absolute";
      iconContainer.style.top = "10px";
      iconContainer.style.right = "5px";
      iconContainer.style.padding = "5px";
      iconContainer.style.backgroundColor = "#000";

      trashIcon.style.color = "#fff"; 

      iconContainer.appendChild(trashIcon);

      figure.style.position = "relative";
      figure.appendChild(iconContainer);
    }
  });
}

function displayGalleryContent() {
  console.log("Display Gallery Content Clicked");
  // Nettoie le contenu de la modale
  modal.innerHTML = "";
  
  // Crée un nouvel élément div pour le contenu de la modale
  const modalContent = document.createElement("div");

  // Ajout h1
  const title = document.createElement("h1");
  title.textContent = "Galerie photo";
  modalContent.appendChild(title);

  // Récupère le conteneur de la galerie dans le document
  const galleryContainer = document.getElementById("gallery");
  if (galleryContainer) {
    galleryContainer.querySelectorAll("figure").forEach(figure => 
      {
        // Clone la figure pour la modale
      const figureCopy = figure.cloneNode(true);
      // Ajuste la taille de l'image dans la figure
  const imgElement = figureCopy.querySelector("img");
  if (imgElement) {
    imgElement.style.width = "76.611px";
    imgElement.style.height = "102.064px";
  }

      figureCopy.classList.add("modal-figure");
  figureCopy.style.display = "inline-block";
figureCopy.style.marginRight = "6px";
figureCopy.style.marginBottom = "25px";
      modalContent.appendChild(figureCopy);
    });
 // Ligne horizontal
 const hrElement = document.createElement("hr");
 hrElement.style.marginTop = "120px";
 modalContent.appendChild(hrElement);

    createTrashIcons(modalContent.querySelectorAll('.modal-figure'));
  }

  // Bouton Ajouter une photo à la Modal
  const addButton = document.createElement("button");
  addButton.id = "boutonAjoutdePhoto";
  addButton.className = "modal-button";
  addButton.textContent = "Ajouter une photo";
  modalContent.appendChild(addButton);

  addButton.addEventListener("click", handleAddPhotoButtonClick);

  modal.appendChild(modalContent);

  const closeModalButton = document.createElement("button");
  closeModalButton.className = "close-modal modal-trigger";
  closeModalButton.textContent = "X";
  closeModalButton.addEventListener("click", function () {
    console.log("Close Modal Clicked");
    toggleModal();
  });

  createTrashIcons(modalContent.querySelectorAll('.modal-figure'));
  
  modal.appendChild(closeModalButton);
}
    }
  }
});