
// fgraphql populate hook for service `opcuaValues`. (Can be re-generated.)
const runTime = require('@feathers-plus/graphql/lib/run-time');
const { fgraphql, serialize } = require('feathers-hooks-common');
const { parse } = require('graphql');
// !<DEFAULT> code: graphql
const schema = require('../../services/graphql/graphql.schemas');
const resolvers = require('../../services/graphql/service.resolvers');
// !end
// !code: imports // !end
// !code: init // !end

const queries = {
  // No populate
  none: {},
  // All resolver fields 1 level deep.
  oneLevel: {
    query: {
      tag: {},
    }
  },
  // All resolver fields 2 levels deep.
  twoLevels: {
    query: {
      tag: {
      },
    }
  },
  // !code: queries // !end
};

async function opcuaValuesPopulate (context) {
  // eslint-disable-next-line no-unused-vars
  const params = context.params;
  let query, options, serializer;

  if (params.$populate) { return context; } // another populate is calling this service

  // !<DEFAULT> code: populate
  // Example: always the same query
  ({ query, options, serializer } = queries.foo);

  // Example: select query based on user being authenticated or not
  ({ query, options, serializer } = queries[params.user ? queries.foo : queries.bar]);

  // Example: select query based on the user role
  if (params.user && params.user.roles.includes('foo')) {
    ({ query, options, serializer } = queries.foo);
  }

  // Example: allow client to provide the query
  if (params.$populateQuery) {
    ({ query, options, serializer } = params.$populateQuery);
  }

  // Populate the data.
  let newContext = await fgraphql({
    parse,
    runTime,
    schema,
    resolvers,
    recordType: 'OpcuaValue',
    query,
    options,
  })(context);

  // Prune and sanitize the data.
  if (serializer) {
    newContext = serialize(serializer)(newContext);
  }

  // End the hook.
  return newContext;
  // !end
}

// !code: more // !end
let moduleExports = opcuaValuesPopulate;

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end

/* For your information: all record and resolver fields 2 levels deep.
const twoLevelsFields = {
  query: {
    id: 1,
    _id: 1,
    tagId: 1,
    tagName: 1,
    storeStart: 1,
    storeEnd: 1,
    store: 1,
    opcuaData: 1,
    tag: {
      _args: {},
      id: 1,
      _id: 1,
      isEnable: 1,
      browseName: 1,
      displayName: 1,
      aliasName: 1,
      description: 1,
      type: 1,
      ownerName: 1,
      dataType: 1,
      hist: 1,
      store: 1,
      group: 1,
      subscription: 1,
      ownerGroup: 1,
      bindMethod: 1,
      inputArguments: 1,
      outputArguments: 1,
      userAccessLevel: 1,
      variableGetType: 1,
      getter: 1,
      getterParams: 1,
      valueParams: 1,
      valueFromSourceParams: 1,
      histParams: 1,
      view: 1,
    },
  }
};
*/
