
// Define the Feathers schema for service `opcuaTags`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'OpcuaTags',
  description: 'OpcuaTags database.',
  // !end
  // !code: schema_definitions // !end

  // Required fields.
  required: [
    // !code: schema_required // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique
    //----------------------
    'browseName'
    //----------------------
    // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    //-------------------------
    id: {type: 'ID'},
    _id: {type: 'ID'},
    isEnable: {
      type: 'boolean'
    },
    browseName: {
      type: 'string'
    },
    displayName: {
      type: 'string',
    },
    aliasName: {
      type: 'string',
    },
    description: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    ownerName: {
      type: 'string'
    },
    dataType: {
      type: 'string'
    },
    hist: {
      type: 'boolean'
    },
    group: {
      type: 'boolean'
    },
    ownerGroup: {
      type: 'string'
    },
    variableGetType: {
      type: 'string'
    },
    getter: {
      type: 'string'
    },
    getterParams: {
      type: 'object',
      properties: {
        path: {type: 'string'},
        fromFile: {type: 'string'},
        interval: {type: 'number'},
        dbEnv: {type: 'string'},
        queryFunc: {type: 'string'},
        queryParams: {
          properties: {
            scanerName: {type: 'string'}
          }
        }
      }
    },
    valueParams: {
      type: 'object',
      properties: {
        engineeringUnits: {type: 'string'},
        engineeringUnitsRange: {
          properties: {
            low: {type: 'number'},
            high: {type: 'number'}
          }
        }
      }
    },
    histParams: {
      type: 'object',
      properties: {
        opcuaId: {type: 'string'},
        opcuaUrl: {type: 'string'},
        savingValuesMode: {type: 'string'}
      }
    },
    view: {
      type: 'object',
      properties: {
        tab1: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              items: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        tab2: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              items: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      }
    }
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
    name: 'OpcuaTag',
    service: {
      sort: { _id: 1 },
    },
    // sql: {
    //   sqlTable: 'OpcuaTags',
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
      // !<DEFAULT> code: graphql_add
      // __author__: { type: '__User__!', args: false, relation: { ourTable: '__authorId__', otherTable: '_id' } },
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
