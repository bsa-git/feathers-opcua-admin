
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
    isDisable: Boolean,
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
    ownerGroup: String,
    variableGetType: String,
    getter: String,
    getterParams: {
      path: String,
      fromFile: String,
      interval: Number,
      dbEnv: String,
      queryFunc: String,
      queryParams: {
        scanerName: String
      }
    },
    valueParams: {
      engineeringUnits: String,
      engineeringUnitsRange: {
        low: Number,
        high: Number
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
