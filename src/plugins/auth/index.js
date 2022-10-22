const localStorage = require('./local-storage');
const loginJwt = require('./login-jwt');
const loginLocal = require('./login-local');
const makeClient = require('./make-client');
const makeClient2 = require('./make-client2');
const verifiers = require('./verifiers');
const AuthServer = require('./auth-server.class');
const Channel = require('./channel.class');
const checkUserUniqueness = require('./checkUserUniqueness');
module.exports = {
  localStorage,
  loginLocal,
  loginJwt,
  makeClient,
  makeClient2,
  verifiers,
  AuthServer,
  Channel,
  checkUserUniqueness
};
