
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `opcuaTags`. (Can be re-generated.)
const merge = require('lodash.merge');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    bsonType: "object",
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId"
      },
      isDisable: {
        bsonType: "boolean"
      },
      browseName: {
        bsonType: "string"
      },
      displayName: {
        bsonType: "string"
      },
      aliasName: {
        bsonType: "string"
      },
      description: {
        bsonType: "string"
      },
      type: {
        bsonType: "string"
      },
      ownerName: {
        bsonType: "string"
      },
      dataType: {
        bsonType: "string"
      },
      hist: {
        bsonType: "boolean"
      },
      group: {
        bsonType: "boolean"
      },
      ownerGroup: {
        bsonType: "string"
      },
      variableGetType: {
        bsonType: "string"
      },
      getter: {
        bsonType: "string"
      },
      getterParams: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          path: {
            bsonType: "string"
          },
          fromFile: {
            bsonType: "string"
          },
          interval: {
            bsonType: "number"
          },
          dbEnv: {
            bsonType: "string"
          },
          queryFunc: {
            bsonType: "string"
          },
          queryParams: {
            bsonType: "object",
            additionalProperties: false,
            properties: {
              _id: {
                bsonType: "objectId"
              },
              scanerName: {
                bsonType: "string"
              }
            }
          }
        }
      },
      valueParams: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          engineeringUnits: {
            bsonType: "string"
          },
          engineeringUnitsRange: {
            bsonType: "object",
            additionalProperties: false,
            properties: {
              _id: {
                bsonType: "objectId"
              },
              low: {
                bsonType: "number"
              },
              high: {
                bsonType: "number"
              }
            }
          }
        }
      }
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
