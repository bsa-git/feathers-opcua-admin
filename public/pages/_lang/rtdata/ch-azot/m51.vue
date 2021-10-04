<template>
  <div>
    <!--=== Page Header ===-->
    <app-page-header
      :page-title="description"
    ></app-page-header>

    <!--=== Multi-Chart ===-->
    <multi-chart
      :items="panels"
    ></multi-chart>
  </div>
</template>

<script>
  import AppPageHeader from '~/components/app/layout/AppPageHeader';
  import MultiChart from '~/components/widgets/chart/MultiChart';
  
  const debug = require('debug')('app:page.echarts');
  const isLog = false;
  const isDebug = false;

  const OpcuaOwnerName = 'CH_M51';
  const OpcuaOwnerGroup = 'CH_M51::ValueFromFile';

  
  export default {
    components: {
      AppPageHeader,
      MultiChart
    },
    data() {
      return {
        title: this.$t('ch_m51.title'),
        description: this.$t('ch_m51.description'),
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
    created: function () {
    },
    mounted: function () {
      this.$nextTick(function () {
        // console.log('numberOfValues.count:', this.numberOfValues);
        // console.log('getPanels.panels:', this.panels);
      })
    },
    computed: {
      panels() {
        const panels = [];
        let value = 0;
        //----------------------
        const {OpcuaTag} = this.$FeathersVuex;
        const opcuaTags = OpcuaTag.findInStore({query: { ownerName: OpcuaOwnerName, type: 'variable.analog', $sort: {displayName: 1}}}).data;
        opcuaTags.forEach(tag => {
          if(this.values.length){
            const finded =  this.values.find(v => v.key === tag.browseName);
            if(finded){
              value = finded.value;
              // if(tag.browseName === 'CH_M51::01PGAZ:01T16'){
              //   console.log('CH_M51::01PGAZ:01T16=', value);
              // }
            }
          }
          panels.push({
            panel: 'line',
            browseName: tag.browseName,
            displayName: tag.displayName, 
            // name: `${tag.displayName} (${tag.description})`,
            name: tag.description,
            icon: 'mdi-chart-line',
            lowRange: tag.valueParams.engineeringUnitsRange.low,
            highRange: tag.valueParams.engineeringUnitsRange.high,
            engineeringUnits: tag.valueParams.engineeringUnits,
            currentValue: value
          })
        })
        return panels;
      },
      values() {
        const {OpcuaValue} = this.$FeathersVuex;
        const opcuaValues = OpcuaValue.findInStore({query: { tagName: OpcuaOwnerGroup, $sort: {createdAt: 0}}}).data;
        return opcuaValues.length? opcuaValues[0].values : [];
      }
    },
    methods: {
      
    }
  }
</script>
