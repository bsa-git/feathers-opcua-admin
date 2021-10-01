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
    <v-expansion-panels
      v-model="panels"
      focusable
      multiple
      inset
    >
      <v-expansion-panel
        v-for="(item,i) in items"
        :key="i"
        :ref="`panel${i+1}`"
      >
        <v-expansion-panel-header>
          <div class="d-flex align-baseline">
            <v-icon class="mr-3">{{ item.icon }}</v-icon>
            <span>{{ item.name }}</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Expansion panel Bar -->
          <v-row justify="center" v-if="item.panel === 'bar'">
            <v-col cols="12" md="8">
              <!-- Bar Chart -->
              <v-card :color="getBackgroundColor">
                <v-card-text>
                  <chart
                    :options="getBarOptions"
                    :init-options="initOptions"
                    ref="bar"
                    :theme="theme.dark? 'dark' : 'olivia-green'"
                    autoresize
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <!-- Refresh Button -->
                  <v-btn
                    :loading="seconds > 1"
                    :disabled="seconds > 1"
                    color="primary"
                    class="ma-2"
                    @click="refreshBar"
                  >
                    {{ $t('echartDemo.refresh') }}
                    <v-icon right dark>mdi-refresh</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import qs from 'qs'
  import feathersClient from '~/plugins/auth/feathers-client';
  // import AppPageHeader from '~/components/app/layout/AppPageHeader';
  import PanelsTopBar from '~/components/widgets/top-bars/TwoButtons';
  import ECharts from '~/components/chart/ECharts'

  // Map of China
  import chinaMap from '~/api/demo/echarts/china.json'
  // Theme Dark
  import themeDark from 'echarts/lib/theme/dark'
  // Theme Olivia Green
  import themeOliviaGreen from '~/api/app/echarts/olivia-green-theme.json'
  
  // Options
  import barOptions from '~/api/demo/echarts/bar'

  const debug = require('debug')('app:page.echarts');
  const isLog = false;
  const isDebug = false;

  // Register theme
  ECharts.registerTheme('olivia-green', themeOliviaGreen);
  // registering map data
  ECharts.registerMap('china', chinaMap);

  export default {
    components: {
      // AppPageHeader,
      PanelsTopBar,
      chart: ECharts
    },
    props: {
      items: Array
    },
    data() {
      let options = qs.parse(location.search, {ignoreQueryPrefix: true});
      return {
        title: this.$t('ch_m51.title'),
        description: this.$t('ch_m51.description'),
        panels: [0],
        seconds: -1,
        themeVintageBackgroundColor: '#fef8ef',
        themeDarkBackgroundColor: themeDark.backgroundColor,
        options,
        initOptions: {
          renderer: ''
        },
        barChart: null,
        barOptions,
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          {hid: 'description', name: 'description', content: this.description}
        ],
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        if (isLog) debug('mounted.$refs:', this.$refs);
        this.getRefCharts(this.panels);
      })
    },
    watch: {
      panels: function (val) {
        if (isLog) debug('watch.panels.$refs:', this.$refs);
        this.getRefCharts(val);
      },
    },
    computed: {
      isMobile: function () {
        return this.$vuetify.breakpoint.xsOnly;
      },
      getBackgroundColor: function () {
        return this.theme.dark ? this.themeDarkBackgroundColor : this.themeVintageBackgroundColor
      },
      getBarOptions: function () {
        return this.barOptions
      },
      
      ...mapGetters({
        config: 'getConfig',
        theme: 'getTheme',
        primaryColor: 'getPrimaryBaseColor',
        radarData: 'getDemoRadarData'
      }),
    },
    methods: {
      // Open the panels
      allOpen() {
        this.items.forEach((item, i) => {
          if (!this.panels.includes(i)) {
            const panel = this.$refs[`panel${i + 1}`] ? this.$refs[`panel${i + 1}`][0] : null;
            if (panel && panel.toggle) {
              panel.toggle();
            }
          }
        })
      },
      // Close the panels
      allClose() {
        this.panels = []
      },
      randomizeBar() {
        return [0, 0, 0].map(() => {
          return Math.round(300 + Math.random() * 700) / 10;
        });
      },
      // Get ref charts
      getRefCharts(panels) {
        let found;
        if (panels.length) {
          if (!this.barChart) {
            found = panels.find(panel => this.items[panel].panel === 'bar');
            if (found !== undefined) {
              this.barChart = this.$refs.bar ? this.$refs.bar[0] : null;
              if (isLog) debug('methods.getRefCharts.barChart:', this.barChart);
            }
          }
        }
      },
      // Refresh bar chart
      refreshBar() {
        // simulating async data from server
        this.seconds = 3;
        if (!this.barChart) return;
        this.barChart.showLoading({
          text: `${this.$t('echartDemo.loading')}...`,
          color: this.primaryColor,
          textColor: this.theme.dark ? '#FFFFFF' : '#000000',
          maskColor: 'rgba(255, 255, 255, 0.4)'
        });
        let timer = setInterval(() => {
          this.seconds--;
          if (this.seconds === 0) {
            clearTimeout(timer);
            this.barChart.hideLoading();
            this.refreshBarOptions();
            if (isLog) debug('methods.refreshBar.barOptions:', this.barOptions);
          }
        }, 1000)
      },
      refreshBarOptions: function () {
        const newDataset = [
          ['Product', '2015', '2016', '2017'],
          ['Matcha Latte', ...this.randomizeBar()],
          ['Milk Tea', ...this.randomizeBar()],
          ['Cheese Cocoa', ...this.randomizeBar()],
          ['Walnut Brownie', ...this.randomizeBar()]
        ];
        this.barOptions.dataset.source = newDataset;
      },
      ...mapMutations({

      }),
      ...mapActions({
      })
    }
  }
</script>
