
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
      isEnable: {
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
      subscription: {
        bsonType: "string"
      },
      ownerGroup: {
        bsonType: "string"
      },
      bindMethod: {
        bsonType: "string"
      },
      inputArguments: {
        items: {
          type: "object"
        },
        bsonType: "array"
      },
      outputArguments: {
        items: {
          type: "object"
        },
        bsonType: "array"
      },
      userAccessLevel: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          inputArguments: {
            bsonType: "string"
          },
          outputArguments: {
            bsonType: "string"
          }
        }
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
      },
      histParams: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          opcuaId: {
            bsonType: "string"
          },
          opcuaUrl: {
            bsonType: "string"
          },
          savingValuesMode: {
            bsonType: "string"
          }
        }
      },
      view: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          tab1: {
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string"
                },
                items: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              }
            },
            bsonType: "array"
          },
          tab2: {
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string"
                },
                items: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              }
            },
            bsonType: "array"
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
