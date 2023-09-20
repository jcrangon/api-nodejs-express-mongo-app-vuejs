<template>
  <nav class="navbar navbar-expand-lg sticky-top" style="background-color: #76B7E6;">
  <div class="container">

    <router-link :to="{name: 'home'}" class="text-decoration-none">
      <a class="navbar-brand" href="#">Mon Blog Voyages</a>
    </router-link>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">

        <li class="nav-item">
          <router-link :to="{name: 'home'}" class="text-decoration-none">

            <a class="nav-link" aria-current="page" href="#">Accueil</a>

          </router-link>
        </li>

        <li v-if="isLoggedIn" class="nav-item dropdown">

          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Blog
          </a>

          <ul class="dropdown-menu">
            <li>
              <router-link :to="{name: 'create-post'}" class="text-decoration-none">
                <a class="dropdown-item" href="#">Nouvel Article</a>
              </router-link>
            </li>
          </ul>

        </li>

        <li v-if="!isLoggedIn" class="nav-item dropdown">

          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Connexion/inscription
          </a>

          <ul class="dropdown-menu">
            <li>
              <router-link :to="{name: 'register'}" class="text-decoration-none">
                <a class="dropdown-item" href="#">S'incrire</a>
              </router-link>
            </li>
            <li>
              <router-link :to="{name: 'login'}" class="text-decoration-none">
                <a class="dropdown-item" href="#">Connexion</a>
              </router-link>
            </li>
          </ul>

        </li>



        <li v-else class="nav-item dropdown">

          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Bienvenue
          </a>

          <ul class="dropdown-menu">
            <li>
              <router-link :to="{name: 'profile'}" class="text-decoration-none">
                <a class="dropdown-item" href="#">Profile</a>
              </router-link>
            </li>
            <li>
              <router-link :to="{name: 'logout'}" class="text-decoration-none">
                <a class="dropdown-item" href="#">Déconnexion</a>
              </router-link>
            </li>
          </ul>

          </li>

      </ul>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
</template>

<script>

export default {
  name: 'TopNav',
  components: {},
  props: {
    isLoggedIn: Boolean
  },
  data(){
    return {}
  },
  methods: {},
  computed:{},
  mounted() {
    console.log('isLoggedIn in TopNav:', this.isLoggedIn)
  }
}
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

</style>
