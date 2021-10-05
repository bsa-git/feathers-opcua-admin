<template>
  <div>
    <!--=== Rt-Item ===-->
    <rt-item
      :owner="owner"
      :group="group"
    ></rt-item>
  </div>
</template>

<script>
  import RtItem from '~/components/widgets/chart/RtItem';
  
  export default {
    components: {
      RtItem
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
