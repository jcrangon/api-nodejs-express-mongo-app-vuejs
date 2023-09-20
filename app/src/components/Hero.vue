<template>
  <div class="position-relative">
    <img :src="imgSrc" alt="hero" class="img-fluid"/>
    <div class="position-absolute d-flex flex-column justify-content-center align-items-center" style="width:100%; height: 100%; top:0; left:0;">
      <button class="btn btn-warning m-3  cta">
        <a href="#list" class="text-decoration-none text-white">Voir les articles</a>
      </button>
    </div>
  </div>
</template>

<script>
import imgSrc from "../assets/hero.png"

export default {
  name: 'HeroComponent',
  components: {},
  props: {},
  data(){
    return {
      imgSrc: imgSrc
    }
  },
  methods: {},
  computed:{},
  mounted() {}
}
</script>

<style scoped>
.cta {
  width: 270px;
  height: 80px;
  font-size: 25px;
  font-weight: bold;
}
.text-decoration-none {
  text-decoration: none;
}
</style>
