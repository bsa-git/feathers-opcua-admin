/* eslint-disable no-unused-vars */
const isDebug = false;

const axios = require('axios');
const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const socketio = require('@feathersjs/socketio-client');
const auth = require('@feathersjs/authentication-client');
const io = require('socket.io-client');
const { CookieStorage } = require('cookie-storage');
const transport = process.env.FEATHERS_CLIENT_TRANSPORT;
const baseURL = process.env.BASE_URL;
const storage = new CookieStorage();

const feathersClient = feathers(); 

if (transport === 'socketio') {
  const socket = io(baseURL, { transports: ['websocket'] });
  const timeout = 20000;
  feathersClient.configure(socketio(socket, { timeout }));
  feathersClient.configure(auth({ storage }));
} else {
  feathersClient.configure(rest(baseURL).axios(axios))
  feathersClient.configure(auth({ storage }));
}


export default feathersClient;
