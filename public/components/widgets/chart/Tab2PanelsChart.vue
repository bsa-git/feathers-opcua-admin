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
    
    <!--=== Show updatedAt ===-->
    <div class="d-flex pa-2 justify-center subtitle-2" :class="{ 'red--text': !isUpdatedAt }">
      {{ updatedAt }}
    </div>
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
                              <v-expansion-panel-header
                                v-if="currentValues[tab2PanelItem.browseName]"
                              >
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
                                      <span v-if="numberChanges">{{
                                        currentValues[tab2PanelItem.browseName]
                                          ? currentValues[
                                              tab2PanelItem.browseName
                                            ].value
                                          : 0
                                      }}</span>
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
                                      <!-- <div>{{ updatedAt }}</div> -->
                                      <span>{{ tab2PanelItem.range }}</span>
                                    </v-tooltip>
                                  </v-col>
                                </v-row>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content
                                v-if="currentValues[tab2PanelItem.browseName]"
                              >
                                <!--  Box Chart  -->
                                <v-row justify="center">
                                  <v-col cols="12" sm="12">
                                    <v-card
                                      v-if="startHist"
                                      color="primary"
                                      :dark="theme.dark"
                                      outlined
                                    >
                                      <box-chart
                                        v-if="numberChanges"
                                        :title="`${tab1Item.tab1Name} - ${tab2Item.tab2Name}`"
                                        :sub-title="`${
                                          currentValues[
                                            tab2PanelItem.browseName
                                          ]
                                            ? currentValues[
                                                tab2PanelItem.browseName
                                              ].value
                                            : 0
                                        } ${tab2PanelItem.engineeringUnits}`"
                                        icon="mdi-chart-line-variant"
                                        :options="
                                          boxLineOptions({
                                            engineeringUnits:
                                              tab2PanelItem.engineeringUnits,
                                          })
                                        "
                                        :data="
                                          histValues[
                                            tab2PanelItem.browseName
                                          ]
                                            ? histValues[
                                                tab2PanelItem.browseName
                                              ]
                                            : []
                                        "
                                        :theme="theme.dark ? 'dark' : 'shine'"
                                        :outlined="true"
                                        :ref="`chart/${tab2PanelItem.browseName}`"
                                      />
                                      <v-divider />
                                      <v-card-actions>
                                        <v-btn-toggle
                                          v-model="computedTimeRange"
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
                                    <div v-else>
                                      <div
                                        class="
                                          d-flex
                                          pa-2
                                          justify-center
                                          subtitle-1
                                        "
                                      >
                                        {{ $t("echartDemo.waitLoadingData") }}
                                      </div>
                                      <div class="d-flex pa-2 justify-center">
                                        <v-icon dense :color="iconColor"
                                          >fas fa-circle-notch fa-spin</v-icon
                                        >
                                      </div>
                                    </div>
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
    currentValues: Object, // e.g. { "CH_M51::01AMIAK:01T4": { isModified: true, value: 34.567 }, "CH_M51::01AMIAK:01P4_1": { isModified: false, value: 10.123 } }
    histValues: Object, // e.g. { "updatedAt": "2021-11-19T05:45:57.820Z", "CH_M51::01AMIAK:01T4": [["Time", "Value"], ... , ["2021-10-22T14:25:55", 34.567]] }
    numberChanges: Number,
    startHist: Boolean,
    updatedAt: String,
    isUpdatedAt: Boolean
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
  watch: {
    numberChanges: function (val) {
      if (val) {
        if (isDebug) debug("watch.numberChanges.val:", val);
        if (isLog)
          debug("watch.numberChanges.currentValues:", this.currentValues);
      }
    },
    startHist: function (val) {
      if (val) {
        if (isDebug) debug("watch.numberChanges.val:", val);
        if (isLog) debug("watch.startHist.histValues:", this.histValues);
      }
    },
    
  },
  computed: {
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

    computedTimeRange: {
      // Getter:
      get: function () {
        return this.timeRange
      },
      // Setter:
      set: function (newValue) {
        this.timeRange = newValue;
        this.$emit('onTimeRange', newValue)
      }
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
