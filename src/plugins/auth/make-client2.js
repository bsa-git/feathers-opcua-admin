/* eslint-disable no-unused-vars */
const axios = require('axios');
const io = require('socket.io-client');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const rest = require('@feathersjs/rest-client');
const auth = require('@feathersjs/authentication-client');
const localStorage = require('./local-storage');
const chalk = require('chalk');

const {
  doesUrlExist,
} = require('../lib');

const defaultIoOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false,
  extraHeaders: {}
};

module.exports = async function makeClient(options) {
  let { transport, timeout, serverUrl, ioOptions, storage, ifNoAuth } = options;
  transport = transport || 'socketio';
  timeout = timeout || 5000;
  serverUrl = serverUrl || 'http://localhost:3030';
  ioOptions = ioOptions || defaultIoOptions;
  storage = storage ? storage : localStorage;
  let socket, restClient, appClient = null;
  //-----------------------------------------------
  try {
    await doesUrlExist(serverUrl);
    appClient = feathers();
    switch (transport) {
    case 'socketio':
      socket = io(serverUrl, ioOptions);
      appClient.configure(socketio(socket, { timeout }));
      break;
    case 'rest':
      restClient = rest(serverUrl);
      appClient.configure(restClient.axios(axios));
      break;
    default:
      throw new Error(`Invalid transport ${transport}. (makeClient`);
    }

    if (!ifNoAuth) {
      appClient.configure(auth({
        storage
      }));
    }
    return appClient;
  } catch (error) {
    console.log(chalk.red('error:'), 'feathers-client.serverUrl:', chalk.cyan(`${error.message}!`));
    throw new Error(`Error while creating client (makeClient): ${error.message}.`);
  }
};
