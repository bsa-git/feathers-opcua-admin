
/* eslint quotes: 0 */
// Validation definitions for validateSchema hook for service `opcuaTags`. (Can be re-generated.)
const { validateSchema } = require('feathers-hooks-common');
const merge = require('lodash.merge');
const ajv = require('ajv');
// !code: imports // !end
// !code: init // !end

// !<DEFAULT> code: set_id_type
// eslint-disable-next-line no-unused-vars
const ID = 'string';
// !end

let base = merge({},
  // !<DEFAULT> code: base
  {
    title: "OpcuaTags",
    description: "OpcuaTags database.",
    required: [],
    uniqueItemProperties: [
      "browseName"
    ],
    properties: {
      id: {
        type: ID
      },
      _id: {
        type: ID
      },
      isEnable: {
        type: "boolean"
      },
      browseName: {
        type: "string"
      },
      displayName: {
        type: "string"
      },
      aliasName: {
        type: "string"
      },
      description: {
        type: "string"
      },
      type: {
        type: "string"
      },
      ownerName: {
        type: "string"
      },
      dataType: {
        type: "string"
      },
      hist: {
        type: "integer"
      },
      store: {
        type: "object",
        properties: {}
      },
      group: {
        type: "boolean"
      },
      subscription: {
        type: "string"
      },
      ownerGroup: {
        type: "string"
      },
      bindMethod: {
        type: "string"
      },
      inputArguments: {
        type: "array",
        items: {
          type: "object"
        }
      },
      outputArguments: {
        type: "array",
        items: {
          type: "object"
        }
      },
      userAccessLevel: {
        type: "object",
        properties: {
          inputArguments: {
            type: "string"
          },
          outputArguments: {
            type: "string"
          }
        }
      },
      variableGetType: {
        type: "string"
      },
      getter: {
        type: "string"
      },
      getterParams: {
        type: "object",
        properties: {}
      },
      valueParams: {
        type: "object",
        properties: {
          arrayDimensions: {
            type: "array",
            items: {
              type: "integer"
            }
          },
          engineeringUnits: {
            type: "string"
          },
          engineeringUnitsRange: {
            properties: {
              low: {
                type: "number"
              },
              high: {
                type: "number"
              }
            },
            type: "object"
          }
        }
      },
      valueFromSourceParams: {
        type: "object",
        properties: {
          dataType: {
            type: "string"
          },
          arrayType: {
            type: "string"
          }
        }
      },
      histParams: {
        type: "object",
        properties: {
          opcuaId: {
            type: "string"
          },
          opcuaUrl: {
            type: "string"
          },
          savingValuesMode: {
            type: "string"
          }
        }
      },
      view: {
        type: "object",
        properties: {}
      }
    }
  },
  // !end
  // !code: base_more // !end
);
// !code: base_change // !end

let create = merge({},
  base,
  // !code: create_more // !end
);

let update = merge({},
  base,
  // !code: update_more // !end
);

let patch = merge({},
  base,
  // !code: patch_more // !end
);
delete patch.required;
// !code: all_change // !end

let validateCreate = options => {
  // !<DEFAULT> code: func_create
  return validateSchema(create, ajv, options);
  // !end
};

let validateUpdate = options => {
  // !<DEFAULT> code: func_update
  return validateSchema(update, ajv, options);
  // !end
};

let validatePatch = options => {
  // !<DEFAULT> code: func_patch
  return validateSchema(patch, ajv, options);
  // !end
};

let quickValidate = (method, data, options) => {
  try {
    if (method === 'create') { validateCreate(options)({ type: 'before', method: 'create', data }); }
    if (method === 'update') { validateCreate(options)({ type: 'before', method: 'update', data }); }
    if (method === 'patch') { validateCreate(options)({ type: 'before', method: 'patch', data }); }
  } catch (err) {
    return err;
  }
};
// !code: validate_change // !end

let moduleExports = {
  create,
  update,
  patch,
  validateCreate,
  validateUpdate,
  validatePatch,
  quickValidate,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
