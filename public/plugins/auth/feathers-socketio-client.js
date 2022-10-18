/* eslint-disable no-unused-vars */
// const feathers = require('@feathersjs/feathers');
// const socketio = require('@feathersjs/socketio-client');
// const auth = require('@feathersjs/authentication-client');
// const io = require('socket.io-client');
// const { CookieStorage } = require('cookie-storage');

// const isDebug = false;

// const baseURL = process.env.BASE_URL;
// const storage = new CookieStorage();
// const feathersClient = feathers();

// const socket = io(baseURL, { transports: ['websocket'] });
// const timeout = 20000;
// feathersClient.configure(socketio(socket, { timeout }));
// feathersClient.configure(auth({ storage }));

// export default feathersClient
const feathersClient = require('@feathersjs/client');
const io = require('socket.io-client');
const { CookieStorage } = require('cookie-storage');
const storage = new CookieStorage();

const baseURL = process.env.BASE_URL || 'http://localhost:3131';
const ioOptions = { transports: ['websocket'] };
const timeout = 5000;

const isDebug = false;

const appClient = feathersClient();
const socket = io(baseURL, ioOptions);
appClient.configure(feathersClient.socketio(socket, { timeout }));
appClient.configure(feathersClient.authentication({ storage }));

if (isDebug && appClient) console.log(`Create feathersClient for transport: "socketio", baseURL: "${baseURL}"`);
export default appClient