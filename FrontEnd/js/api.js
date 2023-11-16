const apiUrl = 'http://localhost:5678/api/works';

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
  
      // Utilisation des données récupérées (remplacez cela par ce que vous devez faire)
      console.log('Projets récupérés :', data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  }
  
  // Appel de la fonction pour récupérer les projets
  fetchProjects();