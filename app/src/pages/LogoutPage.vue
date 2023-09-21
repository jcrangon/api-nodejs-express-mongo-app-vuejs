<template>
  <div>
    <TopNav :isLoggedIn="isLoggedIn" />

    <main class="position-relative">
      <div class="container mt-5">


      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import TopNav from '../components/TopNav'
import FooterComponent from '../components/FooterComponent'

export default {
  name: 'LogoutPage',
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
    }
  },
  methods: {
    async logout() {
      fetch(this.api.logout, {
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        credentials: "include",
      })
      .then(response => {
          if (!response.ok) {
            throw new Error('Erreur de déconnexion');
          }
          return response.json();
      })
      .finally(data => {
          if(data) console.log(data)
          localStorage.removeItem('myblogtoken')
          this.$router.push('/')
      })
      .catch(error => {
          console.error(error.message);
      });
    },
  },
  computed:{},
  mounted() {
    this.logout()
  }
}
</script>

<style scoped>
main {
  min-height: 800px;
  margin: 0 auto;
  max-width: 100%;
}
</style>
