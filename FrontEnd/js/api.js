async function fetchData() {
  const apiUrl = "http://localhost:5678/api/works";
  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();
      console.log("La requête vers l'API a réussi. Statut :", response.status);
      console.log("Données récupérées de l'API :", data);
      
      displayGalleryItems(data);
  
    } else {
      console.error("Erreur lors de la récupération des données de l'API. Statut :", response.status);
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la requête :", error);
  }
}

function displayGalleryItems(data) {
  const galleryDiv = document.getElementById("gallery");
  galleryDiv.innerHTML = ""
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
// Appel de la fonction asynchrone
fetchData();