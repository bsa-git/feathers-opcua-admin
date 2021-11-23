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
  let actionResult = null, serverUrl = params.opcuaURL;
  let cb = params.opcuaCallback ? params.opcuaCallback : '';
  //----------------------------------------
  try {
    const appClient = await makeClient({ serverUrl });
    const service = appClient.service('opcua-clients');
    actionResult = await service.get(params.id);
    if (isLog) inspector('controller.opcuaClientGet_Action.result', actionResult);
    // inspector('controller.opcuaClientGet_Action.result', actionResult);
    if(cb){
      cb = require(`./cbs/${cb}`);
      actionResult = await cb(params, actionResult);
    }
    return actionResult;
  } catch (ex) {
    if (isDebug) debug('Error on opcuaClientActions:', ex.message);
    return actionResult;
  }
};
