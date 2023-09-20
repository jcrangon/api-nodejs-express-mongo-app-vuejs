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
  name: 'NotFoundPage',
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
  methods: {},
  computed:{},
  mounted() {}
}
</script>

<style scoped>
main {
  min-height: 800px;
}
</style>
