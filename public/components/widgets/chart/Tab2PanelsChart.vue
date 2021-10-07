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

    <!--=== Expansion panels ===-->
    <v-expansion-panels v-model="panels" focusable multiple inset>
      <v-expansion-panel
        v-for="(item, i) in items"
        :key="i"
        :ref="`panel${i + 1}`"
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
                :class="theme.dark ? 'text--lighten-1' : 'text--darken-2'"
                >{{ item.currentValue }} {{ item.engineeringUnits }}</span
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
        <v-expansion-panel-content>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PanelsTopBar from "~/components/widgets/top-bars/TwoButtons";

const debug = require("debug")("app:component.MultiChart");
const isLog = false;
const isDebug = false;

export default {
  components: {
    PanelsTopBar,
  },
  props: {
    items: Array,
  },
  data() {
    return {
      panels: [],
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      if (isLog) debug("mounted.$refs:", this.$refs);
      // debug("mounted.theme:", this.theme);
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
