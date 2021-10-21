<template>
  <div>
    <panels-chart v-if="isPanelsChart" :items="panels"></panels-chart>

    <tab-panels-chart
      v-if="isTabPanelsChart || (isTab2PanelsChart && isTablet)"
      :tab-items="tabItems"
    ></tab-panels-chart>

    <tab2-panels-chart
      v-if="isTab2PanelsChart && !isTablet"
      :tab-items="tab2Items"
      :tab-values="tab2Values"
    ></tab2-panels-chart>
  </div>
</template>

<script>
import MultiChart from "~/components/widgets/chart/MultiChart";
import PanelsChart from "~/components/widgets/chart/PanelsChart";
import TabPanelsChart from "~/components/widgets/chart/TabPanelsChart";
import Tab2PanelsChart from "~/components/widgets/chart/Tab2PanelsChart";

const loRound = require("lodash/round");
const loMerge = require("lodash/merge");

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
    isMobile: function () {
      return this.$vuetify.breakpoint.xsOnly;
    },
    isTablet: function () {
      return this.$vuetify.breakpoint.smAndDown;
    },
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
        const tagHistValues = [["Time", "Value"]];
        //------------------------
        // if (this.values.length) {
        //   const finded = this.values.find((v) => v.key === tag.browseName);
        //   if (finded) {
        //     value = finded.value;
        //     value = tag.dataType === "Double" ? loRound(value, 3) : value;
        //   }
        // }
        // if (this.histValues.length) {
        //   this.histValues.forEach((histValue) => {
        //     value = 0;
        //     if (histValue.values.length) {
        //       const finded = histValue.values.find(
        //         (v) => v.key === tag.browseName
        //       );
        //       if (finded) {
        //         value = finded.value;
        //         value = tag.dataType === "Double" ? loRound(value, 3) : value;
        //       }
        //     }
        //     tagHistValues.push([histValue['createdAt'], value]);
        //   });
        // }
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
          // currentValue: value,
          // histValues: tagHistValues
        });
      });
      return panels;
    },
    panelValues() {
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
        const tagHistValues = [["Time", "Value"]];
        //------------------------
        if (this.values.length) {
          const finded = this.values.find((v) => v.key === tag.browseName);
          if (finded) {
            value = finded.value;
            value = tag.dataType === "Double" ? loRound(value, 3) : value;
          }
        }
        if (this.histValues.length) {
          this.histValues.forEach((histValue) => {
            value = 0;
            if (histValue.values.length) {
              const finded = histValue.values.find(
                (v) => v.key === tag.browseName
              );
              if (finded) {
                value = finded.value;
                value = tag.dataType === "Double" ? loRound(value, 3) : value;
              }
            }
            tagHistValues.push([histValue['createdAt'], value]);
          });
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
          histValues: tagHistValues
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
    histValues() {
      const { OpcuaValue } = this.$FeathersVuex;
      const opcuaValues = OpcuaValue.findInStore({
        query: { tagName: this.group, $sort: { createdAt: 1 } },
      }).data;
      return opcuaValues.length ? opcuaValues : [];
    },
    // Get tabItems for tab1
    tabItems() {
      const tabItems = [];
      this.tabs.tab1.forEach((tab, index) => {
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
            }
          });
          return result;
        });
        tabItems.push({
          tabName: tab.name,
          tabPanels,
        });
      });
      return tabItems;
    },
    // Get tabItems for tab1 and tab2
    tab2Items() {
      const tab1Items = [];
      this.tabs.tab1.forEach((tab1, index) => {
        const tab2Items = [];
        // Get tabPanels for tab1
        const tab1Panels = this.panels.filter((panel) => {
          let result = false;
          let browseName = panel.browseName; // CH_M51::01AMIAK:01T4
          let browseNames = browseName.split("::");
          if (browseNames.length > 1) {
            browseName = browseNames[1];
            browseNames = browseName.split(":");
          }
          tab1.items.forEach((item) => {
            if (!result) {
              result = browseNames[0].includes(item);
            }
          });
          return result;
        });

        // Get tabItems for tab2
        this.tabs.tab2.forEach((tab2, index) => {
          let result = false;
          const tab2Panels = tab1Panels.filter((panel) => {
            result = false;
            let browseName = panel.browseName; //e.g. CH_M51::01AMIAK:01T4
            let browseNames = browseName.split("::");
            if (browseNames.length > 1) {
              browseName = browseNames[1];
              browseNames = browseName.split(":");
            }
            tab2.items.forEach((item) => {
              if (!result) {
                result = browseNames[0].includes(item);
                if (!result && browseNames.length > 1) {
                  result = browseNames[1].includes(item);
                }
              }
            });
            return result;
          });
          if (tab2Panels && tab2Panels.length) {
            tab2Items.push({
              tab2Name: tab2.name,
              tab2Panels: tab2Panels,
            });
          }
        });
        tab1Items.push({
          tab1Name: tab1.name,
          tab1Panels,
          tab2Items,
        });
      });
      return tab1Items;
    },
    // Get tabValues for tab1 and tab2
    tab2Values() {
      const tab1Items = [];
      this.tabs.tab1.forEach((tab1, index) => {
        const tab2Items = [];
        // Get tabPanels for tab1
        const tab1Panels = this.panelValues.filter((panel) => {
          let result = false;
          let browseName = panel.browseName; // CH_M51::01AMIAK:01T4
          let browseNames = browseName.split("::");
          if (browseNames.length > 1) {
            browseName = browseNames[1];
            browseNames = browseName.split(":");
          }
          tab1.items.forEach((item) => {
            if (!result) {
              result = browseNames[0].includes(item);
            }
          });
          return result;
        });

        // Get tabItems for tab2
        this.tabs.tab2.forEach((tab2, index) => {
          let result = false;
          const tab2Panels = tab1Panels.filter((panel) => {
            result = false;
            let browseName = panel.browseName; //e.g. CH_M51::01AMIAK:01T4
            let browseNames = browseName.split("::");
            if (browseNames.length > 1) {
              browseName = browseNames[1];
              browseNames = browseName.split(":");
            }
            tab2.items.forEach((item) => {
              if (!result) {
                result = browseNames[0].includes(item);
                if (!result && browseNames.length > 1) {
                  result = browseNames[1].includes(item);
                }
              }
            });
            return result;
          });
          if (tab2Panels && tab2Panels.length) {
            tab2Items.push({
              tab2Name: tab2.name,
              tab2Panels: tab2Panels,
            });
          }
        });
        tab1Items.push({
          tab1Name: tab1.name,
          tab1Panels,
          tab2Items,
        });
      });
      return tab1Items;
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

        this.isPanelsChart = !isTab1 && !isTab2;
        this.isTabPanelsChart = isTab1 && !isTab2;
        this.isTab2PanelsChart = isTab1 && isTab2;

        // this.isPanelsChart = false;
        // this.isTabPanelsChart = false;
        // this.isTab2PanelsChart = true;

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
