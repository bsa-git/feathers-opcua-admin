<template>
  <div>
    {{ code }}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        code: '<template>\n' +
          '  <v-treeview :items="items"></v-treeview>\n' +
          '</template>'
      }
    }
  }
</script>
