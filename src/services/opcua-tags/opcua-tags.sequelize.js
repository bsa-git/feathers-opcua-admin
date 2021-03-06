
/* eslint quotes: 0 */
// Defines Sequelize model for service `opcuaTags`. (Can be re-generated.)
const merge = require('lodash.merge');
const Sequelize = require('sequelize');
// eslint-disable-next-line no-unused-vars
const DataTypes = Sequelize.DataTypes;
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: sequelize_model
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    isEnable: {
      type: DataTypes.BOOLEAN
    },
    browseName: {
      type: DataTypes.TEXT,
      unique: true
    },
    displayName: {
      type: DataTypes.TEXT
    },
    aliasName: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.TEXT
    },
    ownerName: {
      type: DataTypes.TEXT
    },
    dataType: {
      type: DataTypes.TEXT
    },
    hist: {
      type: DataTypes.INTEGER
    },
    store: {
      type: DataTypes.JSONB
    },
    group: {
      type: DataTypes.BOOLEAN
    },
    subscription: {
      type: DataTypes.TEXT
    },
    ownerGroup: {
      type: DataTypes.TEXT
    },
    bindMethod: {
      type: DataTypes.TEXT
    },
    inputArguments: {
      type: DataTypes.JSONB
    },
    outputArguments: {
      type: DataTypes.JSONB
    },
    userAccessLevel: {
      type: DataTypes.JSONB
    },
    variableGetType: {
      type: DataTypes.TEXT
    },
    getter: {
      type: DataTypes.TEXT
    },
    getterParams: {
      type: DataTypes.JSONB
    },
    valueParams: {
      type: DataTypes.JSONB
    },
    valueFromSourceParams: {
      type: DataTypes.JSONB
    },
    histParams: {
      type: DataTypes.JSONB
    },
    view: {
      type: DataTypes.JSONB
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
