<template>
  <div>
    <!--=== Page Header ===-->
    <app-page-header
      :page-title="description"
    ></app-page-header>
    
    <!--=== RtData ===-->
    <rt-data
      :owner="owner"
      :group="group"
    ></rt-data>
  </div>
</template>

<script>
  import AppPageHeader from '~/components/app/layout/AppPageHeader';
  import RtData from '~/components/widgets/chart/RtData';
  
  export default {
    components: {
      AppPageHeader,
      RtData
    },
    data() {
      const owner = 'CH_M51';
      const group = 'CH_M51::ValueFromFile';
      return {
        title: this.$t(`${owner.toLowerCase()}.title`),
        description: this.$t(`${owner.toLowerCase()}.description`),
        owner,
        group
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
        // console.log('numberOfValues.count:', this.numberOfValues);
        // console.log('getPanels.panels:', this.panels);
      })
    },
  }
</script>
