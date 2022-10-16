/* eslint-disable no-unused-vars */
import axios from  'axios';
import feathers from  '@feathersjs/feathers';
import rest from  '@feathersjs/rest-client';
import socketio from  '@feathersjs/socketio-client';
import auth from  '@feathersjs/authentication-client';
import io from  'socket.io-client';
import { CookieStorage } from  'cookie-storage';

const isDebug = false;

/**
 * Create feathers client
 * @method feathersClient
 * @param {String} transport 
 * e.g. transport -> "socketio" | "rest"
 * @returns {Object}
 */
export default function (transport) {
  const _transport = transport ? transport : process.env.FEATHERS_CLIENT_TRANSPORT;
  const baseURL = process.env.BASE_URL;
  const storage = new CookieStorage();
  const feathersClient = feathers();

  if (_transport === 'socketio') {
    const socket = io(baseURL, { transports: ['websocket'] });
    const timeout = 20000;
    feathersClient.configure(socketio(socket, { timeout }));
    feathersClient.configure(auth({ storage }));
  } else {
    feathersClient.configure(rest(baseURL).axios(axios));
    feathersClient.configure(auth({ storage }));
  }
  return feathersClient;
}