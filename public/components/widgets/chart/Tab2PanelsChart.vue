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
    <div>Tab1: {{ tab1 }}</div>
    <div>Tab2: {{ tab2 }}</div>
    <div>Panels: {{ panels }}</div>
    <div>Tab1Panels: {{ panels["tab00"] }}</div>
    <div>Tab2Panels: {{ panels["tab10"] }}</div>
    <div>Tab3Panels: {{ panels["tab20"] }}</div>
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
                  <v-tabs v-model="tab2" vertical background-color="" active-class="primary--text">
                    <v-tab
                      v-for="(tab2Item, tab2Index) in tab1Item['tab2Items']"
                      :key="`tab2_${tab1Index}${tab2Index}`"
                    >
                      {{ tab2Item.tab2Name }}
                    </v-tab>
                  </v-tabs>
                </v-col>
                <v-col cols="9">
                  <v-tabs-items v-model="tab2">
                    <v-tab-item
                      v-for="(tab2Item, tab2Index) in tab1Item['tab2Items']"
                      :key="`tab2_${tab1Index}${tab2Index}`"
                    >
                      <v-card flat>
                        <v-card-text>
                          <v-expansion-panels
                            v-model="panels[`tab${tab1Index}${tab2Index}`]"
                            focusable
                            multiple
                            inset
                          >
                            <v-expansion-panel
                              v-for="(
                                tab2PanelItem, tab2PanelIndex
                              ) in tab2Item.tab2Panels"
                              :key="`panel_${tab1Index}${tab2Index}${tab2PanelIndex}`"
                              :ref="`panel_${tab1Index}${tab2Index}${tab2PanelIndex}`"
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
                                      >{{ tab2PanelItem.currentValue }}
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

const loForEach = require("lodash/forEach");

const debug = require("debug")("app:component.MultiChart");
const isLog = false;
const isDebug = false;

export default {
  components: {
    PanelsTopBar,
  },
  props: {
    tabItems: Array,
  },
  data() {
    return {
      panels: {},
      tab1: null,
      tab2: null,
    };
  },
  created: function () {
    this.tabItems.forEach((tab1Item, tab1Index) => {
      tab1Item.tab2Items.forEach((tab2Item, tab2Index) => {
        this.panels[`tab${tab1Index}${tab2Index}`] = [];
      });
    });
  },
  mounted: function () {
    this.$nextTick(function () {
      if (isLog) debug("mounted.$refs:", this.$refs);
      debug("mounted.tabItems:", this.tabItems);
      debug("mounted.panels:", this.panels);
    });
  },
  watch: {
    panels: function (val) {
      if (isLog) debug("watch.panels.$refs:", this.$refs);
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
  },
  methods: {
    // Open the panels
    allOpen() {
      this.tabItems[this.tab1]["tab2Items"][this.tab2]["tab2Panels"].forEach(
        (item, i) => {
          if (!this.panels.includes(i)) {
            const panel = this.$refs[`panel_${this.tab1}${this.tab2}${i}`]
              ? this.$refs[`panel_${this.tab}${this.tab2}${i}`][0]
              : null;
            if (panel && panel.toggle) {
              panel.toggle();
            }
          }
        }
      );
    },
    // Close the panels
    allClose() {
      this.panels.loForEach((panel, key) => {
        panel = [];
      });
    },
  },
};
</script>
