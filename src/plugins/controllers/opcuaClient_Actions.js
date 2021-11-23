/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const { inspector } = require('../lib');
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
  let data = {}, actionResult = null, serverUrl = params.opcuaURL;
  let cb = params.opcuaCallback ? params.opcuaCallback : '';
  //----------------------------------------
  data.action = params.opcuaAction;
  Object.assign(data, loOmit(params, ['action', 'opcuaAction', 'opcuaURL', 'opcuaCallback']));
  try {
    const appClient = await makeClient({ serverUrl });
    const service = appClient.service('opcua-clients');
    actionResult = await service.create(data);
    if (isLog) inspector('controller.opcuaClient_Actions.result', actionResult);
    if(cb){
      cb = require(`./cbs/${cb}`);
      actionResult = await cb(data, actionResult);
    }
    return actionResult;
  } catch (ex) {
    if (isDebug) debug('Error on opcuaClientActions:', ex.message);
    return actionResult;
  }
};
