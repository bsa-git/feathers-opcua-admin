<template>
  <v-container fluid>
    <v-form @submit.prevent="onSubmit">
      <!--<v-container grid-list-md>-->
        <v-row>
          <v-col cols="12">
            <v-text-field
              :counter="20"
              v-validate="{ regex: $util.getRegex('phone')}"
              :error-messages="errors.collect('personalPhone')"
              data-vv-name="personalPhone"
              v-model="model.personalPhone"
              :label="$t('profile.personalPhone')"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-validate="'url'"
              :error-messages="errors.collect('personalWebSite')"
              data-vv-name="personalWebSite"
              v-model="model.personalWebSite"
              :label="$t('profile.personalWebSite')"
            ></v-text-field>
          </v-col>
        </v-row>
      <!--</v-container>-->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" :loading="loadingSubmit">
          {{ $t('profile.save') }}
        </v-btn>
        <v-btn @click="onClear" class="ml-3">
          {{ $t('login.clear') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script>

  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import createLogMessage from '~/plugins/service-helpers/create-log-message';

  const debug = require('debug')('app:comp.user-profile-address');
  const isLog = false;

  export default {
    layout: 'user',
    $_veeValidate: {
      validator: 'new'
    },
    components: {},
    data() {
      return {
        saveLogMessage: null,
        loadingSubmit: false,
        error: undefined,
        model: {
          personalPhone: '',
          personalWebSite: '',
        },
      }
    },
    created: function () {
      if (this.user) {
        this.model.personalPhone = this.user.profile.personalPhone;
        this.model.personalWebSite = this.user.profile.personalWebSite;
      }
      this.saveLogMessage = createLogMessage(this.$store);
    },
    computed: {
      ...mapGetters({
        config: 'getConfig',
      }),
      ...mapState('auth', [
        'user'
      ]),
    },
    methods: {
      async onSubmit() {
        this.dismissError();
        await this.$validator.validateAll();
        if (this.$validator.errors.any()) {
          this.showError('Validation Error!');
        } else {
          this.loadingSubmit = true;
          if (isLog) debug('onSubmit.formData:', this.model);
          const profileResponse = await this.save(this.model);
          if (profileResponse) {
            if (isLog) debug('onSubmit.profileResponse:', profileResponse);
            this.showSuccess(`${this.$t('profile.successSaveUser')}!`);
            setTimeout(() => {
              this.loadingSubmit = false;
            }, 1000);
          }
        }
      },
      onClear() {
        this.model.personalPhone = '';
        this.model.personalWebSite = '';
        this.$validator.reset();
        this.dismissError();
      },
      dismissError() {
        this.error = undefined;
      },

      async save(data) {
        const idFieldUserProfile = this.$store.state['user-profiles'].idField;
        const {UserProfile} = this.$FeathersVuex;
        try {
          let profileData = {
            [idFieldUserProfile]: this.user.profile.id,
            personalPhone: data.personalPhone,
            personalWebSite: data.personalWebSite,
          };
          const userProfile = new UserProfile(profileData);
          return await userProfile.save();
        } catch (error) {
          if (isLog) debug('userProfile.save.error:', error);
          this.loadingSubmit = false;
          this.error = error;
          this.showError(error.message);
          // Recover user profile data
          await UserProfile.get(this.user.profile.id);
          this.saveLogMessage('ERROR-CLIENT', {error});
        }
      },
//      getRegex(type){
//        return { regex: /$util.getRegex('phone')/ }
//      },
      ...mapMutations({
        showSuccess: 'SHOW_SUCCESS',
        showError: 'SHOW_ERROR',
      }),
    }

  };
</script>

