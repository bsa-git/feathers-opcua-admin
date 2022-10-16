/* eslint-disable no-unused-vars */
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const auth = require('@feathersjs/authentication-client');
const io = require('socket.io-client');
const { CookieStorage } = require('cookie-storage');

const isDebug = false;

const baseURL = process.env.BASE_URL;
const storage = new CookieStorage();
const feathersClient = feathers();

const socket = io(baseURL, { transports: ['websocket'] });
const timeout = 20000;
feathersClient.configure(socketio(socket, { timeout }));
feathersClient.configure(auth({ storage }));

export default feathersClient
