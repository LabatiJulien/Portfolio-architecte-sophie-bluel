// Déclaration de la fonction pour afficher dynamiquement les travaux
function displayGalleryItems(data) {
  const galleryDiv = document.getElementById("gallery");
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
    } else {
      console.error("Erreur lors de la récupération des données de l'API. Statut :", response.status);
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la requête :", error);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  // Ajout des gestionnaires d'événements pour le filtrage par catégorie
  document.getElementById("allButton").addEventListener("click", function() {
    filterByCategory('all');
  });

  document.getElementById("objectsButton").addEventListener("click", function() {
    filterByCategory(1);
  });

  document.getElementById("apartmentsButton").addEventListener("click", function() {
    filterByCategory(2);
  });

  document.getElementById("hotelsButton").addEventListener("click", function() {
    filterByCategory(3);
  });

  // Appel de la fonction asynchrone pour récupérer les données de l'API
  fetchData();
});