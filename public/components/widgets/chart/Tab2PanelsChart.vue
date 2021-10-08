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
    <div> Tab: {{ tab }} </div>
    <div> Tab1Panels: {{ panels['tab0'] }} </div>
    <div> Tab2Panels: {{ panels['tab1'] }} </div>
    <div> Tab3Panels: {{ panels['tab2'] }} </div>
    <!--=== Tabs ===-->
    <v-row justify="center" align="center">
      <v-col cols="12" md="10">
        <v-card flat outlined>
          <v-tabs v-model="tab" show-arrows background-color="primary">
            <v-tab v-for="(tabItem, i) in tabItems" :key="i">
              {{ tabItem.tabName }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(tabItem, i) in tabItems" :key="i">
              <v-card flat>
                <v-card-text>
                  <v-expansion-panels v-model="panels[`tab${tab}`]" focusable multiple inset>
                    <v-expansion-panel
                      v-for="(item, i) in tabItem.tabPanels"
                      :key="`panel_${tab}${i}`"
                      :ref="`panel_${tab}${i}`"
                    >
                      <v-expansion-panel-header>
                        <v-row no-gutters>
                          <v-col cols="6">
                            <v-icon class="mr-3">{{ item.icon }}</v-icon>
                            <span>{{ item.name }}</span>
                          </v-col>
                          <v-col cols="5">
                            <span
                              class="green--text font-weight-bold"
                              :class="
                                theme.dark
                                  ? 'text--lighten-1'
                                  : 'text--darken-2'
                              "
                              >{{ item.currentValue }}
                              {{ item.engineeringUnits }}</span
                            >
                          </v-col>
                          <v-col cols="1">
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon class="mr-3" v-bind="attrs" v-on="on">
                                  mdi-menu
                                </v-icon>
                              </template>
                              <span>{{ item.range }}</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content> </v-expansion-panel-content>
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
      tab: null,
    };
  },
  created: function () {
    this.tabItems.forEach((tab, i) => {
      this.panels[`tab${i}`] = [];
    })
  },
  mounted: function () {
    this.$nextTick(function () {
      if (isLog) debug("mounted.$refs:", this.$refs);
      // debug("mounted.tabItems:", this.tabItems);
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
      this.tabItems[this.tab]['tabPanels'].forEach((item, i) => {
        if (!this.panels.includes(i)) {
          const panel = this.$refs[`panel_${this.tab}${i}`]
            ? this.$refs[`panel_${this.tab}${i}`][0]
            : null;
          if (panel && panel.toggle) {
            panel.toggle();
          }
        }
      });
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
