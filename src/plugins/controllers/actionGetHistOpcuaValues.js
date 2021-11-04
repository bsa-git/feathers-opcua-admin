const errors = require('@feathersjs/errors');
const { inspector} = require('../lib');

const debug = require('debug')('app:controller.actionGetHistOpcuaValues');
const isLog = false;
const isDebug = false;

module.exports = function (path) {
  try {
    const rootPath = `${appRoot}${path}`;
    const jsonData = readJsonFileSync(rootPath) || {};
    if(isLog) inspector('controller.actionReadJsonFile:', jsonData);
    // return Promise.resolve(jsonData);
    return Promise.resolve(jsonData);
  } catch (ex) {
    if (isDebug) debug('Error on read jsonFile:', ex);
    throw new errors.BadRequest('Error on read jsonFile:', ex.message);
  }
};
