/* eslint-disable no-unused-vars */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');
const { checkContext, getItems, replaceItems } = require('feathers-hooks-common');

const {
  inspector,
  HookHelper,
  sortByStringField,
  objectHash
} = require('../../../plugins');

const loConcat = require('lodash/concat');

const debug = require('debug')('app:hook.store-items');
const isDebug = false;

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {

  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ['find', 'get', 'create', 'update', 'patch', 'remove']);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    // Create HookHelper object
    const hh = new HookHelper(context);

    // Add items
    const addItems = async record => {
      let values, valueHash = '';
      //----------------------

      if (!record.storeStart) return;
      if (!record.opcuaData.length) return;
      if (record.opcuaData.length > 1) {
        record.opcuaData = [record.opcuaData[0]];
      }
      if(isDebug && record) inspector('hook.store-items.addItems.record:', record);

      const contextId = hh.getContextId();
      if (contextId) {
        // Set hash value
        if (record.opcuaData[0].values && record.opcuaData[0].values.length) {
          valueHash = objectHash(record.opcuaData[0].values);
        } else {
          valueHash = objectHash(record.opcuaData[0].value);
        }
        if (record.opcuaData[0].hash && record.opcuaData[0].hash !== valueHash) {
          throw new errors.BadRequest(`A "opcua-values" service have not a record with record.values#value.hash === ${valueHash}`);
        } else {
          if (!record.opcuaData[0].hash) record.opcuaData[0].hash = valueHash;
        }

        // Get store value
        const storeValue = await hh.getItem('opcua-values', contextId);
        if(isDebug && storeValue) inspector('hook.store-items.addItems.storeValue:', storeValue);
        // Get storeStart 
        const storeStart = record.storeStart;
        // Get values
        values = storeValue.opcuaData.filter(v => v.key !== storeStart);
        values = loConcat(values, record.opcuaData);
        // Ascending sort by string field
        values = sortByStringField(values, 'key', true);
        // Set range of stored values
        record.storeStart = values[0].key;
        record.storeEnd = values[values.length - 1].key;
        // Descending sort Ascending by string field 
        record.opcuaData = sortByStringField(values, 'key', false);
        
        // Set record.store.hash value
        const valueHashes = record.opcuaData.map(v => v.hash);
        record.store = Object.assign(storeValue.store, { count: valueHashes.length, hash: objectHash(valueHashes) });
        if(isDebug && record) inspector('hook.store-items.addItems.UpdateRecord:', record);
      }
    };
    await hh.forEachRecords(addItems);
    hh.showDebugInfo('opcua-values.patch', false);
    // Place the modified records back in the context.
    return hh.replaceRecordsForContext(context);
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
