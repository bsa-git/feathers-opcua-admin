/* eslint-disable no-unused-vars */
const axios = require('axios');
const feathersClient = require('@feathersjs/client');
const io = require('socket.io-client');
const storage = require('./local-storage');

const isDebug = false;

/**
 * Create feathers client
 * @method get-feathers-client
 * @param {String} transport 
 * e.g. transport -> "socketio" | "rest"
 * @returns {Object}
 */
export default function (transport) {
  const _transport = transport ? transport : process.env.FEATHERS_CLIENT_TRANSPORT || 'socketio';
  const baseURL = process.env.BASE_URL || 'http://localhost:3131';
  const ioOptions = { transports: ['websocket'] };
  const timeout = 5000;

  const appClient = feathersClient();

  if (_transport === 'socketio') {
    const socket = io(baseURL, ioOptions);
    appClient.configure(feathersClient.socketio(socket, { timeout }));
  } else {
    appClient.configure(feathersClient.rest(baseURL).axios(axios));
  }
  appClient.configure(feathersClient.authentication({ storage }));
  if (isDebug && appClient) console.log(`Create feathersClient for transport: "${transport}", baseURL: "${baseURL}"`);
}

module.exports = appClient;