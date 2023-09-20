<template>
  <div>
    <editor 
      :id="editorId" 
      v-model="contentValue"
      :api-key="API_KEY" 
      :init="editorConfig" 
    />
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'TinyMCEEditor',
  components: {
    editor: Editor,
  },
  props: {
    editorId: String,
    editorDefaultVal: String
  },
  data(){
    return {
      contentValue: '',
      API_KEY: process.env.TINYMCE_API_KEY,
      editorConfig: {
        selector: `#${this.editorId}`,
        height: 500,
        plugins:[
          'advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'
        ],

        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',

        setup: (editor) => {
          editor.on('init', () => {
            // Met à jour le contenu TinyMCE lorsque la valeur change
            editor.setContent(this.editorDefaultVal);
          });

          editor.on('input', () => {
            // Emet un événement 'input' lorsque le contenu change
            this.$emit('input', editor.getContent());
          });
        },
      }
    }
  },
  methods: {},
  computed:{},
  mounted() {

  },
}
</script>

<style scoped>
</style>
