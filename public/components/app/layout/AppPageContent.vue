<template>
  <v-main>
    <!-- Page Content  -->
    <v-container
      id="page-content"
      class="mb-10"
      fluid
    >
      <nuxt></nuxt>
    </v-container>
    <!-- Page Footer -->
    <v-divider></v-divider>
    <app-footer
      :copyright="config.copyright"
      :developer="config.logoTitle"
      :site="config.website"
    ></app-footer>
  </v-main>
</template>

<script>
  import {mapGetters} from 'vuex';
  import AppFooter from '~/components/layout/Footer';

  export default {
    components: {
      AppFooter,
    },
    props: {
      refAppToolbar: Object,
    },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        config: 'getConfig',
      })
    }
  }
</script>

<style lang="sass" scoped>
  #page-content
    min-height: calc(100vh - 64px - 60px)
</style>
