
// Define the Feathers schema for service `logMessages`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'LogMessages',
  description: 'LogMessages database.',
  // !end
  // !code: schema_definitions
  //--------------------------
  fakeRecords: 1,
  //--------------------------
  // !end

  // Required fields.
  required: [
    // !code: schema_required // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    //-------------------------
    id: {type: 'ID'},
    _id: {type: 'ID'},
    gr: {faker: 'name.title'},
    pr: {type: 'integer'},
    name: {faker: 'name.title'},
    ownerId: {type: 'ID', faker: {fk: 'users:random'}},
    userId: {type: 'ID', faker: {fk: 'users:random'}},
    msg: {faker: 'lorem.sentence'}
    //-------------------------
    // !end
  },
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: 'LogMessage',
    service: {
      sort: { _id: 1 },
    },
    // sql: {
    //   sqlTable: 'LogMessages',
    //   uniqueKey: '_id',
    //   sqlColumn: {
    //     __authorId__: '__author_id__',
    //   },
    // },
    // !end
    discard: [
      // !code: graphql_discard // !end
    ],
    add: {
      // !code: graphql_add
      //-------------------
      owner: {type: 'User', args: true, relation: {ourTable: 'ownerId', otherTable: '_id'}},
      user: {type: 'User', args: true, relation: {ourTable: 'userId', otherTable: '_id'}},
      //-------------------
      // !end
    },
    // !code: graphql_more // !end
  },
};

// !code: more // !end

let moduleExports = {
  schema,
  extensions,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
