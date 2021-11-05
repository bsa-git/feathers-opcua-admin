
const axios = require('axios');
const feathersClient = require('@feathersjs/client');
const io = require('socket.io-client');
const primus = require('@feathersjs/primus');
const localStorage = require('./local-storage');
const chalk = require('chalk');

const {
  doesUrlExist
} = require('../lib');

const defaultIoOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false,
  extraHeaders: {}
};

const defaultPrimusOptions = {
  transformer: 'ws'
};

module.exports = async function makeClient(options) {
  let { transport, timeout, serverUrl, ioOptions, primusOptions, ifNoAuth } = options;
  transport = transport || 'socketio';
  timeout = timeout || 45000;
  serverUrl = serverUrl || 'http://localhost:3030';
  ioOptions = ioOptions || defaultIoOptions;
  primusOptions = primusOptions || defaultPrimusOptions;
  let socket;

  try {
    
    await doesUrlExist(serverUrl);

    const appClient = feathersClient();
    switch (transport) {
      case 'socketio':
        socket = io(serverUrl, ioOptions);
        appClient.configure(feathersClient.socketio(socket, { timeout }));
        break;
      case 'primus':
        appClient.configure(primus(primusOptions));
        break;
      case 'rest':
        appClient.configure(feathersClient.rest(serverUrl).axios(axios));
        break;
      default:
        throw new Error(`Invalid transport ${transport}. (makeClient`);
    }

    if (!ifNoAuth) {
      appClient.configure(feathersClient.authentication({
        storage: localStorage
      }));
    }
    return appClient;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(chalk.red('error:'), 'feathers-client.serverUrl:', chalk.cyan(`Server url "${serverUrl}" does not exist!`));
    } else {
      console.log(chalk.red('error:'), 'feathers-client.serverUrl:', chalk.cyan(`${error.message}!`));
    }
  }


};
