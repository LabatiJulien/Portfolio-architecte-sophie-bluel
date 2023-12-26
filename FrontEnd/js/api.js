let data = [];
let modal = document.querySelector(".modal");
let deletionSuccessful = false;

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

function clearGalleryDiv(galleryDiv) {
  // Supprime tous les enfants de la galerie
  while (galleryDiv.firstChild) {
    galleryDiv.removeChild(galleryDiv.firstChild);
  }
}

function displayGalleryItems() {
  const galleryDiv = document.getElementById("gallery");

  if (!galleryDiv) {
    return; // Arrêtez l'exécution si l'élément de la galerie n'est pas trouvé
  }

  const fragment = document.createDocumentFragment();
  const itemsToDisplay = data;  // Utilise toujours les données globales data

  itemsToDisplay.forEach(item => {
    const figureElement = createFigureElement(item);
    fragment.appendChild(figureElement);
  });

  clearGalleryDiv(galleryDiv);
  galleryDiv.appendChild(fragment);
  console.log("Gallery items displayed successfully.");
}

function removeFigcaption(figure) {
  if (figure && figure.querySelector("figcaption")) {
    figure.removeChild(figure.querySelector("figcaption"));
  }
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

    updateFilterVisibility();

    toggleEditModeBanner(false);
  }
}

function toggleEditModeBanner(isEditMode) {
  const header = document.querySelector("header");

  if (header) {
    if (isEditMode) {
      // Crée la bande noire avec le texte "Mode édition"
      const editModeBanner = document.createElement("div");
      editModeBanner.className = "edit-mode-banner";

      const iconElement = document.createElement("i");
      iconElement.classList.add("fa-regular", "fa-pen-to-square", "fa-xs");

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

// Fonction pour mettre à jour la visibilité des filtres en fonction de la connexion

function updateFilterVisibility() {
  const filtersContainer = document.getElementById("categoryButtons");
  if (filtersContainer) {
    filtersContainer.classList.toggle("hidden", isLoggedIn());
  }
}

// Déclaration de la fonction pour filtrer les travaux par catégorie
function filterByCategory(categoryId) {
  // Filtre les travaux en fonction de la catégorie
  const filteredWorks = (categoryId === 'all') ?
    data :
    data.filter(work => work.categoryId === categoryId);
  // Appel de la fonction pour afficher dynamiquement les travaux filtrés dans la galerie
  displayGalleryItems(filteredWorks);
}

// Déclaration de la fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
  const token = localStorage.getItem('token');
  return !!token; 
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

      // Initialisation de la variable modal à l'intérieur de la fonction DOMContentLoaded
      modal = document.querySelector(".modal");

      // Ajout de la modale
      const modalTriggers = document.querySelectorAll(".modal-btn.modal-trigger");
      const overlay = document.querySelector(".overlay");
      const galleryContent = document.getElementById("gallery");

      // Ajoute un gestionnaire d'événements persistant pour le clic sur l'overlay
      overlay.addEventListener("click", overlayClickHandler);

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
   
    // Déclaration de la fonction pour gérer le clic sur l'overlay
function overlayClickHandler(event) {
  console.log("Overlay Clicked");
  if (event.target.classList.contains('overlay')) {
    toggleModal();
  }
}

// Déclaration de la fonction pour afficher ou masquer la modale
async function toggleModal() {
  console.log("Toggle Modal");
  const modalContainer = document.querySelector(".modal-container");
  const overlay = document.querySelector(".overlay");

  // Vérifie si la modale est active avant de la désactiver
  const wasModalActive = modalContainer.classList.contains("active");

  // Inverse la classe pour afficher ou masquer la modale
  modalContainer.classList.toggle("active");

  // Ajoute ou supprime le gestionnaire d'événements sur l'overlay
  if (modalContainer.classList.contains("active")) {
    overlay.addEventListener("click", overlayClickHandler);
  }
}

async function updateGallery(){
  const apiUrl = "http://localhost:5678/api/works";
  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      data = await response.json();
      console.log("Mise à jour de la galerie. Données récupérées de l'API :", data);

      // Appel de la fonction pour afficher dynamiquement les travaux
      displayGalleryItems(data);
      console.log("Gallery updated successfully.");
      // Création des icônes de corbeille pour les nouvelles figures de la modale
      const modalGalleryClone = modal.querySelector(".modal-gallery");
      if (modalGalleryClone) {
        createTrashIcons(modalGalleryClone.querySelectorAll("figure"));
      }
    } else {
      console.error("Erreur lors de la récupération des données de l'API. Statut :", response.status);
    }

    // Mettez à jour la variable pour indiquer que la suppression a été réussie
    deletionSuccessful = true;

  } catch (error) {
    console.error("Une erreur s'est produite lors de la requête :", error);

    // Mettez à jour la variable pour indiquer que la suppression a échoué
    deletionSuccessful = false;
  }
}

// Gestionnaire d'événements pour l'icône de la corbeille
async function handleTrashIconClick(event) {
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
    console.log("Element removed from DOM:", figureElement); // Ajout du console.log
    figureElement.remove();

  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

// Création des icônes de corbeille 
function createTrashIcons(figures) {
  figures.forEach(figure => {
    removeFigcaption(figure);

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

    trashIcon.style.color = "#fff"; 

    iconContainer.appendChild(trashIcon);

    figure.style.position = "relative";
    figure.appendChild(iconContainer);
  });
}

  // Function to display gallery content
function displayGalleryContent() {
  console.log("Display Gallery Content Clicked");

  // Clear existing content in the modal
  modal.innerHTML = "";

  // Create a container for the modal content
  const modalContent = document.createElement("div");

  // Add the h1 title to the modal
  const title = document.createElement("h1");
  title.textContent = "Galerie photo";
  modalContent.appendChild(title);

  // Clone the gallery content and append it to the modal container
  const galleryClone = galleryContent.cloneNode(true);
  galleryClone.classList.add("modal-gallery");

  modalContent.appendChild(galleryClone);

  // Call the function to create trash icons
  createTrashIcons(galleryClone.querySelectorAll("figure"));

  // Add the "Ajouter une photo" button to the modal
  const addButton = document.createElement("button");
  addButton.id = "boutonAjoutdePhoto";
  addButton.className = "modal-button";
  addButton.textContent = "Ajouter une photo";
  modalContent.appendChild(addButton);

  // Attach an event handler to the "Ajouter une photo" button
  addButton.addEventListener("click", handleAddPhotoButtonClick);

  modal.appendChild(modalContent);

  // Add an event handler to close the modal
  const closeModalButton = document.createElement("button");
  closeModalButton.className = "close-modal modal-trigger";
  closeModalButton.textContent = "X";
  closeModalButton.addEventListener("click", function () {
    console.log("Close Modal Clicked");
    toggleModal();
  });
  // Call the function to remove figcaptions
  createTrashIcons(galleryClone.querySelectorAll("figure"));
  modal.appendChild(closeModalButton);
}

// Event handler for the "Ajouter une photo" button click
async function handleAddPhotoButtonClick() {
  console.log("Bouton 'Ajouter une photo' cliqué !");

  const modalContent = modal.querySelector("div");

  // Replace the existing content with the new modal content
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

  // Dynamically add the script for the previewImage function
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

          // Add styles to center the preview image
          preview.style.margin = 'auto';
          preview.style.display = 'block';
        };

        reader.readAsDataURL(input.files[0]);

        // Disable the fileInput element after selecting an image
        fileInput.disabled = true;
      } else {
        preview.src = '';
        preview.style.display = 'none';
        defaultImage.style.display = 'block';
        customFileLabel.style.display = 'block';

        // Enable the fileInput element if no image is selected
        fileInput.disabled = false;
      }
    }
  `;
  document.head.appendChild(scriptElement);

  const closeNewModalButton = modalContent.querySelector(".close-new-modal");
  if (closeNewModalButton) {
    closeNewModalButton.addEventListener("click", function () {
      
    });

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
    addPhotoForm.addEventListener("submit", async function (event) {
      event.preventDefault();

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
    }
  }
});