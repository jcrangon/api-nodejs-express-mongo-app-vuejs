<template>
  <div v-if="isLoggedIn">
    <TopNav :isLoggedIn="isLoggedIn" />
    <h1 class="text-center mt-5">Nouvel Article</h1>

    <main class="position-relative">
      <div class="container mt-5">
        
        <form @submit.prevent="createPost" enctype="multipart/form-data">
          <div class="errors" v-if="userErrors.length" >
            <ul>
              <li v-for="error in userErrors" :key="error.msg">
                {{ error.msg }}
              </li>
            </ul>
          </div>
          <div class="form-group mb-4">
            <label for="title">Image de couverture:</label>
            <input type="file" class="form-control" @change="onFileSelection($event)">
          </div>
          <div class="form-group mb-4">
            <label for="title">Titre:</label>
            <input type="text" class="form-control" v-model="post.title" id="title" required>
          </div>
          <div class="form-group mb-4">
            <label for="content">Contenu:</label>
            <!-- <textarea class="form-control" v-model="post.content" id="content" rows="4" required></textarea> -->
            <TinyMCEEditor :editorId="editorId" @input="onContentChange($event)" id="content" :editorDefaultVal="editorDefaultVal"/>
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
  name: 'CreatePage',
  components: {
    TopNav,
    FooterComponent,
    TinyMCEEditor
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
          userId: this.utils.decodeToken() ? this.utils.decodeToken().sub : null,
      },
      selectedFile: null,
      editorId: 'my-editor',
      editorDefaultVal:'',
    }
  },
  methods: {
    onContentChange(content) {
      // console.log(content)
      this.post.content = content
    },
    async createPost() {
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
          const response = await fetchWithAuthor(this.api.addPost, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData,
            credentials: "include",
          });

          if (response.ok) {
            console.log('Publication crée avec succès')
            this.$router.push({name: 'home'})
          } else {
            throw new Error('Erreur lors de la creation de la publication')
          }
      } catch (error) {
          console.error(error.message);
          this.userErrors.push({msg: error.message})
      }
    },
    onFileSelection(e){
      this.selectedFile = e.target.files[0]
      console.log(this.selectedFile)
    }
  },
  computed:{},
  mounted() {
    if(!this.isLoggedIn){
      this.$router.go(-1)
      return
    }
  }
}
</script>

<style scoped>
main {
  min-height: 800px;
  max-width: 100%;
  margin: 0 auto;
}
form {
  max-width: 600px;
  margin: 0 auto;
}
.errors {
  color: red;
  background: pink;
  border: 1px solid red;
}
</style>
