<template>
  <div>
    <div v-for="post in postList" :key="post._id" class="post-item mb-5 ">

      <router-link :to="{ name: 'single-post', params: { id: post._id }}" class="text-decoration-none d-flex flex-row">

        <div class="img-container">
          <img class="img-responsive cover" crossorigin="anonymous" :src="`${imgFolderUrl}${post.cover}`" alt=""/>
        </div>


        <div class="text-container d-flex flex-column justify-content-between ">

            <div class="text-black">
              <h3 class="article-title">{{ post.title }}</h3>
              <div class="mt-3">{{ post.extract }}</div>
            </div>

            <div class="d-flex flex-row justify-content-end align-items-end">

              <p v-if="isLoggedIn && myUtils.isMyPost(post.userId)" @click.prevent="navigateToUpdate(post._id)" class="cpointer me-5 text-success m-0 p-0"> <i class="fa-solid fa-pen-to-square fa-beat"></i> Update post</p>

              <p v-if="isLoggedIn && myUtils.isMyPost(post.userId)" @click.prevent="deletePost(post)" class="cpointer text-danger m-0 p-0"> <i class="fa-solid fa-trash"></i></p>

            </div>
          
        </div>

      </router-link>
    
    </div>
  </div>
</template>

<script>

export default {
  name: 'PostList',
  components: {},
  props: {
    postList: Object,
    imgFolderUrl: String,
    myUtils: Object,
    isLoggedIn: Boolean,

  },
  data(){
    return {

    }
  },
  methods: {
    navigateToUpdate(id) {

        this.$router.push({name: 'update-post', params: { id: id}})
    },
    deletePost(post){
      this.$emit('deleteOnePost', post)
      
    },
  },
  computed:{},
  mounted() {
    console.log(this.imgFolderUrl)
  }
}
</script>

<style scoped>
.post-item {
  border: solid 5px palevioletred;
  border-radius: 4px;
}

.cover {
  height: 200px;
}

.img-container {
  width: 35%;
  display: flex;
  flex-direction: center;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.text-container {
  padding: 15px;
  width: 65%;
}

.article-title {
  color: palevioletred;
}
</style>
