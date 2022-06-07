/* eslint-disable no-unused-vars */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { checkContext, getItems, replaceItems } = require('feathers-hooks-common');

const {
  inspector,
  HookHelper,
  sortByStringField
} = require('../../../plugins');

const loConcat = require('lodash/concat');

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
      let values;
      //----------------------

      if (!record.storeStart) return;
      if (!record.values.length > 1) return;

      const contextId = hh.getContextId();
      if (contextId) {
        // Get store value
        const storeValue = await hh.getItem('opcua-values', contextId);
        // Get storeStart 
        const storeStart = storeValue.storeStart;
        // Get values
        values = storeValue.values.filter(v => v.key !== storeStart);
        values = loConcat(values, record.values);
        values = sortByStringField(values, 'key', true);
        // Set range of stored values
        record.storeStart = values[0].key;
        record.storeEnd = values[values.length - 1].key;
        record.values = sortByStringField(values, 'key', false);
      }
    };
    await hh.forEachRecords(addItems);
    hh.showDebugInfo('opcua-values.patch', false);
    // Place the modified records back in the context.
    hh.replaceRecordsForContext(context);
    return hh.context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
