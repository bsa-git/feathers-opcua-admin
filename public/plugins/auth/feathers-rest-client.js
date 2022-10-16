/* eslint-disable no-unused-vars */
const axios = require('axios');
const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const auth = require('@feathersjs/authentication-client');
const { CookieStorage } = require('cookie-storage');

const isDebug = false;

const baseURL = process.env.BASE_URL;
const storage = new CookieStorage();
const feathersClient = feathers();

feathersClient.configure(rest(baseURL).axios(axios));
feathersClient.configure(auth({ storage }));

export default feathersClient
