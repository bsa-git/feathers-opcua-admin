<template>
  <div>
    <!--=== Multi-Chart ===-->
    <!-- <multi-chart
      :items="panels"
    ></multi-chart> -->

    <panels-chart 
      v-if="isPanelsChart" 
      :items="panels"
    ></panels-chart>

    <tab-panels-chart
      v-if="isTabPanelsChart"
      :items="panels"
      :tab-items="tabItems"
    ></tab-panels-chart>

    <tab2-panels-chart
      v-if="isTab2PanelsChart"
      :items="panels"
    ></tab2-panels-chart>
  </div>
</template>

<script>
import MultiChart from "~/components/widgets/chart/MultiChart";
import PanelsChart from "~/components/widgets/chart/PanelsChart";
import TabPanelsChart from "~/components/widgets/chart/TabPanelsChart";
import Tab2PanelsChart from "~/components/widgets/chart/Tab2PanelsChart";

const loRound = require("lodash/round");

const debug = require("debug")("app:page.echarts");
const isLog = false;
const isDebug = false;

export default {
  components: {
    MultiChart,
    PanelsChart,
    TabPanelsChart,
    Tab2PanelsChart,
  },
  props: {
    owner: String,
    group: String,
  },
  data() {
    return {
      title: this.$t(`${this.owner.toLowerCase()}.title`),
      description: this.$t(`${this.owner.toLowerCase()}.description`),
      tabs: {
        tab1: [],
        tab2: [],
      },
      isPanelsChart: false,
      isTabPanelsChart: false,
      isTab2PanelsChart: false,
    };
  },
  created: function () {
    this.getPanelsChartType();
  },
  mounted: function () {
    this.$nextTick(function () {
      // console.log('getPanels.panels:', this.panels);
    });
  },
  computed: {
    panels() {
      const panels = [];
      let value = 0;
      //----------------------
      const { OpcuaTag } = this.$FeathersVuex;
      const opcuaTags = OpcuaTag.findInStore({
        query: {
          ownerName: this.owner,
          type: "variable.analog",
          $sort: { displayName: 1 },
        },
      }).data;
      opcuaTags.forEach((tag) => {
        if (this.values.length) {
          const finded = this.values.find((v) => v.key === tag.browseName);
          if (finded) {
            value = finded.value;
            value = tag.dataType === "Double" ? loRound(value, 3) : value;
          }
        }
        const lowRange = tag.valueParams.engineeringUnitsRange.low;
        const highRange = tag.valueParams.engineeringUnitsRange.high;
        const engineeringUnits = this.$t(
          `standardUnits.${tag.valueParams.engineeringUnits}.shortName`
        );
        panels.push({
          panel: "line",
          browseName: tag.browseName,
          displayName: tag.displayName,
          name: tag.description,
          icon: "mdi-chart-line",
          engineeringUnits,
          range: `${this.$t(
            "common.range"
          )}: (${lowRange}, ${highRange}) ${engineeringUnits}`,
          currentValue: value,
        });
      });
      return panels;
    },
    values() {
      const { OpcuaValue } = this.$FeathersVuex;
      const opcuaValues = OpcuaValue.findInStore({
        query: { tagName: this.group, $sort: { createdAt: -1 } },
      }).data;
      return opcuaValues.length ? opcuaValues[0].values : [];
    },
    tabItems() {
      const tabItems = [];
      this.tabs.tab1.forEach((tab) => {
        const tabPanels = this.panels.filter((panel) => {
          let result = false;
          let browseName = panel.browseName; // CH_M51::01AMIAK:01T4
          let browseNames = browseName.split("::");
          if (browseNames.length > 1) {
            browseName = browseNames[1];
            browseNames = browseName.split(":");
          }
          tab.items.forEach((item) => {
            if (!result) {
              result = browseNames[0].includes(item);
              // if (!result && browseNames.length > 1) {
              //   result = browseNames[1].includes(item);
              // }
            }
          });
          return result;
        });
        tabItems.push({
          tabName: tab.name,
          tabPanels
        })
      });
      return tabItems;
    },
  },
  methods: {
    getPanelsChartType() {
      const { OpcuaTag } = this.$FeathersVuex;
      const objectTags = OpcuaTag.findInStore({
        query: { browseName: this.owner, type: "object" },
      }).data;
      if (objectTags.length) {
        const objectTag = objectTags[0];
        const isTab1 =
          objectTag.tabs && objectTag.tabs.tab1 && !!objectTag.tabs.tab1.length;
        const isTab2 =
          objectTag.tabs && objectTag.tabs.tab2 && !!objectTag.tabs.tab2.length;
        
        // this.isPanelsChart = !isTab1 && !isTab2;
        // this.isTabPanelsChart = isTab1 && !isTab2;
        // this.isTab2PanelsChart = isTab1 && isTab2;

        this.isPanelsChart = false;
        this.isTabPanelsChart = true;
        this.isTab2PanelsChart = false;

        if (this.isTabPanelsChart) {
          this.tabs.tab1 = objectTag.tabs.tab1;
        }
        if (this.isTab2PanelsChart) {
          this.tabs.tab1 = objectTag.tabs.tab1;
          this.tabs.tab2 = objectTag.tabs.tab2;
        }
      }
    },
  },
};
</script>
