/* eslint-disable no-unused-vars */
const axios = require('axios');
const feathersClient = require('@feathersjs/client');
const storage = require('./local-storage');

const baseURL = process.env.BASE_URL || 'http://localhost:3131';
const isDebug = false;

const appClient = feathersClient();

appClient.configure(feathersClient.rest(baseURL).axios(axios));
appClient.configure(feathersClient.authentication({ storage }));

if (isDebug && appClient) console.log(`Create feathersClient for transport: "rest", baseURL: "${baseURL}"`);

module.exports = appClient;