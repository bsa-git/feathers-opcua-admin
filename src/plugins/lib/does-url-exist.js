/* eslint-disable no-unused-vars */
const url = require('url');
const axios = require('axios');
const logger = require('../../logger');

const debug = require('debug')('app:lib.does-url-exist');
const isLog = false;
const isDebug = false;

const doesUrlExist = async function (target) {
  let uri;
  //----------------------------------------
  try {
    uri = url.parse(target);
  } catch (error) {
    logger.error(`Invalid url ${target}`);
    throw new Error(`Invalid url ${target}`);
  }

  try {
    await axios({
      method: 'get',
      url: uri,
      timeout: 2000 // only wait for 2s
    });

    return true;
  } catch (error) {
    logger.error(`This URL "${target}" does not exist`);
    if (isDebug) console.log('http-operations.checkExistUrl.error.code:', error.code);
    if (isLog) inspector('http-operations.checkExistUrl.error.config:', error.config);
    if (isLog) inspector('http-operations.checkExistUrl.error.headers:', error.headers);
    if (error.response) {
      // Request made and server responded
      if (isLog) inspector('http-operations.checkExistUrl.error.response.status:', error.response.status);
      if (isLog) inspector('http-operations.checkExistUrl.error.response.data:', error.response.data);
      if (isLog) inspector('http-operations.checkExistUrl.error.response.headers:', error.response.headers);
    }
    throw new Error(`This URL "${target}" does not exist`);
  }
};

const isUrlExist = async function (target) {
  try {
    await doesUrlExist(target);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  doesUrlExist,
  isUrlExist
};
