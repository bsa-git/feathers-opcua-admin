
/* eslint quotes: 0 */
// Defines Mongoose model for service `opcuaTags`. (Can be re-generated.)
const merge = require('lodash.merge');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    isEnable: Boolean,
    browseName: {
      type: String,
      unique: true
    },
    displayName: String,
    aliasName: String,
    description: String,
    type: String,
    ownerName: String,
    dataType: String,
    hist: Boolean,
    group: Boolean,
    subscription: String,
    ownerGroup: String,
    variableGetType: String,
    getter: String,
    getterParams: {},
    valueParams: {
      engineeringUnits: String,
      engineeringUnitsRange: {
        low: Number,
        high: Number
      }
    },
    histParams: {
      opcuaId: String,
      opcuaUrl: String,
      savingValuesMode: String
    },
    view: {
      tab1: [
        {
          name: String,
          items: [
            String
          ]
        }
      ],
      tab2: [
        {
          name: String,
          items: [
            String
          ]
        }
      ]
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
