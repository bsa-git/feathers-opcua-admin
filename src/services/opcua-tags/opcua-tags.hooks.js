/* eslint-disable no-unused-vars */
// Hooks for service `opcuaTags`. (Can be re-generated.)
const commonHooks = require('feathers-hooks-common');
// eslint-disable-next-line no-unused-vars
const opcuaTagsPopulate = require('./opcua-tags.populate');
// !code: imports 
//---------------
const loConcat = require('lodash/concat');
//---------------
// !end

// !<DEFAULT> code: used
// eslint-disable-next-line no-unused-vars
const { iff } = commonHooks;
// eslint-disable-next-line no-unused-vars
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = require('./opcua-tags.validate');
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // !<DEFAULT> code: before
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  after: {
    // !<DEFAULT> code: after
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  error: {
    // !<DEFAULT> code: error
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },
  // !code: moduleExports // !end
};

// !code: exports
//---------------
// Add schema validate
// moduleExports.before.create = loConcat([validateCreate()], moduleExports.before.create);
// moduleExports.before.update = loConcat([validateUpdate()], moduleExports.before.update);
// moduleExports.before.patch = loConcat([validatePatch()], moduleExports.before.patch);
//---------------
// !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
