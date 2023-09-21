<template>
  <div v-if="!isLoggedIn">
    <TopNav :isLoggedIn="isLoggedIn" />
    <h1 class="text-center mt-5">Enregistrement</h1>

    <main class="position-relative">
      <div class="container mt-5">
        <form @submit.prevent="login">
          <div class="errors" v-if="userErrors.length" >
            <ul>
              <li v-for="error in userErrors" :key="error.msg">
                {{ error.msg }}
              </li>
            </ul>
          </div>
          <div class="mb-3">
              <label for="email" class="form-label">E-mail:</label>
              <input type="email" class="form-control" id="email" v-model="email" required>
          </div>
          <div class="mb-3">
              <label for="password" class="form-label">Mot de passe:</label>
              <input type="password" class="form-control" id="password" v-model="password" required>
          </div>
          <button type="submit" class="btn btn-primary">Se connecter</button>
        </form>

      </div>
    </main>

    <FooterComponent />
  </div>

</template>

<script>
import TopNav from '../components/TopNav'
import FooterComponent from '../components/FooterComponent'

export default {
  name: 'LoginPage',
  components: {
    TopNav,
    FooterComponent
  },
  props: {
    api: Object,
    utils: Object,
  },
  data(){
    return {
      isLoggedIn: this.utils.checkLogin(),
      userErrors: [],
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      const userData = {
          username: this.email,
          password: this.password,
      };

      try {
          const response = await fetch(this.api.login, 
          {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const responseData = await response;
            console.log(responseData)
            throw new Error(JSON.stringify({status: responseData.status, statusText: responseData.statusText}))
          }

          // Gérez la réponse du serveur ici pour obtenir le token JWT
          const responseData = await response.json();
          const token = responseData.token;
          console.log(responseData)

          // On stocke le token JWT dans le localStorage ou dans un cookie sécurisé
          localStorage.setItem('myblogtoken', token);

          // On redirige l'utilisateur vers la page d'accueil ou une autre page privée
          this.$router.push('/');
      } catch (error) {
          // Gérez les erreurs ici (par exemple, affichez un message d'erreur)
          console.log(JSON.parse(error.message))
          const statusText = JSON.parse(error.message).statusText
          console.log(statusText)
          const status = JSON.parse(error.message).status
          console.log(status)
          if(status === 401 && statusText === 'Unauthorized'){
            this.userErrors.push({msg: 'Identifiant et ou mot de passe invalide!'})
            console.log(this.userErrors)
          }
          
      }
    },
  },
  computed:{},
  mounted() {
    if(this.isLoggedIn) {
      this.$router.go(-1)
      return
    }
  },
}
</script>

<style scoped>
main {
  min-height: 800px;
  max-width: 100%;
  margin: 0 auto;
}
form {
  max-width: 600px;
  margin: 0 auto;
}
.errors {
  color: red;
  background: pink;
  border: 1px solid red;
}
</style>
