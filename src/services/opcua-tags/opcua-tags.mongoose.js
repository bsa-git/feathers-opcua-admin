
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
    hist: Number,
    store: {},
    group: Boolean,
    subscription: String,
    ownerGroup: String,
    bindMethod: String,
    inputArguments: [
      {}
    ],
    outputArguments: [
      {}
    ],
    userAccessLevel: {
      inputArguments: String,
      outputArguments: String
    },
    variableGetType: String,
    getter: String,
    getterParams: {},
    valueParams: {
      arrayDimensions: [
        Number
      ],
      engineeringUnits: String,
      engineeringUnitsRange: {
        low: Number,
        high: Number
      }
    },
    valueFromSourceParams: {
      dataType: String,
      arrayType: String
    },
    histParams: {
      opcuaId: String,
      opcuaUrl: String,
      savingValuesMode: String
    },
    view: {}
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports
//--------------------------------
moduleExports.inputArguments = {};
moduleExports.outputArguments = {};
moduleExports.valueParams = {};
//---------------------------------
// !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
