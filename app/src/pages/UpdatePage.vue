<template>
  <div>
    <TopNav :isLoggedIn="isLoggedIn" />

    <main class="position-relative">
      <div class="container mt-5">

        <form @submit.prevent="updatePost" enctype="multipart/form-data">
          <div class="errors" v-if="userErrors.length" >
            <ul>
              <li v-for="error in userErrors" :key="error.msg">
                {{ error.msg }}
              </li>
            </ul>
          </div>
          <div class="form-group mb-4">
            <label for="title">Image de couverture:</label>
            <p><img :src="`${imgFolderUrl}${post.cover}`" crossorigin="anonymous" alt="post cover" class="cover"></p>
            
            <input type="file" class="form-control mt-4" @change="onFileSelection($event)">
          </div>
          <div class="form-group mb-4">
            <label for="title">Titre:</label>
            <input type="text" class="form-control" v-model="post.title" id="title" required>
          </div>
          <div class="form-group mb-4">
            <label for="content">Contenu:</label>
            <!-- <textarea class="form-control" v-model="post.content" id="content" rows="4" required></textarea> -->
            <TinyMCEEditor :editorId="editorId" @input="onContentChange($event)" id="content" :editorDefaultVal="editorDefaultVal" @editorInitialized="editorInitialized"/>
          </div>
          <div class="form-group">
            <label for="content">Extrait:</label>
            <textarea class="form-control" v-model="post.extract" id="content" rows="3" maxlength="250" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary mt-3">Enregistrer</button>
        </form>

      </div>
    </main>

    <FooterComponent />

  </div>
</template>

<script>
import TopNav from '../components/TopNav'
import FooterComponent from '../components/FooterComponent'
import TinyMCEEditor from '../components/TinyMCEEditor'
import fetchWithAuthor from '../middleware/FetchWithAuthor.middleware'

export default {
  name: 'UpdatePage',
  components: {
    TopNav,
    FooterComponent,
    TinyMCEEditor,
  },
  props: {
    api: Object,
    utils: Object,
  },
  data(){
    return {
      isLoggedIn: this.utils.checkLogin(),
      userErrors: [],
      post: {
          title: '',
          content: '',
          extract: '',
          cover: '',
      },
      selectedFile: null,
      editorId: 'my-editor',
      editorDefaultVal:'',
      imgFolderUrl: this.api.imgFolderUrl,
      postId: this.$route.params.id
    }
  },
  methods: {
    onContentChange(content) {
      // console.log(content)
      this.post.content = content
      console.log(this.post.content)
    },
    onFileSelection(e){
      this.selectedFile = e.target.files[0]
      console.log(this.selectedFile)
    },
    editorInitialized(message) {
      console.log(message)
      this.getPost()
    },
    getPost() {
      fetch(this.api.singlePost(this.$route.params.id),{credentials: "include",})
        .then(response => {
            if (!response.ok) {
            throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(data => {
            // Mettre à jour la propriété 'posts' avec les données de l'API
            // console.log(data)
            this.post = data.post;
            this.editorDefaultVal = this.post.content
            // console.log('sending data to editor:', this.post.content)
            
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
    },
    async updatePost() {
      this.userErrors = []
      let formData = new FormData()
      formData.append('method', 'POST')
      formData.append('title', this.post.title)
      formData.append('content', this.post.content)
      formData.append('extract', this.post.extract)
      formData.append('userId', this.post.userId)
      if(this.selectedFile){
        formData.append('imageFile', this.selectedFile, this.selectedFile.name)
      }
      
      try {
          // const token = localStorage.getItem('myblogtoken')
          const response = await fetchWithAuthor(this.api.updatePost(this.postId), {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
            },
            body: formData,
            credentials: "include",
          });

          if (response.ok) {
            console.log('Publication modifiée avec succès')
            this.$router.push({name: 'home'})
          } else {
            throw new Error('Erreur lors de la modification de la publication')
          }
      } catch (error) {
          console.error(error.message);
          this.userErrors.push({msg: error.message})
      }
    }
  },
  computed:{},
  mounted() {
  }
}
</script>

<style scoped>
main {
  min-height: 800px;
  margin: 0 auto;
  max-width: 100%;
}
.cover {
  width: 250px;
}
</style>
