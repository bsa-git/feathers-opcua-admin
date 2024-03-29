const {getItems, replaceItems} = require('feathers-hooks-common');
const {AuthServer, isTrue, HookHelper, getLogMessage} = require('../plugins');
const debug = require('debug')('app:hooks.my-log');

const isDebug = false;

module.exports = function (isTest = false) {
  return async context => {

    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    let records = getItems(context);

    // Create HookHelper object
    const hookHelper = new HookHelper(context);
    // Show debug info
    hookHelper.showDebugInfo('', isDebug);
    // hookHelper.showDebugInfo('opcua-tags', true);
    hookHelper.showDebugError();

    // hookHelper.showDebugInfo('authentication.remove.after', true);
    hookHelper.showDebugInfo('users.get.before', true, true); // isConn = true (show connect and headers)

    // Is log msg enable
    const isDebugMsgEnable = isTest ||
        isTrue(process.env.LOGMSG_ENABLE) &&
        !AuthServer.isTest() &&
        (hookHelper.contextProvider ||
          hookHelper.isMask('authentication.remove.after') ||
          hookHelper.isMask('mailer.create.before') ||
          hookHelper.isMask('mailer.create.after') ||
          hookHelper.contextError
        );

    if(isDebugMsgEnable){
      // Get log message
      const logMsg = await getLogMessage(context);
      // Save log message
      if(logMsg){
        if(isDebug) debug('logMsg:', logMsg);
        await hookHelper.createItem('log-messages', logMsg);
      }
    }
    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};
