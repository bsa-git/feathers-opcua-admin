<template>
  <div>
    <!--=== Page Header ===-->
    <app-page-header
      :page-title="description"
    ></app-page-header>

    <!--=== Multi-Chart ===-->
    <multi-chart></multi-chart>
  </div>
</template>

<script>
  import AppPageHeader from '~/components/app/layout/AppPageHeader';
  import MultiChart from '~/components/widgets/chart/MultiChart';
  
  const debug = require('debug')('app:page.echarts');
  const isLog = false;
  const isDebug = false;

  
  export default {
    components: {
      AppPageHeader,
      MultiChart
    },
    data() {
      return {
        title: this.$t('ch_m52.title'),
        description: this.$t('ch_m52.description'),
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
