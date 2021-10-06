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
  // import qs from 'qs'
  import AppPageHeader from '~/components/app/layout/AppPageHeader';
  import MultiChart from '~/components/widgets/chart/MultiChart';

  const loRound = require('lodash/round');
  
  const debug = require('debug')('app:page.echarts');
  const isLog = false;
  const isDebug = false;

    
  export default {
    components: {
      AppPageHeader,
      MultiChart
    },
    props: {
      owner: String,
      group: String
    },
    data() {
      return {
        title: this.$t(`${this.owner.toLowerCase()}.title`),
        description: this.$t(`${this.owner.toLowerCase()}.description`)
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
        const opcuaTags = OpcuaTag.findInStore({query: { ownerName: this.owner, type: 'variable.analog', $sort: {displayName: 1}}}).data;
        opcuaTags.forEach(tag => {
          if(this.values.length){
            const finded =  this.values.find(v => v.key === tag.browseName);
            if(finded){
              value = finded.value;
              value = (tag.dataType === 'Double') ? loRound(value, 3) : value;
            }
          }
          const lowRange = tag.valueParams.engineeringUnitsRange.low;
          const highRange = tag.valueParams.engineeringUnitsRange.high;
          panels.push({
            panel: 'line',
            browseName: tag.browseName,
            displayName: tag.displayName, 
            name: tag.description,
            icon: 'mdi-chart-line',
            engineeringUnits: this.$t(`standardUnits.${tag.valueParams.engineeringUnits}.shortName`),
            range: `${this.$t('common.range')}: (${lowRange}, ${highRange})`,
            currentValue: value
          })
        })
        return panels;
      },
      values() {
        const {OpcuaValue} = this.$FeathersVuex;
        const opcuaValues = OpcuaValue.findInStore({query: { tagName: this.group, $sort: {createdAt: -1}}}).data;
        return opcuaValues.length? opcuaValues[0].values : [];
      }
    },
    methods: {
      
    }
  }
</script>
