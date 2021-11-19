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

    <div class="d-flex pa-2 justify-center subtitle-2">
      {{ updatedAt }}
    </div>
    <!--=== Expansion panels ===-->
    <v-row justify="center" align="center">
      <v-col cols="10">
        <v-card flat outlined>
          <v-expansion-panels v-model="panels" focusable multiple inset>
            <v-expansion-panel
              v-for="(item, i) in items"
              :key="i"
              :ref="`panel${i + 1}`"
            >
              <v-expansion-panel-header v-if="currentValues[item.browseName]">
                <v-row no-gutters>
                  <v-col cols="6">
                    <v-icon class="mr-3">{{ item.icon }}</v-icon>
                    <span>{{ item.name }}</span>
                  </v-col>
                  <v-col cols="5">
                    <span
                      class="green--text font-weight-bold"
                      :class="theme.dark ? 'text--lighten-1' : 'text--darken-2'"
                    >
                      <!-- {{ item.currentValue }}  -->
                      <span v-if="numberChanges">{{
                        currentValues[item.browseName]
                          ? currentValues[item.browseName].value
                          : 0
                      }}</span>
                      <span v-else
                        ><v-icon small :color="iconColor"
                          >fas fa-circle-notch fa-spin</v-icon
                        ></span
                      >
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
              <v-expansion-panel-content v-if="currentValues[item.browseName]">
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
                        :title="item.name"
                        :sub-title="`${
                          currentValues[item.browseName]
                            ? currentValues[item.browseName].value
                            : 0
                        } ${item.engineeringUnits}`"
                        icon="mdi-chart-line-variant"
                        :options="
                          boxLineOptions({
                            engineeringUnits: item.engineeringUnits,
                          })
                        "
                        :data="
                          filterHistValues[item.browseName]
                            ? filterHistValues[item.browseName]
                            : []
                        "
                        :theme="theme.dark ? 'dark' : 'shine'"
                        :outlined="true"
                        :ref="`chart/${item.browseName}`"
                      />
                      <v-divider />
                      <v-card-actions>
                        <v-btn-toggle v-model="timeRange" color="primary" dense>
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
                      <div class="d-flex pa-2 justify-center subtitle-1">
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

const debug = require("debug")("app:component.PanelChart");
const isLog = false;
const isDebug = false;

export default {
  components: {
    PanelsTopBar,
    BoxChart,
  },
  props: {
    items: Array,
    currentValues: Object, // e.g. { "CH_M51::01AMIAK:01T4": { isModified: true, value: 34.567 }, "CH_M51::01AMIAK:01P4_1": { isModified: false, value: 10.123 } }
    histValues: Object, // e.g. { "CH_M51::01AMIAK:01T4": [["Time", "Value"], ... , ["2021-10-22T14:25:55", 34.567]] }
    numberChanges: Number,
    startHist: Boolean,
    updatedAt: String
  },
  data() {
    return {
      panels: [],
      timeRange: "0.1",
      boxLineOptions,
    };
  },
  mounted: function () {
    this.$nextTick(function () {});
  },
  watch: {
    numberChanges: function (val) {
      if (val) {
        if (isDebug) debug("watch.numberChanges.val:", val);
        if (isLog)
          debug("watch.numberChanges.currentValues:", this.currentValues);
        debug("watch.numberChanges.currentValues:", this.currentValues);
        if (isLog) debug("watch.numberChanges.histValues:", this.histValues);
      }
    },
  },
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
      const timeRange = this.timeRange ? this.timeRange : "0.1";
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
      this.items.forEach((item, i) => {
        if (!this.panels.includes(i)) {
          const panel = this.$refs[`panel${i + 1}`]
            ? this.$refs[`panel${i + 1}`][0]
            : null;
          if (panel && panel.toggle) {
            panel.toggle();
          }
        }
      });
    },
    // Close the panels
    allClose() {
      this.panels = [];
    },
  },
};
</script>
