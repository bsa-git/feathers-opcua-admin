const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const auth = require('@feathersjs/authentication-client');
const io = require('socket.io-client');
const { CookieStorage } = require('cookie-storage');

const socket = io(`${process.env.BASE_URL}`, {transports: ['websocket']});

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 20000 }))
  .configure(auth({ storage: new CookieStorage() }));

export default feathersClient;
