<template>
  <div>
    <!--=== Page Header ===-->
    <app-page-header
      :page-title="description"
    ></app-page-header>
    <!--=== Services Graphql ===-->
    <services-graphql
      :sel-title="selTitle"
      :sel-tooltip="selTooltip"
      :tabs="tabs"
      :items="items"
    ></services-graphql>
  </div>
</template>

<script>
  import AppPageHeader from '~/components/app/layout/AppPageHeader';
  import ServicesGraphql from '~/components/app/services/graphql';
  import graphqlQuery from '~/api/app/graphql/graphql-query';

  export default {
    components: {
      AppPageHeader,
      ServicesGraphql,
    },
    data() {
      return {
        title: this.$t('graphql.title'),
        description: this.$t('graphql.description'),
        selTitle: this.$t('graphql.findData'),
        selTooltip: this.$t('graphql.findData'),
        tabs: ['Users', 'Roles', 'Teams'],
        items: [
          {key: 'findUser', value: graphqlQuery.findUser},
          {key: 'findRole', value: graphqlQuery.findRole},
          {key: 'findTeam', value: graphqlQuery.findTeam},
        ],
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          {hid: 'description', name: 'description', content: this.description}
        ],
      }
    },
  }
</script>
