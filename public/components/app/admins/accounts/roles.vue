<template>
  <div>
    <treeview-top-bar
      :search="search"
      :labelSearch="$t('management.search')"
      v-on:onSearch="search = $event"
    ></treeview-top-bar>
    <v-treeview
      :items="roles"
      :search="search"
      :active.sync="active"
      :open.sync="open"
      activatable
      open-on-click
      active-class="primary--text"
      transition
    >
      <template v-slot:prepend="{ item, active }">
        <v-icon v-if="item.id.startsWith('User.fullName')" :color="active ? 'primary' : ''">mdi-check</v-icon>
        <v-icon v-else-if="item.name.includes('id :')" :color="active ? 'primary' : ''">mdi-check</v-icon>
      </template>
    </v-treeview>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import TreeviewTopBar from '~/components/widgets/top-bars/Search';

  const debug = require('debug')('app:comp.admins-accounts-roles');
  const isLog = false;

  export default {
    components: {
      TreeviewTopBar
    },
    props: {
      getSelObject: Function
    },
    data: () => ({
      search: '',
      active: [],
      open: [],
    }),
    computed: {
      roles() {
        const data = [];
        const idFieldRole = this.$store.state.roles.idField;
        const {Role} = this.$FeathersVuex;
        const roles = Role.findInStore({query: {$sort: {name: 1}}}).data;
        if (isLog) debug('Roles from store:', roles);
        roles.forEach(role => {
          const roleId = role[idFieldRole];
          // Find users for role
          const users = [];
          role.users.forEach(user => {
            users.push({
              id: `User.fullName_${user.id}`,
              name: `${user.fullName}`,
            })
          });
          if (isLog) debug('users:', users);
          // Get role
          let item = {
            id: `Role.name_${roleId}`,
            name: `${role.name} :`,
            children: [
              {id: `Role.id_${roleId}`, name: `id : ${roleId}`},
              {
                id: `Role.users_${roleId}`,
                name: `Users(${users.length ? users.length : 'Not'}) :`,
                children: users
              }
            ]
          };
          data.push(item);
        });
        return data
      },
      selected() {
        if (!this.active.length) return undefined;
        const selItem = this.active[0];
        return this.getSelObject(selItem);
      }
    },
    watch: {
      selected: function (val) {
        if (val) this.openDialog();
      }
    },
    methods: {
      openDialog() {
        this.$emit('onOpenDialog')
      },
    }
  }
</script>
