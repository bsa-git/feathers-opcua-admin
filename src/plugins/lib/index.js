
const doesFileExist = require('./does-file-exist');
const { doesUrlExist, isUrlExist } = require('./does-url-exist');
const readJsonFileSync = require('./read-json-file-sync');
const writeJsonFileSync = require('./write-json-file-sync');
const util = require('./util');
const typeOf = require('./type-of');
const langHelpers = require('./lang-helpers');
const netOperations = require('./net-operations');

module.exports = Object.assign({},
  {
    doesFileExist,
    doesUrlExist,
    isUrlExist,
    readJsonFileSync,
    writeJsonFileSync,
  },
  util,
  typeOf,
  langHelpers,
  netOperations
);
