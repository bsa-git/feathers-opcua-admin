/* eslint-disable no-unused-vars */
// const isDebug = false;

// const axios = require('axios');
// const feathers = require('@feathersjs/feathers');
// const rest = require('@feathersjs/rest-client');
// const socketio = require('@feathersjs/socketio-client');
// const auth = require('@feathersjs/authentication-client');
// const io = require('socket.io-client');
// const { CookieStorage } = require('cookie-storage');

// const transport = process.env.FEATHERS_CLIENT_TRANSPORT;
// const baseURL = process.env.BASE_URL;
// const storage = new CookieStorage();
// const feathersClient = feathers();

// if (transport === 'socketio') {
//   const socket = io(baseURL, { transports: ['websocket'] });
//   const timeout = 20000;
//   feathersClient.configure(socketio(socket, { timeout }));
//   feathersClient.configure(auth({ storage }));
// } else {
//   feathersClient.configure(rest(baseURL).axios(axios));
//   feathersClient.configure(auth({ storage }));
// }

// export default feathersClient
const axios = require('axios');
const feathersClient = require('@feathersjs/client');
const io = require('socket.io-client');
const { CookieStorage } = require('cookie-storage');
const storage = new CookieStorage();

const transport = process.env.FEATHERS_CLIENT_TRANSPORT || 'socketio';
const baseURL = process.env.BASE_URL || 'http://localhost:3131';
const ioOptions = { transports: ['websocket'] };
const timeout = 20000;

const isDebug = false;

const appClient = feathersClient();
if (transport === 'socketio') {
  const socket = io(baseURL, ioOptions);
  appClient.configure(feathersClient.socketio(socket, { timeout }));
} else {
  appClient.configure(feathersClient.rest(baseURL).axios(axios));
}
appClient.configure(feathersClient.authentication({ storage }));
if(isDebug && appClient) console.log(`Create feathersClient for transport: "${transport}", baseURL: "${baseURL}"`);

export default appClient