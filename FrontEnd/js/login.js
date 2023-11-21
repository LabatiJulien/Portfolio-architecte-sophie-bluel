document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");
  
    // Vérifie si le formulaire de connexion existe sur la page
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        // Récupérez les valeurs des champs
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
  
        // Effectuez une requête à votre API pour vérifier les identifiants
        try {
          const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
  
          if (response.ok) {
            // Récupérez le token de la réponse
            const { token } = await response.json();
  
            // Stockez le token dans le stockage local
            localStorage.setItem('token', token);
  
            // Redirigez l'utilisateur vers la page d'accueil après une connexion réussie
            window.location.href = "/index.html";
          } else {
            // Affichez un message d'erreur en cas d'identifiants incorrects
            errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
          }
        } catch (error) {
          console.error("Une erreur s'est produite lors de la requête :", error);
          errorMessage.textContent = "Erreur lors de la connexion. Veuillez réessayer.";
        }
      });
    }
  });