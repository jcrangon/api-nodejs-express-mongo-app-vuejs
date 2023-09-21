<template>
  <div>
    <div v-if="!initialized">Loading Editor...</div>
    <editor 
      :id="editorId" 
      v-model="contentValue"
      :api-key="API_KEY" 
      :init="editorConfig"
      :class="{hidden: !initialized}"
      initial-value="editorDefaultVal"
      contenteditable="true"
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
  watch: {
    editorDefaultVal: async function(newVal) {
      if (this.editor) {
        await this.editor.setContent(newVal);
      }
      // console.log(newVal);
    },

  },
  data(){
    return {
      contentValue: '',
      API_KEY: process.env.TINYMCE_API_KEY,
      
      initialized: false,

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
            this.initialized = true
            editor.setContent(this.editorDefaultVal);
            this.editor = editor
            this.$emit('editorInitialized', 'done');
            console.log('initialized')
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
.hidden {
  visibility: hidden;
}
</style>
