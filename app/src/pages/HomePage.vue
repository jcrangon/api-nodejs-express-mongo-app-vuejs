<template>
  <div>
    <TopNav :isLoggedIn="isLoggedIn" />
    <HeroComponent />
    

    <h1 class="text-center mt-5">Mon Blog de Voyage</h1>

    <main class="position-relative" id="list">

      
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import TopNav from '../components/TopNav'
import HeroComponent from '../components/Hero'
import FooterComponent from '../components/FooterComponent'

export default {
  name: 'HomePage',
  components: {
    TopNav,
    HeroComponent,
    FooterComponent,
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
  methods: {},
  computed:{},
  mounted() {
    // console.log(this.isLoggedIn)
  }
}
</script>

<style scoped>
  main {
    min-height: 800px;
  }
</style>
