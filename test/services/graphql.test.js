const assert = require('assert');
const {
  inspector, 
  appRoot
} = require('../../src/plugins/lib');
const {
  checkServicesRegistered,
  saveFakesToServices, 
  graphqlQuery, 
  graphqlExpected
} = require('../../src/plugins/test-helpers');

const app = require(`${appRoot}/src/app`);
const debug = require('debug')('app:graphql.test');

const isLog = false;

const isTest = true;
const isSeed = true;

let graphql;
const port = app.get('port') || 3030;

describe('<<< Test services/graphql.test.js >>>', () => {

  let server;

  before(function (done) {
    server = app.listen(port);
    server.once('listening', () => {
      setTimeout(() => done(), 500);
    });
  });

  after(function (done) {
    server.close();
    setTimeout(() => done(), 500);
  });

  if(!isTest) {
    debug('<<< Test Test services/graphql.test.js - NOT >>>');
    return;
  }

  describe('--- Save fake data to services ---', function () {
    if (isSeed) {
      it('registered the all services', () => {
        const errPath = checkServicesRegistered(app);
        assert.ok(errPath === '', `Service '${errPath}' not registered`);
      });

      it('Save fakes to services', async () => {
        const errPath = await saveFakesToServices(app);
        assert.ok(errPath === '', `Not save fakes to services - '${errPath}'`);
      });
    }
  });

  describe('--- Run requests for GraphQl ---', function () {

    it('Registered the \'graphql\' service', () => {
      graphql = app.service('/graphql');
      assert.ok(graphql, 'Registered the service');
    });

    it('Run \'getUser\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['getUser']}});
      if (isLog) inspector('Response for \'getUser\' query:', response);
      // inspector('Response for \'getUser\' query:', response);
      const getUser = graphqlExpected['getUser']();
      if (isLog) inspector('Expected for \'getUser\' query:', getUser);
      // inspector('Expected for \'getUser\' query:', getUser);
      assert.deepStrictEqual(response, getUser);
    });

    it('Run \'findUser\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['findUser']}});
      if (isLog) inspector('Response for \'findUser\' query:', response.data);
      const findUser = graphqlExpected['findUser']();
      if (isLog) inspector('Expected for \'findUser\' query:', findUser);
      assert.deepStrictEqual(response.data, findUser);
    });

    it('Run \'getRole\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['getRole']}});
      if (isLog) inspector('Response for \'getRole\' query:', response);
      const getRole = graphqlExpected['getRole']();
      if (isLog) inspector('Expected for \'getRole\' query:', getRole);
      assert.deepStrictEqual(response, getRole);
    });

    it('Run \'findRole\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['findRole']}});
      if (isLog) inspector('Response for \'findRole\' query:', response);
      const findRole = graphqlExpected['findRole']();
      if (isLog) inspector('Expected for \'findRole\' query:', findRole);
      assert.deepStrictEqual(response.data, findRole);
    });

    it('Run \'getTeam\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['getTeam']}});
      if (isLog) inspector('Response for \'getTeam\' query:', response);
      const getTeam = graphqlExpected['getTeam']();
      if (isLog) inspector('Expected for \'getTeam\' query:', getTeam);
      assert.deepStrictEqual(response, getTeam);
    });

    it('Run \'findTeam\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['findTeam']}});
      if (isLog) inspector('Response for \'findTeam\' query:', response);
      const findTeam = graphqlExpected['findTeam']();
      if (isLog) inspector('Expected for \'findTeam\' query:', findTeam);
      assert.deepStrictEqual(response.data, findTeam);
    });

    it('Run \'getLogMessage\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['getLogMessage']}});
      if (isLog) inspector('Response for \'getLogMessage\' query:', response);
      const getLogMessage = graphqlExpected['getLogMessage']();
      if (isLog) inspector('Expected for \'getLogMessage\' query:', getLogMessage);
      assert.deepStrictEqual(response, getLogMessage);
    });

    it('Run \'findLogMessage\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['findLogMessage']}});
      if (isLog) inspector('Response for \'findLogMessage\' query:', response);
      const findLogMessage = graphqlExpected['findLogMessage']();
      if (isLog) inspector('Expected for \'findLogMessage\' query:', findLogMessage);
      assert.deepStrictEqual(response.data, findLogMessage);
    });

    it('Run \'getChatMessage\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['getChatMessage']}});
      if (isLog) inspector('Response for \'getChatMessage\' query:', response);
      // inspector('Response for \'getChatMessage\' query:', response);
      const getChatMessage = graphqlExpected['getChatMessage']();
      if (isLog) inspector('Expected for \'getChatMessage\' query:', getChatMessage);
      // inspector('Expected for \'getChatMessage\' query:', getChatMessage);
      assert.deepStrictEqual(response, getChatMessage);
    });

    it('Run \'findChatMessage\' request for GraphQl', async () => {
      const response = await graphql.find({query: {query: graphqlQuery['findChatMessage']}});
      if (isLog) inspector('Response for \'findChatMessage\' query:', response);
      const findChatMessage = graphqlExpected['findChatMessage']();
      if (isLog) inspector('Expected for \'findChatMessage\' query:', findChatMessage);
      assert.deepStrictEqual(response.data, findChatMessage);
    });
  });
});
