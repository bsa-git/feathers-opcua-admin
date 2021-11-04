const errors = require('@feathersjs/errors');
const {readJsonFileSync, inspector, appRoot} = require('../../plugins/lib');

const debug = require('debug')('app:controller.actionReadJsonFile');
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
