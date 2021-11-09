/* eslint-disable no-unused-vars */
const url = require('url');
const axios = require('axios');

const debug = require('debug')('app:lib.does-url-exist');
const isLog = false;
const isDebug = false;

module.exports = async function doesUrlExist (target) {
  let uri;
  try {
    uri = url.parse(target);
  } catch (error) {
    throw new Error(`Invalid url ${target}`);
  }

  try {
    await axios.get(uri);
  } catch (error) {
    if (isDebug) console.log('http-operations.checkExistUrl.error.code:', error.code);
    if (isLog) inspector('http-operations.checkExistUrl.error.config:', error.config);
    if (isLog) inspector('http-operations.checkExistUrl.error.headers:', error.headers);
    if (error.response) {
      // Request made and server responded
      if (isLog) inspector('http-operations.checkExistUrl.error.response.status:', error.response.status);
      if (isLog) inspector('http-operations.checkExistUrl.error.response.data:', error.response.data);
      if (isLog) inspector('http-operations.checkExistUrl.error.response.headers:', error.response.headers);
    }
    throw error;
  }
};
