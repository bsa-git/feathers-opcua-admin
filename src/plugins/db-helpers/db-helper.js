/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const {
  inspector,
} = require('../lib');

const loMerge = require('lodash/merge');
const loIsObject = require('lodash/isObject');
const loConcat = require('lodash/concat');

const debug = require('debug')('app:db-helper');
const isDebug = false;

/**
 * Get dbNullIdValue
 * e.g. for mongodb -> '000000000000000000000000'
 * e.g. for nedb -> '0000000000000000'
 * @return {*}
 */
const dbNullIdValue = function () {
  let result = null;
  if (getEnvTypeDB() === 'mongodb') result = '000000000000000000000000';
  if (getEnvTypeDB() === 'nedb') result = '0000000000000000';
  return result;
};

/**
 * @name getEnvTypeDB
 * Get DB type from env and host config
 * @returns {String}
 * e.g. 'nedb'|'mongodb'
 */
const getEnvTypeDB = function () {
  return process.env.TYPE_DB;
};


/**
   * Get id field
   * @param {Array|Object} items
   * @return {string}
   */
const getIdField = function (items) {
  let idField = '';
  if (Array.isArray(items) && items.length) {
    idField = 'id' in items[0] ? 'id' : '_id';
  }
  if (loIsObject(items) && Object.keys(items).length) {
    idField = 'id' in items ? 'id' : '_id';
  }
  return idField ? idField : new Error('Items argument is not an array or object');
};


//================================================================================

/**
 * Get count items
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object} query
 * @return {Number}
 */
const getCountItems = async function (app, path = '', query = {}) {
  let newQuery, findResults;
  //--------------------
  const service = app.service(path);
  if (service) {
    if (query.query) {
      newQuery = loMerge({}, query, { query: { $limit: 0 } });
    } else {
      newQuery = loMerge({}, query, { $limit: 0 });
      newQuery = { query: newQuery };
    }
    findResults = await service.find(newQuery);
    findResults = findResults.total;
    if (isDebug) inspector(`getCountItems(path='${path}', query=${JSON.stringify(newQuery)}).findResults:`, findResults);
    return findResults;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
   * Get item
   * @async
   * 
   * @param {Object} app
   * @param {String} path
   * @param {String} id
   * @return {Object}
   */
const getItem = async function (app, path = '', id = null) {
  const service = app.service(path);
  if (service) {
    const getResult = await service.get(id);
    if (isDebug) inspector(`getItem(path='${path}', id='${id}').getResult:`, getResult);
    return getResult;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Find item
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object} query
 * @return {Object}
 */
const findItem = async function (app, path = '', query = {}) {
  let newParams, findResults;
  //----------------------------
  const service = app.service(path);
  if (service) {
    if (query.query) {
      newParams = loMerge({}, query, { query: { $limit: 1 } });
    } else {
      newParams = loMerge({}, { query }, { query: { $limit: 1 } });
    }
    findResults = await service.find(newParams);
    if (isDebug) inspector(`findItems(path='${path}', query=${JSON.stringify(query)}).findResults:`, findResults);
    return findResults.data.length? findResults.data[0] : null;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Find items
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object} query
 * @return {Object[]}
 */
const findItems = async function (app, path = '', query = {}) {
  let newParams, findResults, findData = [];
  //----------------------------
  const service = app.service(path);
  if (service) {
    if (query.query) {
      newParams = loMerge({}, query);
    } else {
      newParams = loMerge({}, { query });
    }
    findResults = await service.find(newParams);
    if (isDebug) inspector(`findItems(path='${path}', query=${JSON.stringify(query)}).findResults:`, findResults);
    if (findResults.data.length) {
      const total = findResults.total;
      const limit = findResults.limit;
      const cyclesNumber = Math.trunc(total / limit);
      findData = loConcat(findData, findResults.data);
      for (let index = 1; index <= cyclesNumber; index++) {
        const skip = index * limit;
        newParams = loMerge({}, newParams, { query: { $skip: skip } });
        findResults = await service.find(newParams);
        findData = loConcat(findData, findResults.data);
      }
    }
    return findData;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Find all items
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object} query
 * @return {Object[]}
 */
const findAllItems = async function (app, path = '', query = {}) {
  let newParams, findResults, findData = [];
  //--------------------
  const service = app.service(path);
  if (service) {
    if (query.query) {
      newParams = loMerge({}, query, { paginate: false });
    } else {
      newParams = loMerge({}, { query }, { paginate: false });
    }
    findResults = await service.find(newParams);
    if (isDebug) inspector(`findItems(path='${path}', query=${JSON.stringify(newParams)}).findResults:`, findResults);
    if (!Array.isArray(findResults) && findResults.data.length) {
      const total = findResults.total;
      const limit = findResults.limit;
      const cyclesNumber = Math.trunc(total / limit);
      findData = loConcat(findData, findResults.data);
      for (let index = 1; index <= cyclesNumber; index++) {
        const skip = index * limit;
        newParams = loMerge({}, newParams, { query: { $skip: skip } });
        findResults = await service.find(newParams);
        findData = loConcat(findData, findResults.data);
      }
    }
    return Array.isArray(findResults) ? findResults : findData;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Process found items
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object} query
 * @param {Function} cb
 * @return {Object[]}
 */
const handleFoundItems = async function (app, path = '', query = {}, cb = null) {
  let newParams, findResults, findData = [], handledData = [], handledResult;
  //----------------------------
  const service = app.service(path);
  if (service) {
    if (query.query) {
      newParams = loMerge({}, query);
    } else {
      newParams = loMerge({}, { query });
    }
    findResults = await service.find(newParams);
    if (isDebug) inspector(`db-helper.findItems(path='${path}', query=${JSON.stringify(query)}).findResults:`, findResults);
    if (findResults.data.length) {
      const total = findResults.total;
      const limit = findResults.limit;
      const cyclesNumber = Math.trunc(total / limit);
      if (cb) {
        handledResult = await cb(findResults.data, app);
        if (handledResult !== undefined) handledData.push(handledResult);
      } else {
        findData = loConcat(findData, findResults.data);
      }
      for (let index = 1; index <= cyclesNumber; index++) {
        const skip = index * limit;
        newParams = loMerge({}, newParams, { query: { $skip: skip } });
        findResults = await service.find(newParams);
        if (cb) {
          handledResult = await cb(findResults.data, app);
          if (handledResult !== undefined) handledData.push(handledResult);
        } else {
          findData = loConcat(findData, findResults.data);
        }
      }
    }
    return cb ? handledData : findData;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Remove item
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {String} id
 * @return {Object}
 */
const removeItem = async function (app, path = '', id = null) {
  // id = id.toString();
  const service = app.service(path);
  if (service) {
    const removeResult = await service.remove(id);
    if (isDebug) inspector(`removeItem(path='${path}', id=${id}).removeResult:`, removeResult);
    return removeResult;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Remove items
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object} query
 * @return {Object[]}
 */
const removeItems = async function (app, path = '', query = {}) {
  let deleteResults = [];
  const service = app.service(path);
  if (service) {
    if (query.query) {
      deleteResults = await service.remove(null, query);
    } else {
      deleteResults = await service.remove(null, { query });
    }
    if (isDebug) inspector(`removeItems(path='${path}', query=${JSON.stringify(query)}).removeResults:`, deleteResults);
    return deleteResults;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Patch item
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {String} id
 * @param {Object} data
 * @return {Object}
 */
const patchItem = async function (app, path = '', id = '', data = {}) {
  const service = app.service(path);
  if (service) {
    const patchResults = await service.patch(id, data);
    if (isDebug) inspector(`patchItems(path='${path}', data=${JSON.stringify(data)}, patchResults:`, patchResults);
    return patchResults;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Patch items
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object} data
 * @param {Object} query
 * @return {Object[]}
 */
const patchItems = async function (app, path = '', data = {}, query = {}) {
  let patchResults;
  //-------------------------------
  const service = app.service(path);
  if (service) {
    if (query.query) {
      patchResults = await service.patch(null, data, query);
    } else {
      patchResults = await service.patch(null, data, { query });
    }
    if (isDebug) inspector(`patchItems(path='${path}', data=${JSON.stringify(data)}, query=${JSON.stringify(query)}).patchResults:`, patchResults);
    return patchResults;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Create item
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object} data
 * @return {Object}
 */
const createItem = async function (app, path = '', data = {}) {
  const service = app.service(path);
  if (service) {
    const createResult = await service.create(data);
    if (isDebug) inspector(`createItem(path='${path}', createResults:`, createResult);
    return createResult;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

/**
 * Create items
 * @async
 * 
 * @param {Object} app
 * @param {String} path
 * @param {Object[]} data
 * @return {Object[]}
 */
const createItems = async function (app, path = '', data = []) {
  let createResults = [];
  const service = app.service(path);
  if (service) {
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const createdItem = await service.create(item);
      createResults.push(createdItem);
    }
    if (isDebug) inspector(`createItems(path='${path}', createResults.length:`, createResults.length);
    return createResults;
  } else {
    throw new errors.BadRequest(`There is no service for the path - '${path}'`);
  }
};

module.exports = {
  dbNullIdValue,
  getEnvTypeDB,
  getIdField,
  getCountItems,
  getItem,
  findItem,
  findItems,
  findAllItems,
  handleFoundItems,
  removeItem,
  removeItems,
  patchItem,
  patchItems,
  createItem,
  createItems
};
