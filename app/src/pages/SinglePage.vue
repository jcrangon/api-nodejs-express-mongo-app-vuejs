<template>
  <div v-if="post">
    <TopNav :isLoggedIn="isLoggedIn" />
    <div class="iconbar">
      <router-link :to="{ name: 'home'}" class="iconbar text-decoration-none"><i class="fa-solid fa-list me-2"></i><small>Retour à la liste</small></router-link>
    </div>
    
    <h1 class="text-center mt-5">{{ post.title }}</h1>

    <p class="text-center"><small><strong>Publié le:</strong> {{ utils.formatDateTime(post.createdAt) }}</small></p>

    <main class="position-relative">
      <div class="container mt-5">
        <div class="text-center">
          <img class="w-100 img-responsive cover" crossorigin="anonymous" :src="`${imgFolderUrl}${post.cover}`" alt=""/>
        </div>
        <div class="mt-5" v-html="post.content"></div>

        <div class="bottom-nav d-flex flex-row justify-content-between align-items-end p-0">
          <div>
            <button class="btn btn-outline-secondary" :class="{'disabled': prev === null}" @click="navigatePrev" role="link"><i class="fa-solid fa-backward fa-fade"></i>Article Précédent<br></button>
          </div>

          <div>

            <button class="btn btn-outline-secondary" :class="{'disabled': next === null}" @click="navigateNext" role="link"><i class="fa-solid fa-forward fa-fade"></i>Article Suivant<br></button>

          </div>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import TopNav from '../components/TopNav'
import FooterComponent from '../components/FooterComponent'

export default {
  name: 'SinglePage',
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
      post: Object,
      imgFolderUrl: this.api.imgFolderUrl,
      prev:null,
      next:null,
    }
  },
  methods: {
    getPost() {
      fetch(this.api.singlePost(this.$route.params.id))
        .then(response => {
            if (!response.ok) {
            throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(data => {
            // Mettre à jour la propriété 'posts' avec les données de l'API
            console.log(data)
            this.post = data.post;
            console.log(this.post);
            this.prev = data.prev
            this.next = data.next
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
    },
    async navigateNext() {
      await this.$router.push({name:'single-post', params: { id: this.next }})
      this.$router.go(0)
    },
    async navigatePrev() {
      await this.$router.push({name:'single-post', params: { id: this.prev }})
      this.$router.go(0)
    },
  },
  computed:{},
  mounted() {
    this.getPost()
  }
}
</script>

<style scoped>
main {
  min-height: 800px;
  width: 900px;
  max-width: 100%;
  margin: 0 auto;
}
.bottom-nav {
  margin-top: 120px;
}
.iconbar {
  width: 900px;
  max-width: 100%;
  margin: 0 auto;
}
</style>
