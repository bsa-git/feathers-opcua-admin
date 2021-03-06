
// Configure the Feathers services. (Can be re-generated.)
let authManagement = require('./auth-management/auth-management.service');
let chatMessages = require('./chat-messages/chat-messages.service');
let dataManagement = require('./data-management/data-management.service');
let logMessages = require('./log-messages/log-messages.service');
let mailer = require('./mailer/mailer.service');
let opcuaTags = require('./opcua-tags/opcua-tags.service');
let opcuaValues = require('./opcua-values/opcua-values.service');
let roles = require('./roles/roles.service');
let teams = require('./teams/teams.service');
let userProfiles = require('./user-profiles/user-profiles.service');
let userTeams = require('./user-teams/user-teams.service');
let users = require('./users/users.service');

let graphql = require('./graphql/graphql.service');
// !code: imports // !end
// !code: init // !end

// eslint-disable-next-line no-unused-vars
let moduleExports = function (app) {
  app.configure(authManagement);
  app.configure(chatMessages);
  app.configure(dataManagement);
  app.configure(logMessages);
  app.configure(mailer);
  app.configure(opcuaTags);
  app.configure(opcuaValues);
  app.configure(roles);
  app.configure(teams);
  app.configure(userProfiles);
  app.configure(userTeams);
  app.configure(users);

  app.configure(graphql);
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
