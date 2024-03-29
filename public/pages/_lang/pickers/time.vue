<template>
  <div>
    <!--=== Page Header ===-->
    <app-page-header
      :page-title="description"
    ></app-page-header>

    <!--=== Description ===-->
    <blockquote class="blockquote line-left"><em>The <kbd>v-time-picker</kbd> is stand-alone component that can be
      utilized
      in many existing Vuetify components. It offers the user a visual representation for selecting the time.</em>
    </blockquote>
    <br/>

    <!--=== Colors ===-->
    <div class="title">Colors (Exx.1)</div>
    <div class="subtitle-1">Time picker colors can be set using the <kbd>color</kbd> and <kbd>header-color</kbd> props.
      If header-color prop is not provided header will use the <kbd>color</kbd> prop value.
    </div>
    <br/>
    <flex-box-cols>
      <template v-slot:col1>
        <v-time-picker v-model="e" color="green lighten-1"></v-time-picker>
      </template>
      <template v-slot:col2>
        <v-time-picker v-model="e" color="green lighten-1" header-color="purple"></v-time-picker>
      </template>
    </flex-box-cols>
    <v-divider class="my-5"></v-divider>

    <!--=== Disabled ===-->
    <div class="title">Disabled (Exx.2)</div>
    <div class="subtitle-1">You can't interact with disabled picker.</div>
    <br/>
    <flex-box-cols>
      <template v-slot:col1>
        <v-time-picker
          v-model="picker"
          color="primary"
          disabled
        ></v-time-picker>
      </template>
      <template v-slot:col2>
        <v-time-picker
          v-model="picker"
          color="primary"
          :landscape="$vuetify.breakpoint.smAndUp"
          disabled
        ></v-time-picker>
      </template>
    </flex-box-cols>
    <v-divider class="my-5"></v-divider>

    <!--=== 24h format ===-->
    <div class="title">24h Format (Exx.3)</div>
    <div class="subtitle-1">A time picker can be switched to 24hr format. Note that the <kbd>format</kbd> prop defines
      only the way the picker is displayed, picker's value (model) is always in 24hr format.
    </div>
    <br/>
    <row-box>
      <v-time-picker v-model="e1" color="primary" format="24hr"></v-time-picker>
    </row-box>
    <v-divider class="my-5"></v-divider>

    <!--=== Allowed times ===-->
    <div class="title">Allowed times (Exx.4)</div>
    <div class="subtitle-1">You can specify allowed times using arrays, objects, and functions.
      You can also specify time step/precision/interval - e.g. 10 minutes.
    </div>
    <br/>
    <flex-box-cols>
      <template v-slot:col1>
        <v-time-picker
          v-model="time"
          color="primary"
          :allowed-hours="allowedHours"
          :allowed-minutes="allowedMinutes"
          class="mt-4"
          format="24hr"
          scrollable
          min="9:30"
          max="22:15"
        ></v-time-picker>
      </template>
      <template v-slot:col2>
        <v-time-picker
          v-model="timeStep"
          color="primary"
          :allowed-minutes="allowedStep"
          class="mt-4"
          format="24hr"
        ></v-time-picker>
      </template>
    </flex-box-cols>
    <v-divider class="my-5"></v-divider>

    <!--=== Setting picker width ===-->
    <div class="title">Setting picker width (Exx.5)</div>
    <div class="subtitle-1">You can specify allowed the picker's width or make it full width.
    </div>
    <br/>
    <flex-box-cols
      :md="5"
      :vcols="1"
    >
      <template v-slot:col1>
        <v-time-picker
          v-model="time"
          color="primary"
          type="month"
          width="290"
          class="ml-4"
        ></v-time-picker>
        <v-time-picker
          v-model="time"
          color="primary"
          :landscape="$vuetify.breakpoint.mdAndUp"
          full-width
          type="month"
          class="ma-4"
        ></v-time-picker>
      </template>
    </flex-box-cols>
    <v-divider class="my-5"></v-divider>

    <!--=== AM/PM switch in title ===-->
    <div class="title">AM/PM switch in title (Exx.6)</div>
    <div class="subtitle-1">You can move AM/PM switch to picker's title.
    </div>
    <br/>
    <flex-box-cols>
      <template v-slot:col1>
        <v-time-picker
          v-model="picker"
          color="primary"
          ampm-in-title
        ></v-time-picker>
      </template>
      <template v-slot:col2>
        <v-time-picker
          v-model="picker"
          color="primary"
          :landscape="$vuetify.breakpoint.smAndUp"
          ampm-in-title
        ></v-time-picker>
      </template>
    </flex-box-cols>
    <v-divider class="my-5"></v-divider>

    <!--=== No title ===-->
    <div class="title">No title (Exx.7)</div>
    <div class="subtitle-1">
      You can remove picker's title.
    </div>
    <br/>
    <flex-box-cols>
      <template v-slot:col1>
        <v-time-picker
          v-model="picker"
          color="primary"
          no-title
        ></v-time-picker>
      </template>
      <template v-slot:col2>
        <v-time-picker
          v-model="picker"
          color="primary"
          :landscape="$vuetify.breakpoint.smAndUp"
          no-title
        ></v-time-picker>
      </template>
    </flex-box-cols>
    <v-divider class="my-5"></v-divider>

    <!--=== With seconds ===-->
    <div class="title">With seconds (Exx.8)</div>
    <div class="subtitle-1">
      Time picker can have seconds input.
    </div>
    <br/>
    <flex-box-cols>
      <template v-slot:col1>
        <v-time-picker
          v-model="picker"
          color="primary"
          use-seconds
        ></v-time-picker>
      </template>
      <template v-slot:col2>
        <v-time-picker
          v-model="picker"
          color="primary"
          :landscape="$vuetify.breakpoint.smAndUp"
          use-seconds
        ></v-time-picker>
      </template>
    </flex-box-cols>
    <v-divider class="my-5"></v-divider>

    <!--=== Scrollable ===-->
    <div class="title">Scrollable (Exx.9)</div>
    <div class="subtitle-1">
      You can edit time picker's value using mouse wheel.
    </div>
    <br/>
    <row-box>
      <v-time-picker v-model="picker" color="primary" scrollable></v-time-picker>
    </row-box>
    <v-divider class="my-5"></v-divider>

    <!--=== In dialog and menu ===-->
    <div class="title">In dialog and menu (Exx.10)</div>
    <div class="subtitle-1">Due to the flexibility of pickers, you can really dial in the experience exactly how you
      want it.
    </div>
    <br/>
    <flex-box-card :md="6">
      <v-row>
        <v-col cols="11" sm="5">
          <v-menu
            ref="menu"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time2"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="time2"
                label="Picker in menu"
                prepend-icon="mdi-timer-outline"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="time2"
              color="primary"
              full-width
              @click:minute="$refs.menu.save(time2)"
            ></v-time-picker>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="11" sm="5">
          <v-dialog
            ref="dialog"
            v-model="modal2"
            :return-value.sync="time2"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="time2"
                label="Picker in dialog"
                prepend-icon="mdi-timer-outline"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="modal2"
              v-model="time2"
              color="primary"
              full-width
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(time2)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </flex-box-card>
    <v-divider class="my-5"></v-divider>

    <!--=== Range ===-->
    <div class="title">Range (Exx.11)</div>
    <div class="subtitle-1">This is an example of joining pickers together using <kbd>min</kbd> and <kbd>max</kbd> prop.
    </div>
    <br/>
    <flex-box-card :md="6">
      <h1>Plan your event:</h1>
      <v-row justify="space-around" align="center">
        <v-col style="width: 290px; flex: 0 1 auto;">
          <h2>Start:</h2>
          <v-time-picker v-model="start" color="primary" :max="end"></v-time-picker>
        </v-col>
        <v-col style="width: 290px; flex: 0 1 auto;">
          <h2>End:</h2>
          <v-time-picker v-model="end" color="primary" :min="start"></v-time-picker>
        </v-col>
      </v-row>
    </flex-box-card>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import AppPageHeader from '~/components/app/layout/AppPageHeader';
  import FlexBoxCard from '~/components/widgets/containers/flex-box-card';
  import RowBox from '~/components/widgets/containers/row-box';
  import FlexBoxCols from '~/components/widgets/containers/flex-box-cols';

  export default {
    components: {
      AppPageHeader,
      FlexBoxCard,
      RowBox,
      FlexBoxCols
    },
    data() {
      return {
        title: this.$t('time_picker.title'),
        description: this.$t('time_picker.description'),
        e: null,
        e1: null,
        picker: null,
        time: '11:15',
        timeStep: '10:10',
        time2: null,
        menu2: false,
        modal2: false,
        start: null,
        end: null,
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
    computed: {
      ...mapGetters({
        theme: 'getTheme',
        config: 'getConfig'
      }),
    },
    methods: {
      allowedHours: v => v % 2,
      allowedMinutes: v => v >= 10 && v <= 50,
      allowedStep: m => m % 10 === 0,
    },
  }
</script>
