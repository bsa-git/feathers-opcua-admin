<template>
  <div>
    <!--=== Bootons ===-->
    <panels-top-bar
      btn1-icon="mdi-plus"
      :btn1-tooltip="$t('accounts.allOpen')"
      btn2-icon="mdi-minus"
      :btn2-tooltip="$t('accounts.allClose')"
      :click-btn1="allOpen"
      :click-btn2="allClose"
    ></panels-top-bar>

    <!--=== Debug ===-->
    <!--  
    <div>
      <span>Tabs:</span> <span>{{ panels["tab0_0"] }}</span>
    </div>
    -->
    <!--=== Tabs ===-->
    <v-row justify="center" align="center">
      <v-col cols="12" md="10">
        <v-card flat outlined>
          <v-tabs v-model="tab1" show-arrows background-color="primary">
            <v-tab
              v-for="(tab1Item, tab1Index) in tabItems"
              :key="`tab1_${tab1Index}`"
            >
              {{ tab1Item.tab1Name }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab1">
            <v-tab-item
              v-for="(tab1Item, tab1Index) in tabItems"
              :key="`tab1_${tab1Index}`"
            >
              <v-row>
                <v-col cols="3">
                  <v-tabs v-model="tabs2[tab1Index]" vertical>
                    <v-tab
                      :active-class="tabActiveClass"
                      v-for="(tab2Item, tab2Index) in tab1Item['tab2Items']"
                      :key="`tab2_${tab1Index}_${tab2Index}`"
                    >
                      {{ tab2Item.tab2Name }}
                    </v-tab>
                  </v-tabs>
                </v-col>
                <v-col cols="9">
                  <v-tabs-items v-model="tabs2[tab1Index]">
                    <v-tab-item
                      v-for="(tab2Item, tab2Index) in tab1Item['tab2Items']"
                      :key="`tab2_${tab1Index}_${tab2Index}`"
                    >
                      <v-card flat>
                        <v-card-text>
                          <v-expansion-panels
                            v-model="panels[`tab${tab1Index}_${tab2Index}`]"
                            focusable
                            multiple
                            inset
                          >
                            <v-expansion-panel
                              v-for="(
                                tab2PanelItem, tab2PanelIndex
                              ) in tab2Item.tab2Panels"
                              :key="`panel${tab1Index}_${tab2Index}_${tab2PanelIndex}`"
                              :ref="`panel${tab1Index}_${tab2Index}_${tab2PanelIndex}`"
                            >
                              <v-expansion-panel-header>
                                <v-row no-gutters>
                                  <v-col cols="6">
                                    <v-icon class="mr-3">{{
                                      tab2PanelItem.icon
                                    }}</v-icon>
                                    <span>{{ tab2PanelItem.name }}</span>
                                  </v-col>
                                  <v-col cols="5">
                                    <span
                                      class="green--text font-weight-bold"
                                      :class="
                                        theme.dark
                                          ? 'text--lighten-1'
                                          : 'text--darken-2'
                                      "
                                    >
                                      <span
                                        v-if="numberChanges"
                                        :ref="`txt/${tab2PanelItem.browseName}`"
                                        >{{
                                          currentValues[
                                            tab2PanelItem.browseName
                                          ].value
                                        }}</span
                                      >
                                      <span v-else
                                        ><v-icon small :color="iconColor"
                                          >fas fa-circle-notch fa-spin</v-icon
                                        ></span
                                      >

                                      {{ tab2PanelItem.engineeringUnits }}</span
                                    >
                                  </v-col>
                                  <v-col cols="1">
                                    <v-tooltip top>
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-icon
                                          class="mr-3"
                                          v-bind="attrs"
                                          v-on="on"
                                        >
                                          mdi-menu
                                        </v-icon>
                                      </template>
                                      <span>{{ tab2PanelItem.range }}</span>
                                    </v-tooltip>
                                  </v-col>
                                </v-row>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <!--  Box Chart  -->
                                <v-row justify="center">
                                  <v-col cols="12" sm="12">
                                    <v-card
                                      color="primary"
                                      :dark="theme.dark"
                                      outlined
                                    >
                                      <box-chart
                                        :title="`${tab1Item.tab1Name} - ${tab2Item.tab2Name}`"
                                        :sub-title="`${tab2PanelItem.engineeringUnits}`"
                                        icon="mdi-chart-line-variant"
                                        :options="
                                          boxLineOptions({
                                            engineeringUnits:
                                              tab2PanelItem.engineeringUnits,
                                          })
                                        "
                                        :data="[]"
                                        :theme="theme.dark ? 'dark' : 'shine'"
                                        :outlined="true"
                                        :ref="`chart/${tab2PanelItem.browseName}`"
                                      />
                                      <v-divider />
                                      <v-card-actions>
                                        <v-btn-toggle
                                          v-model="timeRange"
                                          color="primary"
                                          dense
                                        >
                                          <v-btn value="0.1"> 0.1H </v-btn>

                                          <v-btn value="1"> 1H </v-btn>

                                          <v-btn value="6"> 6H </v-btn>

                                          <v-btn value="48"> All </v-btn>
                                        </v-btn-toggle>
                                        <v-spacer />
                                        <v-btn small dark text>
                                          {{ $t("chartDemo.more") }} ...
                                        </v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PanelsTopBar from "~/components/widgets/top-bars/TwoButtons";
import BoxChart from "~/components/widgets/chart/BoxChart";
import boxLineOptions from "~/api/app/chart/box-line2";
// import { monthUniqueVisitData } from "~/api/demo/chart/chart-data";

const moment = require("moment");
const loForEach = require("lodash/forEach");

const debug = require("debug")("app:comp.Tab2PanelsChart");
const isLog = false;
const isDebug = false;

export default {
  components: {
    PanelsTopBar,
    BoxChart,
  },
  props: {
    tabItems: Array,
    currentValues: Object,
    histValues: Object,
    numberChanges: Number,
  },
  data() {
    return {
      panels: {},
      tab1: null,
      tabs2: [],
      timeRange: "0.1",
      boxLineOptions,
    };
  },
  created: function () {
    this.tabItems.forEach((tab1Item, tab1Index) => {
      this.tabs2[tab1Index] = 0;
      tab1Item.tab2Items.forEach((tab2Item, tab2Index) => {
        this.panels[`tab${tab1Index}_${tab2Index}`] = [];
      });
    });
  },
  mounted: function () {
    this.$nextTick(function () {
      if (isLog) debug("mounted.$refs:", this.$refs);
      // debug("mounted.histValues:", this.histValues);
      // debug("mounted.currentValues:", this.currentValues);
    });
  },
  watch: {
    panels: function (val) {
      if (isLog) debug("watch.panels.$refs:", this.$refs);
      debug("watch.panels:", this.panels);
    },
    timeRange: function (val) {
      if (isDebug) debug("watch.panels.$refs:", this.$refs);
      // debug("watch.timeRange:", this.timeRange);
    },
    numberChanges: function (val) {
      // if (isDebug) debug("watch.panels.$refs:", this.$refs);
      debug("watch.numberChanges.$refs:", this.$refs);
      
      // innerText
      loForEach(this.currentValues, (value, key) => {
        // Update values
        if (this.$refs[`txt/${key}`] && this.currentValues[key].isModified) {
          this.$refs[`txt/${key}`][0].innerText = this.currentValues[key].value;
        }

        // Update chart
        if (this.$refs[`chart/${key}`]) {
          // this.$refs[`chart/${key}`][0].data = this.histValues[key];
        }
      });
    },
  },
  computed: {
    isMobile: function () {
      return this.$vuetify.breakpoint.xsOnly;
    },
    ...mapGetters({
      config: "getConfig",
      theme: "getTheme",
      primaryColor: "getPrimaryBaseColor",
    }),
    tabActiveClass: function () {
      return this.theme.dark ? "white--text" : "black--text";
    },
    iconColor: function () {
      return this.theme.dark ? "white" : "black";
    },
    // filterTabValues: function () {
    //   //------------------------------------
    //   // debug("filterTabValues.panels:", this.panels);
    //   this.tabValues.forEach((tab1Item, tab1Index) => {
    //     tab1Item.tab2Items.forEach((tab2Item, tab2Index) => {
    //       tab2Item.tab2Panels.forEach((panel, panelIndex) => {
    //         const filterHistValues = panel.histValues.filter((item) => {
    //           // Get now date-time
    //           const dtSubtract_nh = moment()
    //             .utc()
    //             .subtract(this.timeRange, "h")
    //             .format("YYYY-MM-DDTHH:mm:ss");
    //           const dtAt = item[0].split(".")[0];
    //           // debug('filterTabItems.times:', dtNow, dtSubtract_1h, dtAt)
    //           return dtAt >= dtSubtract_nh;
    //         });
    //         panel.histValues = filterHistValues;
    //       });
    //     });
    //   });
    //   return this.tabValues;
    // },

    /**
     * @method filterHistValues
     * @returns Object
     * // e.g. { "CH_M51::01AMIAK:01T4": [["Time", "Value"], ... , ["2021-10-22T14:25:55", 34.567]] }
     */
    filterHistValues: function () {
      const histValues = {};
      const self = this;
      //------------------------------------
      loForEach(this.histValues, function (value, key) {
        // Get filter hist values
        const filterHistValues = value.filter((item) => {
          // Get now timeRange
          const dtTimeRange = moment()
            .utc()
            .subtract(self.timeRange, "h")
            .format("YYYY-MM-DDTHH:mm:ss");
          // Get histValue date-time
          const dtAt = item[0].split(".")[0];
          return dtAt >= dtTimeRange;
        });
        histValues[key] = filterHistValues;
      });
      debug("filterHistValues.histValues:", histValues);
      return histValues;
    },
    computedCurrentValues: function name() {
      debug("computedCurrentValues.currentValues:", this.currentValues);
      return this.currentValues;
    },
    computedHistValues: function name() {
      debug("computedHistValues.histValues:", this.histValues);
      return this.histValues;
    },
  },
  methods: {
    // Open the panels
    allOpen() {
      let tabPanels = this.tabItems[this.tab1]["tab2Items"];
      tabPanels = tabPanels[this.tabs2[this.tab1]];
      tabPanels = tabPanels["tab2Panels"];
      tabPanels.forEach((item, i) => {
        const isInclude =
          this.panels[`tab${this.tab1}_${this.tabs2[this.tab1]}`].includes(i);
        if (!isInclude) {
          const refIndex = `panel${this.tab1}_${this.tabs2[this.tab1]}_${i}`;
          const panelRef = this.$refs[refIndex];
          const panel = panelRef ? panelRef[0] : null;
          if (panel && panel.toggle) {
            panel.toggle();
          }
        }
      });
    },
    // Close the panels
    allClose() {
      let tabPanels = this.tabItems[this.tab1]["tab2Items"];
      tabPanels = tabPanels[this.tabs2[this.tab1]];
      tabPanels = tabPanels["tab2Panels"];
      tabPanels.forEach((item, i) => {
        const isInclude =
          this.panels[`tab${this.tab1}_${this.tabs2[this.tab1]}`].includes(i);
        if (isInclude) {
          const refIndex = `panel${this.tab1}_${this.tabs2[this.tab1]}_${i}`;
          const panelRef = this.$refs[refIndex];
          const panel = panelRef ? panelRef[0] : null;
          if (panel && panel.toggle) {
            panel.toggle();
          }
        }
      });
    },
  },
};
</script>
