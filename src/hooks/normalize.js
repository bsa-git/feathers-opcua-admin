const { replaceItems } = require('feathers-hooks-common');
const { inspector, HookHelper, contextNormalize } = require('../plugins');

const isLog = false;

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  // Return the actual hook.
  return async (context) => {
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    // let records = getItems(context);

    // Create HookHelper object
    const hh = new HookHelper(context);
    // Show debug info
    hh.showDebugInfo('', isLog);

    const records = await contextNormalize(context);
    if (isLog) inspector('hooks.normalize::records:', records);

    // Place the modified records back in the context.
    replaceItems(context, records);

    // Best practice: hooks should always return the context.
    return context;
  };
};