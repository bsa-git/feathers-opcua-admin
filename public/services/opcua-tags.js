// const loPick = require('lodash/pick');
import feathersVuex from 'feathers-vuex';
import feathersClient from '~/plugins/auth/feathers-client';
import normalize from '~/services/hooks/normalize';
import log from '~/services/hooks/log';

const debug = require('debug')('app:service.opcua-tags');

// const isDebug = true;
const isLog = false;

const {service} = feathersVuex(feathersClient, {idField: '_id'});

const servicePath = 'opcua-tags';
// const userTeams = feathersClient(servicePath);
// userTeams.on('patched', userTeam => console.log('User team patched', userTeam));
const servicePlugin = service(servicePath, {
  instanceDefaults(data, {store, Model}) {
    const idField = store.state['opcua-tags'].idField;
    if (isLog) debug('ServiceInfo:', {
      servicePath: Model.servicePath,
      namespace: Model.namespace,
      idField: idField,
      data: data
    });
    return {};
  },
  getters: {},
});

feathersClient.service(servicePath)
  .hooks({
    before: {
      all: [log()],
      find: [],
      get: [],
      create: [normalize()],
      update: [normalize()],
      patch: [normalize()],
      remove: []
    },
    after: {
      all: [log()],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },
    error: {
      all: [log()],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    }
  });

export default servicePlugin;
