/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const { inspector} = require('../lib');
const {
  localStorage,
  loginLocal,
  makeClient
} = require('../auth');

const loOmit = require('lodash/omit');

const debug = require('debug')('app:controller.opcuaClientActions');
const isLog = false;
const isDebug = false;

module.exports = async function (params) {
  let data = {}, serverUrl = params.opcuaURL;
  data.action = params.opcuaAction;
  Object.assign(data, loOmit(params, ['action', 'opcuaAction', 'opcuaURL']));
  const appClient = await makeClient({ serverUrl });
  try {
    const service = appClient.service('opcua-clients');
    const actionResult = await service.create(data);
    if(isLog) inspector('controller.opcuaClientActions.result', actionResult);
    return actionResult;
  } catch (ex) {
    if (isDebug) debug('Error on read jsonFile:', ex);
    throw new errors.BadRequest('Service request error:', ex.message);
  }
};
