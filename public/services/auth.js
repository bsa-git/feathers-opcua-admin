import feathersVuex from 'feathers-vuex';
// import getFeathersClient from '~/plugins/auth/get-feathers-client';
import feathersClient from '~/plugins/auth/feathers-client';
// import feathersClient from '~/plugins/auth/feathers-rest-client';
// import feathersClient from '~/plugins/auth/feathers-socketio-client';

// const feathersClient = getFeathersClient('socketio');// socketio

const { auth } = feathersVuex(feathersClient, { idField: '_id' });
const authPlugin = auth({
  userService: 'users',
});

export default authPlugin;
