/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const {isUrlExist, inspector} = require('../lib');

const debug = require('debug')('app:controller.isURL');
const isLog = false;
const isDebug = false;

module.exports = async function (params) {
  let { url } = params;
  return await isUrlExist(url);
};
