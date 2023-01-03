const {appRoot, authenticationServices} = require('../../src/plugins');
const config = require('../../config/default.json');

// Determine if environment allows test to mutate existing DB data.
const env = (config.tests || {}).environmentsAllowingSeedData || [];
if (!env.includes(process.env.NODE_ENV) || process.argv.includes('--noclient')) {
  // eslint-disable-next-line no-console
  console.log('SKIPPED - Test authentication.services.js');// clear-services
} else {
  authenticationServices(appRoot, {
    delayAfterServerOnce: 500,
    delayAfterServerClose: 500,
    timeoutForStartingServerAndClient: 50000,
    timeoutForClosingingServerAndClient: 50000
  });
}
