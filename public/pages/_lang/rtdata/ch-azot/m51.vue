<template>
  <div>
    <!--=== Page Header ===-->
    <app-page-header
      :page-title="description"
    ></app-page-header>

    <!--=== Multi-Chart ===-->
    <multi-chart
      :items="items"
    ></multi-chart>
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
        title: this.$t('ch_m51.title'),
        description: this.$t('ch_m51.description'),
        items: [
          {
            panel: 'bar',
            name: this.$t('echartDemo.barTitle'),
            icon: 'mdi-chart-bar'
          },
          {
            panel: 'pie',
            name: this.$t('echartDemo.pieTitle'),
            icon: 'mdi-chart-pie'
          },
          {
            panel: 'polar',
            name: this.$t('echartDemo.polarTitle'),
            icon: 'mdi-chart-donut'
          },
          {
            panel: 'scatter',
            name: this.$t('echartDemo.scatterTitle'),
            icon: 'mdi-chart-scatter-plot'
          },
          {
            panel: 'map',
            name: this.$t('echartDemo.mapTitle'),
            icon: 'mdi-chart-bubble'
          },
          {
            panel: 'radar',
            name: this.$t('echartDemo.radarTitle'),
            icon: 'mdi-chart-donut-variant'
          },
          {
            panel: 'connect',
            name: this.$t('echartDemo.connectTitle'),
            icon: 'mdi-chart-scatter-plot-hexbin'
          },
          {
            panel: 'flight',
            name: this.$t('echartDemo.flightTitle'),
            icon: 'mdi-chart-multiline'
          },
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
    mounted: function () {
      this.$nextTick(function () {
        console.log('numberOfValues.count:', this.numberOfValues);
      })
    },
    computed: {
      numberOfValues() {
        const idFieldOpcuaValue = this.$store.state['opcua-values'].idField;
        const {OpcuaValue} = this.$FeathersVuex;
        const opcuaValues = OpcuaValue.findInStore({query: { tagName: 'CH_M51::ValueFromFile', $sort: {fullName: 1}}}).data;
        // if(opcuaValues && opcuaValues.length){
        //   console.log('numberOfValues.count:', opcuaValues.length);
        // }
        return opcuaValues.length;
      }
    }
  }
</script>
