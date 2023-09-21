<template>
  <div>
    <TopNav :isLoggedIn="isLoggedIn" />

    <FooterComponent />
  </div>
</template>

<script>
import TopNav from '../components/TopNav'
import FooterComponent from '../components/FooterComponent'

export default {
  name: 'ProfilePage',
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
  max-width: 100%;
  margin: 0 auto;
}
</style>
