<template>
  <div>
    <div
      v-if="isNoPanels"
      class="d-flex text-center justify-center align-center primary--text mt-16"
    >
      <span class="display-1">
        {{ $t("management.noData") }}
      </span>
    </div>

    <panels-chart
      v-if="isPanelsChart"
      :items="panels"
      :current-values="currentValues"
      :hist-values="tagHistValues"
      :number-changes="numberChanges"
    ></panels-chart>

    <tab-panels-chart
      v-if="isTabPanelsChart || (isTab2PanelsChart && isTablet)"
      :tab-items="tabItems"
      :current-values="currentValues"
      :hist-values="tagHistValues"
      :number-changes="numberChanges"
    ></tab-panels-chart>

    <tab2-panels-chart
      v-if="isTab2PanelsChart && !isTablet"
      :tab-items="tab2Items"
      :current-values="currentValues"
      :hist-values="tagHistValues"
      :number-changes="numberChanges"
      :start-hist="startHist"
    ></tab2-panels-chart>
  </div>
</template>

<script>
import MultiChart from "~/components/widgets/chart/MultiChart";
import PanelsChart from "~/components/widgets/chart/PanelsChart";
import TabPanelsChart from "~/components/widgets/chart/TabPanelsChart";
import Tab2PanelsChart from "~/components/widgets/chart/Tab2PanelsChart";
import moment from "moment";

import feathersClient from '~/plugins/auth/feathers-client';

const loRound = require("lodash/round");
const loMerge = require("lodash/merge");

const debug = require("debug")("app:comp.RtData");
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
        tab1: [], // [{ "name": "Common plant", "items": ["01"] }, ... ,  { "name": "Aggregate 1/1", "items": ["11"] }]
        tab2: [], // [{ "name": "Water", "items": ["VODA", "VODA_XOB"] }, ... , { "name": "Compression", "items": ["PS180", "GTT", "UKST", "RD"] },]
      },
      tagCurrentValues: {}, // e.g. { "CH_M51::01AMIAK:01T4": { isModified: true, value: 34.567 }, "CH_M51::01AMIAK:01P4_1": { isModified: false, value: 10.123 } }
      tagHistValues: {}, // e.g. { "CH_M51::01AMIAK:01T4": [["Time", "Value"], ... , ["2021-10-22T14:25:55", 34.567]] }
      isPanelsChart: false,
      isTabPanelsChart: false,
      isTab2PanelsChart: false,
      isNoPanels: false,
      countItems: 0,
      numberChanges: 0,
    };
  },
  created: function () {
    this.getPanelsChartType();
  },
  mounted: function () {
    this.$nextTick(function () {});
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
          dataType: tag.dataType,
          engineeringUnits,
          range: `${this.$t(
            "common.range"
          )}: (${lowRange}, ${highRange}) ${engineeringUnits}`,
        });
      });
      return panels;
    },

    /**
     * @method  currentValues
     * @returns Object[]
     * e.g. { "CH_M51::01AMIAK:01T4": { isModified: true, value: 34.567 }, "CH_M51::01AMIAK:01P4_1": { isModified: false, value: 10.123 } }
     */
    currentValues() {
      const { OpcuaValue } = this.$FeathersVuex;
      const opcuaValues = OpcuaValue.findInStore({
        query: { tagName: this.group, $sort: { updatedAt: -1 }, $limit: 1 },
      }).data;

      if (!opcuaValues.length)
        if (isDebug)
          debug("currentValues.opcuaValues.length", opcuaValues.length);

      if (opcuaValues.length && opcuaValues[0].values.length) {
        // Check new update values
        if (this.tagHistValues["updatedAt"] !== opcuaValues[0]["updatedAt"]) {
          // Update time
          this.tagHistValues["updatedAt"] = opcuaValues[0]["updatedAt"];

          // Get tagHistValues
          if (Object.keys(this.tagHistValues).length === 1) {
            this.getTagHistValues();
            if (isLog)
              debug("currentValues.tagHistValues:", this.tagHistValues);
          }
          //e.g. opcuaValues[0].values = [{key: 'CH_M51::01AMIAK:01T4', value: 55.789}, ... , {key: 'CH_M51::01AMIAK:01P4_1', value: 55.789}]
          opcuaValues[0].values.forEach((valueItem) => {
            valueItem.value = loRound(valueItem.value, 3);

            // --- Add values to tagHistValues ---
            if (this.numberChanges > 1) {
              this.tagHistValues[valueItem.key].push([
                moment(opcuaValues[0]["updatedAt"]).format(
                  "YYYY-MM-DDTHH:mm:ss"
                ),
                valueItem.value,
              ]);
            }

            // --- Add values to tagCurrentValues ---
            if (!this.tagCurrentValues[valueItem.key]) {
              this.tagCurrentValues[valueItem.key] = {
                isModified: true,
                value: valueItem.value,
              };
            } else {
              const oldValue = this.tagCurrentValues[valueItem.key].value;
              this.tagCurrentValues[valueItem.key].isModified =
                oldValue !== valueItem.value;
              if (oldValue !== valueItem.value) {
                this.tagCurrentValues[valueItem.key].value = valueItem.value;
              }
            }
          });
          if (isLog)
            debug("currentValues.tagCurrentValues:", this.tagCurrentValues);
          this.numberChanges++;
        }
      }
      return this.tagCurrentValues;
    },

    startHist() {
      debug('startHist:', Object.keys(this.tagHistValues).length);
      return Object.keys(this.tagHistValues).length > 1;
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
      this.countItems = this.countItems + 1;
      debug("tab2Items.countItems:", this.countItems);

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
  },
  methods: {
    async getTagHistValues() {
      /* e.g. opcuaValues = [{
       *  tagName: 'CH_M51::ValueFromFile',
       *  updatedAt: '2021-10-21T04:51:30.275+00:00',
       *  values: [{ key: 'CH_M51::01AMIAK:01T4', value: 55.789 }, ...{ key: 'CH_M51::01AMIAK:01P4_1', value: 55.789 }]
       *  }, ...]
       */
      const serverUrl = 'http://localhost:3030';
      const id = 'ua-cherkassy-azot-asutp_dev1';

      // Get start time
      const start = moment(0);
      // Get end time
      const end = moment();

      const data = {
        id,
        action: 'opcuaClient',
        opcuaAction: 'sessionReadHistoryValues',
        opcuaURL: serverUrl,
        opcuaCallback: 'cbSessionReadHistoryValues',
        nameNodeIds: this.group,
        start,
        end,
      };
      const service = feathersClient.service("data-management");
      const opcuaValues = await service.create(data);
      // debug("sessionReadHistoryValues.actionResult:", actionResult);

      // const { OpcuaValue } = this.$FeathersVuex;
      // const opcuaValues = OpcuaValue.findInStore({
      //   query: { tagName: this.group, $sort: { updatedAt: 1 } },
      // }).data;

      if (isDebug)
        debug("getTagHistValues.opcuaValues.length", opcuaValues.length);

      if (opcuaValues.length) {
        opcuaValues.forEach((item) => {
          if (item.values.length) {
            // const updatedAt = moment(item["updatedAt"]).utc().format("YYYY-MM-DDTHH:mm:ss");
            const updatedAt = moment(item["updatedAt"]).format(
              "YYYY-MM-DDTHH:mm:ss"
            );
            item.values.forEach((valueItem) => {
              if (!this.tagHistValues[valueItem.key]) {
                this.tagHistValues[valueItem.key] = [["Time", "Value"]];
              }
              this.tagHistValues[valueItem.key].push([
                updatedAt,
                loRound(valueItem.value, 3),
              ]);
            });
          }
        });
      }
      return this.tagHistValues;
    },
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
      } else {
        this.isNoPanels = true;
      }
    },
  },
};
</script>
