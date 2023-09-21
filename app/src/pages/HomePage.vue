<template>
  <div>
    <TopNav :isLoggedIn="isLoggedIn" />
    <HeroComponent />
    

    <h1 class="text-center mt-5">Mon Blog de Voyage</h1>
    
    <main class="position-relative" id="list">
      <div class="container mt-5">

        <div v-if="isLoading && !postList.length" class="text-center">Loading...</div>

        <div v-if="!isLoading && !postList.length" class="text-center">Aucun Posts trouvés...</div>

        <div v-if="!isLoading && postList.length">
          <PostList :postList="postList"  :imgFolderUrl="imgFolderUrl" :myUtils="myUtils" :isLoggedIn="isLoggedIn" @deleteOnePost="deletePost($event)"/>
        </div>

      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import TopNav from '../components/TopNav'
import HeroComponent from '../components/Hero'
import FooterComponent from '../components/FooterComponent'
import PostList from '../components/PostList'
import fetchWithAuthor from '../middleware/FetchWithAuthor.middleware'

export default {
  name: 'HomePage',
  components: {
    TopNav,
    HeroComponent,
    FooterComponent,
    PostList,
  },
  props: {
    api: Object,
    utils: Object,
  },
  data(){
    return {
      isLoggedIn: this.utils.checkLogin(),
      isLoading: true,
      postList: [],
      page: 1,
      perPage: 3,
      endReached: false,
      lock: false,
      imgFolderUrl: this.api.imgFolderUrl,
      myUtils: this.utils,
    } 
  },
  methods: {
    getPosts: async function (page, perPage) {
      // console.log(this.page, this.perPage)
      if(this.endReached){
        return
      }
      if(this.lock){
        return
      }
      this.lock = true
      try{
        const response = await fetch(this.api.posts(page, perPage),{credentials: "include",})

        if(!response.ok){
          throw new Error('Erreur durant la récupération des articles')
        }

        const responseData = await response.json()
        
        // console.log(responseData)

        if(responseData.length){
          this.isLoading = false
          this.postList.push(...responseData)
          console.log(this.postList)
          this.page ++
          this.lock = false
        } else {
          this.endReached = true
        }

      } catch(error) {
        console.log(error.message)
      }
    },
    deletePost(post){
      console.log('deleting post: ', post._id)

        fetchWithAuthor(this.api.deletePost(post._id),{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post),
            credentials: "include",
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Erreur réseau');
            } else{
                this.$router.go(0) // reloads the page
            }
            
        })
        .catch(error => {
            console.error(error.message);
        });
    },
  },
  computed:{},
  mounted() {
    // console.log(this.isLoggedIn)
    this.getPosts(this.page, this.perPage)

    // Scroll Infini
    const main = document.querySelector('main')

    window.addEventListener('scroll', async () => {
      if (main.getBoundingClientRect().bottom < window.innerHeight) {
        await this.getPosts(this.page, this.perPage)
      }
    });

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
</style>
