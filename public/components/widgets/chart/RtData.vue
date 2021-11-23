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
      :hist-values="filterHistValues"
      :number-changes="numberChanges"
      :start-hist="startHist"
      :updated-at="updatedAt"
      :is-updated-at="isUpdatedAt"
      v-on:onTimeRange="modelTimeRange"
    ></panels-chart>

    <tab-panels-chart
      v-if="isTabPanelsChart || (isTab2PanelsChart && isTablet)"
      :tab-items="tabItems"
      :current-values="currentValues"
      :hist-values="filterHistValues"
      :number-changes="numberChanges"
      :start-hist="startHist"
      :updated-at="updatedAt"
      :is-updated-at="isUpdatedAt"
      v-on:onTimeRange="modelTimeRange"
    ></tab-panels-chart>

    <tab2-panels-chart
      v-if="isTab2PanelsChart && !isTablet"
      :tab-items="tab2Items"
      :current-values="currentValues"
      :hist-values="filterHistValues"
      :number-changes="numberChanges"
      :start-hist="startHist"
      :updated-at="updatedAt"
      :is-updated-at="isUpdatedAt"
      v-on:onTimeRange="modelTimeRange"
    ></tab2-panels-chart>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import MultiChart from "~/components/widgets/chart/MultiChart";
import PanelsChart from "~/components/widgets/chart/PanelsChart";
import TabPanelsChart from "~/components/widgets/chart/TabPanelsChart";
import Tab2PanelsChart from "~/components/widgets/chart/Tab2PanelsChart";
import moment from "moment";

import feathersClient from "~/plugins/auth/feathers-client";

const loRound = require("lodash/round");
const loMerge = require("lodash/merge");
const loForEach = require("lodash/forEach");

const debug = require("debug")("app:comp.RtData");
const isLog = false;
const isDebug = false;

let nIntervId = null;

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
      numberChanges: 0,
      startHist: false,
      isUpdatedAt: true,
      timeRange: "",
    };
  },

  created: async function () {
    this.getPanelsChartType();
    if (isDebug) debug("created.dt1:", moment().inspect());
    const checkResult = await this.checkUpdatedAt();
    if (checkResult) {
      await this.getTagHistValues();
    }
    if (isDebug) debug("created.dt2:", moment().inspect());
    this.timeRange = "0.1";
  },

  mounted: function () {
    this.$nextTick(function () {});
  },

  beforeDestroy: function () {
    if (nIntervId) {
      clearInterval(nIntervId);
      if (isDebug) debug("beforeDestroy.clearInterval: OK");
    }
  },

  watch: {
    isUpdatedAt: function (val) {
      if (isDebug) debug("watch.isUpdatedAt.val:", val);
      if (!val) {
        this.showError(this.$t("rtdata.errorConnect"));
      }
      if (val) {
        this.showSuccess(this.$t("rtdata.successConnect"));
      }
    },
    timeRange: function (val) {
      if (isDebug) debug("watch.timeRange.val:", val);
      // debug("watch.timeRange.val:", val);
    },
  },
  computed: {
    isMobile: function () {
      return this.$vuetify.breakpoint.xsOnly;
    },
    isTablet: function () {
      return this.$vuetify.breakpoint.smAndDown;
    },
    updatedAt: function () {
      let updatedAt = "";
      //----------------------
      if (this.numberChanges) {
        updatedAt = moment(this.tagHistValues["updatedAt"]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      return updatedAt;
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

    /**
     * @method  currentValues
     * @returns Object[]
     * e.g. { "CH_M51::01AMIAK:01T4": { isModified: true, value: 34.567 }, "CH_M51::01AMIAK:01P4_1": { isModified: false, value: 10.123 } }
     */
    currentValues() {
      if (isDebug) debug("computed.currentValues.dt1:", moment().inspect());

      const { OpcuaValue } = this.$FeathersVuex;
      const opcuaValues = OpcuaValue.findInStore({
        query: { tagName: this.group, $sort: { updatedAt: -1 }, $limit: 1 },
      }).data;

      if (opcuaValues.length && opcuaValues[0].values.length) {
        // Check new update values
        if (this.tagHistValues["updatedAt"] !== opcuaValues[0]["updatedAt"]) {
          // Update time
          this.tagHistValues["updatedAt"] = opcuaValues[0]["updatedAt"];

          //e.g. opcuaValues[0].values = [{key: 'CH_M51::01AMIAK:01T4', value: 55.789}, ... , {key: 'CH_M51::01AMIAK:01P4_1', value: 55.789}]
          opcuaValues[0].values.forEach((valueItem) => {
            valueItem.value = loRound(valueItem.value, 3);

            // --- Add values to tagHistValues ---
            if (this.numberChanges > 0 && this.tagHistValues[valueItem.key]) {
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

          if (isDebug)
            debug(
              "computed.currentValues.tagHistValues.length:",
              this.numberChanges,
              Object.keys(this.tagHistValues).length
            );
        }
      }
      return this.tagCurrentValues;
    },

    /**
     * @method filterHistValues
     * @returns Object
     * // e.g. { "CH_M51::01AMIAK:01T4": [["Time", "Value"], ... , ["2021-10-22T14:25:55", 34.567]] }
     */
    filterHistValues: function () {
      const _histValues = {};
      const timeRange = this.timeRange ? this.timeRange : "0.1";
      //------------------------------------
      if (this.numberChanges) {
        loForEach(this.tagHistValues, function (value, key) {
          // Get filter hist values
          if (Array.isArray(value)) {
            const filterHistValues = value.filter((item) => {
              // Get now timeRange
              const dtTimeRange = moment()
                .subtract(timeRange, "h")
                .format("YYYY-MM-DDTHH:mm:ss");
              // Get histValue date-time
              const dtAt = item[0];
              return dtAt >= dtTimeRange;
            });
            _histValues[key] = filterHistValues;
          }
        });
      }
      return _histValues;
    },
  },

  methods: {
    ...mapMutations({
      showSuccess: "SHOW_SUCCESS",
      showError: "SHOW_ERROR",
    }),

    modelTimeRange(newValue) {
      this.timeRange = newValue;
    },

    getOwnerObjectTag() {
      let objectTag = null;
      //--------------------------
      const { OpcuaTag } = this.$FeathersVuex;
      const objectTags = OpcuaTag.findInStore({
        query: { browseName: this.owner, type: "object" },
      }).data;
      if (objectTags.length) {
        objectTag = objectTags[0];
      }
      return objectTag;
    },

    getOwnerGroupTag() {
      let groupTag = null;
      //--------------------------
      const { OpcuaTag } = this.$FeathersVuex;
      const groupTags = OpcuaTag.findInStore({
        query: { browseName: this.group, group: true },
      }).data;
      if (groupTags.length) {
        groupTag = groupTags[0];
      }
      return groupTag;
    },

    checkIsURL: async function () {
      const objectTag = this.getOwnerObjectTag();
      if (!objectTag) return false;
      const opcuaURL = objectTag.histParams.opcuaUrl;
      const data = {
        action: "isURL",
        url: opcuaURL,
      };
      const service = feathersClient.service("data-management");
      const result = await service.create(data);
      return result;
    },

    checkIsOpcuaClient: async function () {
      const objectTag = this.getOwnerObjectTag();
      if (!objectTag) return false;
      const opcuaURL = objectTag.histParams.opcuaUrl;
      const id = objectTag.histParams.opcuaId;
      const data = {
        action: "opcuaClientGet",
        opcuaURL,
        id,
      };
      const service = feathersClient.service("data-management");
      const result = await service.create(data);
      return !!result;
    },

    checkUpdatedAt: async function () {
      const self = this;
      //----------------------
      let checkResult = await this.checkIsOpcuaClient();
      // this.isNoPanels = !checkResult;

      this.isUpdatedAt = checkResult;

      nIntervId = setInterval(async () => {
        // Check is opcuaClient
        let checkResult = await this.checkIsOpcuaClient();
        // self.isNoPanels = !checkResult;

        self.isUpdatedAt = checkResult;

        if (!checkResult) {
          // Set tagHistValues and startHist
          self.tagHistValues = { updatedAt: moment().format() };
          self.startHist = false;
        }

        // Get TagHistValues
        if (checkResult && Object.keys(self.tagHistValues).length === 1) {
          await self.getTagHistValues();
        }
      }, 10000);

      return checkResult;
    },

    async getTagHistValues() {
      let histValues = [];
      //-------------------

      const objectTag = this.getOwnerObjectTag();
      if (objectTag) {
        const savingValuesMode = objectTag.histParams.savingValuesMode;

        if (savingValuesMode === "update") {
          const id = objectTag.histParams.opcuaId;
          const opcuaURL = objectTag.histParams.opcuaUrl;
          // Get start time
          const start = moment(0);
          // Get end time
          const end = moment();

          const data = {
            action: "opcuaClient",
            opcuaAction: "sessionReadHistoryValues",
            id,
            opcuaURL,
            opcuaCallback: "cbSessionReadHistoryValues",
            nameNodeIds: this.group,
            start,
            end,
          };
          const service = feathersClient.service("data-management");
          histValues = await service.create(data);
        }

        if (savingValuesMode === "add") {
          const { OpcuaValue } = this.$FeathersVuex;
          histValues = OpcuaValue.findInStore({
            query: { tagName: this.group, $sort: { updatedAt: 1 } },
          }).data;
        }
      }

      /* e.g. histValues = [{
       *  tagName: 'CH_M51::ValueFromFile',
       *  updatedAt: '2021-10-21T04:51:30.275+00:00',
       *  values: [{ key: 'CH_M51::01AMIAK:01T4', value: 55.789 }, ...{ key: 'CH_M51::01AMIAK:01P4_1', value: 55.789 }]
       *  }, ...]
       */

      if (isDebug)
        debug("getTagHistValues.histValues.length", histValues.length);

      if (histValues && histValues.length) {
        histValues.forEach((item) => {
          if (item.values.length) {
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
      this.startHist = Object.keys(this.tagHistValues).length > 1;
      return this.tagHistValues;
    },

    getPanelsChartType() {
      const objectTag = this.getOwnerObjectTag();
      if (objectTag) {
        const isTab1 =
          objectTag.view && objectTag.view.tab1 && !!objectTag.view.tab1.length;
        const isTab2 =
          objectTag.view && objectTag.view.tab2 && !!objectTag.view.tab2.length;

        this.isPanelsChart = !isTab1 && !isTab2;
        this.isTabPanelsChart = isTab1 && !isTab2;
        this.isTab2PanelsChart = isTab1 && isTab2;

        if (this.isTabPanelsChart) {
          this.tabs.tab1 = objectTag.view.tab1;
        }
        if (this.isTab2PanelsChart) {
          this.tabs.tab1 = objectTag.view.tab1;
          this.tabs.tab2 = objectTag.view.tab2;
        }
      } else {
        this.isNoPanels = true;
      }
    },
  },
};
</script>
