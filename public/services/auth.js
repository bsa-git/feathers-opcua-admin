import feathersVuex from 'feathers-vuex';
import feathersClient from '~/plugins/auth/feathers-client';
// import feathersClient from '~/plugins/auth/feathers-rest-client';

const { auth } = feathersVuex(feathersClient, { idField: '_id' });
const authPlugin = auth({
  userService: 'users',
});

export default authPlugin;
