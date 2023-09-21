<template>
  <div v-if="!isLoggedIn">
    <TopNav :isLoggedIn="isLoggedIn" />
    <h1 class="text-center mt-5">Inscription</h1>

    <main class="position-relative">
      <div class="container mt-5">
        <form @submit.prevent="register">
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
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirmer le mot de passe:</label>
            <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
            <small class="text-danger">{{ passMisMatch }}</small>
          </div>
          <button type="submit" class="btn btn-primary">S'inscrire</button>
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
  name: 'RegisterPage',
  components: {
    TopNav,
    FooterComponent,
  },
  props: {
    api: Object,
    utils: Object,
  },
  data(){
    return {
      isLoggedIn: this.utils.checkLogin(),
      email: '',
      password: '',
      confirmPassword: '',
      passMisMatch: '',
      userErrors: [],
    }
  },
  methods: {
    async register() {
      // Validez les données du formulaire ici (email, mot de passe, etc.)
      this.passMisMatch ='';
      if (this.password !== this.confirmPassword) {
        this.passMisMatch = 'Les mots de passe ne correspondent pas'
        this.confirmPassword = ''
        return;
      }

      const userData = {
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      };

      try {
        const response = await fetch(`${this.api.register}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const responseData = await response.json()
          console.log(responseData)
          throw new Error(JSON.stringify(responseData))
        }

        // Gérez la réponse du serveur ici (par exemple, redirection vers la page de connexion)
        const responseData = await response.json();
        console.log(responseData);
        this.$router.push('/login'); // Redirigez vers la page de connexion
      } catch (errors) {
        // Gérez les erreurs ici (par exemple, affichez un message d'erreur)
        console.log(JSON.parse(errors.message).errors);
        this.userErrors = JSON.parse(errors.message).errors
      }
    },
  },
  computed:{},
  mounted() {
    if(this.isLoggedIn) {
      this.$router.go(-1)
      return
    }
  }
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
