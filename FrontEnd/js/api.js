// Définir l'URL de l'API
const apiUrl = 'http://localhost:5678/api/works';

// Fonction pour supprimer les projets statiques du HTML
function removeStaticProjects() {
    // Sélectionner la section avec l'id "portfolio"
    const portfolioSection = document.getElementById('portfolio');

    // Supprimer tous les enfants de la section (les projets statiques)
    while (portfolioSection.firstChild) {
        portfolioSection.firstChild.remove();
    }
}

// Fonction pour récupérer les projets depuis le backend
async function fetchProjects() {
    try {
        // Utilisation de fetch pour faire la requête à l'API
        const response = await fetch(apiUrl);

        // Vérification si la requête a réussi (statut 200 OK)
        if (!response.ok) {
            throw new Error('Erreur réseau ou serveur');
        }

        // Conversion de la réponse en JSON
        const data = await response.json();

        // Utilisation des données récupérées pour afficher les projets dans le HTML
        displayProjects(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

// Fonction pour afficher les projets dans le HTML
function displayProjects(projects) {
    // Appeler d'abord la fonction pour supprimer les projets statiques
    removeStaticProjects();

    // Sélectionner la section avec l'id "portfolio"
    const portfolioSection = document.getElementById('portfolio');

    // Créer et ajouter les éléments HTML pour chaque projet
    projects.forEach(project => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = project.image;  // Assurez-vous que votre objet de données a une propriété 'image'
        img.alt = project.name;   // Assurez-vous que votre objet de données a une propriété 'name'
        figcaption.textContent = project.name;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        portfolioSection.querySelector('.gallery').appendChild(figure);
    });
}

// Appel de la fonction pour récupérer les projets
fetchProjects();