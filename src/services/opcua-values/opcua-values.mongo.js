
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
      values: {
        items: {
          type: "object",
          properties: {
            key: {
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
            items: {
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
