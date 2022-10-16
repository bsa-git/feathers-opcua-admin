/* eslint-disable no-unused-vars */
const feathersClient = require('@feathersjs/client');
const io = require('socket.io-client');
const storage = require('./local-storage');

const baseURL = process.env.BASE_URL || 'http://localhost:3131';
const ioOptions = { transports: ['websocket'] };
const timeout = 5000;

const isDebug = false;

const appClient = feathersClient();
const socket = io(baseURL, ioOptions);
appClient.configure(feathersClient.socketio(socket, { timeout }));
appClient.configure(feathersClient.authentication({ storage }));

if (isDebug && appClient) console.log(`Create feathersClient for transport: "socketio", baseURL: "${baseURL}"`);

module.exports = appClient;