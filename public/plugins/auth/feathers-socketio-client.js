/* eslint-disable no-unused-vars */
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const auth = require('@feathersjs/authentication-client');
const io = require('socket.io-client');
const { CookieStorage } = require('cookie-storage');

const isDebug = false;

const baseURL = process.env.BASE_URL;
const storage = new CookieStorage();
const timeout = 60000;
const feathersClient = feathers();

const socket = io(baseURL, { transports: ['websocket'] });
feathersClient.configure(socketio(socket, { timeout }));
feathersClient.configure(auth({ timeout, storage }));

export default feathersClient
