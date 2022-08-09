
/* eslint quotes: 0 */
// Defines Mongoose model for service `opcuaValues`. (Can be re-generated.)
const merge = require('lodash.merge');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !code: model
  {
    tagId: mongoose.Schema.Types.ObjectId,
    tagName: String,
    storeStart: String,
    storeEnd: String,
    store: {},
    opcuaData: [
      {
        key: String,
        hash: String,
        value: mongoose.Schema.Types.Mixed,
        values: [mongoose.Schema.Types.Mixed],
        params: {}
      }
    ]
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
