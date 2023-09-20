import jwt_decode from 'jwt-decode'
import { api } from '../api/api'
import router from '../router'

async function fetchWithAuthor(url, options = {}) {
    // Récupérer le token d'autorisation depuis l'endroit approprié (par exemple, localStorage, sessionStorage, etc.)
    console.log(api)
    let token = localStorage.getItem('myblogtoken');
    const decoded = jwt_decode(token)
    // Récupérer la date d'expiration du token
    const tokenExpiration = decoded.exp;
    console.log('Time before expiration', tokenExpiration - Date.now() < 300)
    // Vérifier si le token est présent et non expiré
    if (!token || tokenExpiration - Date.now() < 300) {
      // Le token est manquant ou expiré, nous devons rafraîchir le token
      try {
        // Faire une requête pour rafraîchir le token (assurez-vous d'adapter cela à votre API)
        const refreshTokenResponse = await fetch(api.refreshToken, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Ajouter les en-têtes nécessaires pour rafraîchir le token (par exemple, un token de rafraîchissement)
          },
          credentials: "include",
          // Ajoutez le corps de la requête si nécessaire
          // body: JSON.stringify({ refreshToken }),
        });
  
        if (!refreshTokenResponse.ok) {
          throw new Error('Échec du rafraîchissement du token');
        }
  
        const newTokenData = await refreshTokenResponse.json();
  
        // Mettre à jour le token d'autorisation et la date d'expiration
        token = newTokenData.token;
        localStorage.setItem('myblogtoken', token);

      } catch (error) {
        console.error('Impossible de rafraîchir le token :', error);
        // Gérer le cas où le rafraîchissement du token échoue (par exemple, rediriger vers une page de connexion)
        router.push({name: 'logout'})
        return
      }
    }
  
    // Ajouter le token d'autorisation à l'en-tête de la requête
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    // Faire la requête Fetch avec les options mises à jour
    return fetch(url, options);
  }

  export default fetchWithAuthor
  
  /*
  // Exemple d'utilisation du middleware pour effectuer une requête GET
fetchWithAuthorization('https://api.example.com/data')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Erreur de la requête');
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  }); 

  */