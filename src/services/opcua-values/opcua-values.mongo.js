
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `opcuaValues`. (Can be re-generated.)
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
      tagId: {
        bsonType: "objectId"
      },
      tagName: {
        bsonType: "string"
      },
      storeStart: {
        bsonType: "string"
      },
      storeEnd: {
        bsonType: "string"
      },
      store: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          }
        }
      },
      opcuaData: {
        items: {
          type: "object",
          properties: {
            key: {
              type: "string"
            },
            hash: {
              type: "string"
            },
            value: {
              type: [
                "string",
                "number",
                "integer",
                "boolean",
                "object"
              ]
            },
            values: {
              type: "array",
              items: {
                type: [
                  "string",
                  "number",
                  "integer",
                  "boolean",
                  "object",
                  "array"
                ]
              }
            },
            params: {
              type: "object",
              properties: {}
            }
          }
        },
        bsonType: "array"
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
