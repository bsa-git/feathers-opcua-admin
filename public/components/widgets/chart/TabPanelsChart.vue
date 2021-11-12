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
      <span>tabItems:</span> <span>{{ tabItems.length }}</span>
    </div>
    -->

    <!--=== Tabs ===-->
    <v-row justify="center" align="center">
      <v-col cols="10">
        <v-card flat outlined>
          <v-tabs v-model="tab" show-arrows background-color="primary">
            <v-tab v-for="(tabItem, tabIndex) in tabItems" :key="tabIndex">
              {{ tabItem.tabName }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(tabItem, tabIndex) in tabItems" :key="tabIndex">
              <v-card flat>
                <v-card-text>
                  <v-expansion-panels
                    v-model="panels[`tab${tabIndex}`]"
                    focusable
                    multiple
                    inset
                  >
                    <v-expansion-panel
                      v-for="(panelItem, panelIndex) in tabItem.tabPanels"
                      :key="`panel${tabIndex}_${panelIndex}`"
                      :ref="`panel${tabIndex}_${panelIndex}`"
                    >
                      <v-expansion-panel-header>
                        <v-row no-gutters>
                          <v-col cols="7">
                            <v-icon class="mr-3">{{ panelItem.icon }}</v-icon>
                            <span>{{ panelItem.name }}</span>
                          </v-col>
                          <v-col cols="4">
                            <span
                              class="green--text font-weight-bold"
                              :class="
                                theme.dark
                                  ? 'text--lighten-1'
                                  : 'text--darken-2'
                              "
                            >
                              <span v-if="numberChanges">{{
                                currentValues[panelItem.browseName]
                                  ? currentValues[panelItem.browseName].value
                                  : 0
                              }}</span>
                              <span v-else
                                ><v-icon small :color="iconColor"
                                  >fas fa-circle-notch fa-spin</v-icon
                                ></span
                              >

                              {{ panelItem.engineeringUnits }}</span
                            >
                          </v-col>
                          <v-col cols="1">
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon class="mr-3" v-bind="attrs" v-on="on">
                                  mdi-menu
                                </v-icon>
                              </template>
                              <span>{{ panelItem.range }}</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <!--  Box Chart  -->
                        <v-row justify="center">
                          <v-col cols="12" sm="12">
                            <v-card color="primary" :dark="theme.dark" outlined>
                              <box-chart
                                v-if="numberChanges"
                                :title="`${tabItem.tabName}`"
                                :sub-title="`${
                                  currentValues[panelItem.browseName]
                                    ? currentValues[panelItem.browseName].value
                                    : 0
                                } ${panelItem.engineeringUnits}`"
                                icon="mdi-chart-line-variant"
                                :options="
                                  boxLineOptions({
                                    engineeringUnits:
                                      panelItem.engineeringUnits,
                                  })
                                "
                                :data="
                                  filterHistValues[panelItem.browseName]
                                    ? filterHistValues[panelItem.browseName]
                                    : []
                                "
                                :theme="theme.dark ? 'dark' : 'shine'"
                                :outlined="true"
                                :ref="`chart/${panelItem.browseName}`"
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
                                  {{ $t("chat_messages.moreDetails") }}
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

const moment = require("moment");
const loForEach = require("lodash/forEach");

const debug = require("debug")("app:comp.TabPanelsChart");
const isLog = false;
const isDebug = false;

export default {
  components: {
    PanelsTopBar,
    BoxChart,
  },
  props: {
    tabItems: Array,
    currentValues: Object,// e.g. { "CH_M51::01AMIAK:01T4": { isModified: true, value: 34.567 }, "CH_M51::01AMIAK:01P4_1": { isModified: false, value: 10.123 } }
    histValues: Object, // e.g. { "CH_M51::01AMIAK:01T4": [["Time", "Value"], ... , ["2021-10-22T14:25:55", 34.567]] }
    numberChanges: Number,
  },
  data() {
    return {
      panels: {},
      tab: null,
      timeRange: "0.1",
      boxLineOptions,
    };
  },
  created: function () {
    this.tabItems.forEach((tab, i) => {
      this.panels[`tab${i}`] = [];
    });
  },
  mounted: function () {
    this.$nextTick(function () {
      if (isLog) debug("mounted.$refs:", this.$refs);
      // debug("mounted.tabItems:", this.tabItems);
    });
  },
  watch: {},
  computed: {
    ...mapGetters({
      config: "getConfig",
      theme: "getTheme",
      primaryColor: "getPrimaryBaseColor",
    }),
    iconColor: function () {
      return this.theme.dark ? "white" : "black";
    },

    /**
     * @method filterHistValues
     * @returns Object
     * // e.g. { "CH_M51::01AMIAK:01T4": [["Time", "Value"], ... , ["2021-10-22T14:25:55", 34.567]] }
     */
    filterHistValues: function () {
      const _histValues = {};
      const timeRange = this.timeRange;
      //------------------------------------
      if (this.numberChanges) {
        loForEach(this.histValues, function (value, key) {
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
    // Open the panels
    allOpen() {
      this.tabItems[this.tab]["tabPanels"].forEach((item, i) => {
        if (!this.panels[`tab${this.tab}`].includes(i)) {
          const panel = this.$refs[`panel${this.tab}_${i}`]
            ? this.$refs[`panel${this.tab}_${i}`][0]
            : null;
          if (panel && panel.toggle) {
            panel.toggle();
          }
        }
      });
    },
    // Close the panels
    allClose() {
      this.tabItems[this.tab]["tabPanels"].forEach((item, i) => {
        if (this.panels[`tab${this.tab}`].includes(i)) {
          const panel = this.$refs[`panel${this.tab}_${i}`]
            ? this.$refs[`panel${this.tab}_${i}`][0]
            : null;
          if (panel && panel.toggle) {
            panel.toggle();
          }
        }
      });
    },
  },
};
</script>
