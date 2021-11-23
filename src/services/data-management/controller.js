/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
// const {readJsonFileSync, inspector, appRoot} = require('../../plugins/lib');
const { 
  opcuaClient_Actions, 
  opcuaClientGet_Action,
  readJsonFile_Action, 
  isURL_Action 
} = require('../../plugins/controllers');

const debug = require('debug')('app:service.dataManagement.controller');
// const isLog = false;
const isDebug = false;

let optionsDefault = {
  app: null,
  path: 'dataManagement',
};

module.exports = function () {
  let options1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (isDebug) debug('service being configured.');
  let options = Object.assign({}, optionsDefault, options1);

  return function () {
    return dataManagement(options, this);
  };
};

function dataManagement(options, app) {
  // 'function' needed as we use 'this'
  if (isDebug) debug('service initialized');
  options.app = app;

  options.app.use(options.path, {
    create: async function create(data) {
      if (isDebug) debug('service called. action=' + data.action);

      switch (data.action) {
      case 'opcuaClient':
        return await opcuaClient_Actions(data);
      case 'opcuaClientGet':
        return await opcuaClientGet_Action(data);  
      case 'readJsonFile':
        return await readJsonFile_Action(data);  
      case 'isURL':
        return await isURL_Action(data);  
      case 'options':
        return Promise.resolve(options);
      default:
        return Promise.reject(new errors.BadRequest('Action \'' + data.action + '\' is invalid.', { errors: { $className: 'badParams' } }));
      }
    }
  });
}
