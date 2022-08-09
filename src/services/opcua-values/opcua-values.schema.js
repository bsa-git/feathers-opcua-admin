
// Define the Feathers schema for service `opcuaValues`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'OpcuaValues',
  description: 'OpcuaValues database.',
  // !end
  // !code: schema_definitions // !end

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
    //-------------------
    id: { type: 'ID' },
    _id: { type: 'ID' },
    tagId: { type: 'ID' },
    tagName: { type: 'string' },
    storeStart: { type: 'string' },
    storeEnd: { type: 'string' },
    store: { type: 'object', properties: {} },
    opcuaData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          hash: {type: 'string'},
          value: { type: ['string', 'number', 'integer', 'boolean', 'object'] },
          values: { type: 'array', items: { type: ['string', 'number', 'integer', 'boolean', 'object', 'array'] } },
          params: { type: 'object', properties: {} }
        }
      }
    }
    //-------------------
    // !end
  },
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: 'OpcuaValue',
    service: {
      sort: { _id: 1 },
    },
    // sql: {
    //   sqlTable: 'OpcuaValues',
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
      tag: { type: 'OpcuaTag', args: true, relation: { ourTable: 'tagId', otherTable: '_id' } },
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
