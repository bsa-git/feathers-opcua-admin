/* eslint-disable no-unused-vars */
const assert = require('assert');
const app = require('../../src/app');

const loCloneDeep = require('lodash/cloneDeep');

const {
  appRoot,
  inspector,
  checkServicesRegistered,
  saveFakesToServices,
  readJsonFileSync,
} = require('../../src/plugins');

const {
  getIdField,
  getCountItems,
  getItem,
  createItems,
  patchItem,
  findItem,
  findItems,
  handleFoundItems,
  removeItems
} = require('../../src/plugins/db-helpers');


const debug = require('debug')('app:opcua-tags.test');
const isDebug = false;

// Get generated fake data
const fakeData = readJsonFileSync(`${appRoot}/seeds/fake-data.json`) || {};

describe('<<=== DB-Helper Plugin Test (db-helper.test.js) ===>>', () => {

  it('#1: Registered the service', () => {
    let errPath = checkServicesRegistered(app, 'opcua-tags');
    assert.ok(errPath === '', `Service '${errPath}' not registered`);

    errPath = checkServicesRegistered(app, 'opcua-values');
    assert.ok(errPath === '', `Service '${errPath}' not registered`);
  });

  it('#2: Save tags and find tags', async () => {

    // Get generated fake data
    const fakes = loCloneDeep(fakeData);
    // Get opcua tags 
    const opcuaTags = fakes['opcuaTags'];
    if (isDebug && opcuaTags.length) inspector('fakes.opcuaTags.length', opcuaTags.length);

    assert.ok(opcuaTags.length, '"opcua-tags" array must not be empty');

    // Remove data from 'opcua-tags' services 
    const countItems = await getCountItems(app, 'opcua-tags');
    if (countItems) {
      const removedItems = await removeItems(app, 'opcua-tags');
      if (isDebug && removedItems.length) inspector('removeItems.removedItems.length', removedItems.length);
      assert.ok(removedItems.length === countItems, `Not remove data from services "opcua-tags": removedItems.length(${removedItems.length}) = opcuaTags.length(${opcuaTags.length})`);
    }

    // Add tags
    await createItems(app, 'opcua-tags', opcuaTags);

    // Find one tag
    const findedItem = await findItem(app, 'opcua-tags');
    if (isDebug && findedItem) inspector('findItem.findedItem', findedItem);
    assert.ok(opcuaTags.find(tag => tag.browseName === findedItem.browseName), 'Error for test: `Save tags and find tag`');

    // Find all tags
    const findedItems = await findItems(app, 'opcua-tags');
    if (isDebug && findedItems.length) inspector('Find tags from \'opcua-tags\' service', findedItems);
    assert.ok(findedItems.length === opcuaTags.length, 'Error for test: `Save tags and find tags`');
  });

  it('#3: Save fake data to \'opcua-tags\' service', async () => {
    const errPath = await saveFakesToServices(app, 'opcuaTags');
    const service = app.service('opcua-tags');
    const data = await service.find({});
    if (isDebug && data) inspector('Save fake data to \'opcua-tags\' service.data[0]', data.data[0]);
    assert.ok(errPath === '' && data.data.length, `Not save fakes to services - '${errPath}'`);
  });

  it('#4: Save fake data to \'opcua-values\' service', async () => {
    const errPath = await saveFakesToServices(app, 'opcuaValues');
    const service = app.service('opcua-values');
    const data = await service.find({});
    if (isDebug) inspector('Save fake data to \'opcua-values\' service.data[0]', data.data[0]);
    assert.ok(errPath === '' && data.data.length, `Not save fakes to services - '${errPath}'`);
  });

  it('#5: Test handle found values', async () => {

    // Save fakes to services
    await saveFakesToServices(app, 'opcuaTags');

    const cb = function (data) {
      const result = {};
      //-----------------------
      if (data.length && data[0].opcuaData.length) {
        const values = data[0].opcuaData;
        values.forEach(value => {
          result[value.key] = value.value;
        });
      }
      return result;
    };

    // Handle fake data from `opcua-values`
    const processedData = await handleFoundItems(app, 'opcua-values', { tagName: 'CH_M51::ValueFromFile' }, cb);
    if (isDebug && processedData.length) inspector('Handle values from \'opcua-values\' service', processedData);
    assert.ok(processedData.length, 'Error for test: `Handle found values`');
  });

  it('#7: Save store values for test "store-items" hook', async () => {

    const fakes = loCloneDeep(fakeData);
    // Get opcua values 
    const opcuaValues = fakes['opcuaValues'];
    if (isDebug && opcuaValues.length) inspector('fakes.opcuaValues.length', opcuaValues.length);

    // Save fakes to services
    await saveFakesToServices(app, 'opcuaTags');
    await saveFakesToServices(app, 'opcuaValues');

    const groupTag = await findItem(app, 'opcua-tags', { group: true, store: { $ne: undefined } });
    if (isDebug && groupTag) inspector('Save store values for test "store-items" hook.groupTag:', groupTag);
    if (groupTag) {
      const groupBrowseName = groupTag.browseName;
      const storeTags = await findItems(app, 'opcua-tags', { ownerGroup: groupBrowseName });
      if (isDebug && storeTags.length) inspector('Save store values for test "store-items" hook.storeTags:', storeTags);
      for (let index = 0; index < storeTags.length; index++) {
        const storeTag = storeTags[index];
        const idField = getIdField(storeTag);
        let storeValue = await findItem(app, 'opcua-values', { tagId: storeTag[idField], storeStart: { $ne: undefined } });
        if (isDebug && storeValue) inspector('Save store values for test "store-items" hook.storeValue:', storeValue);

        const unitsRange = storeTag.valueParams.engineeringUnitsRange;
        const storeTagValue = (unitsRange.high - unitsRange.low) / 2;
        const storeData = {
          tagId: storeValue.tagId,
          tagName: storeValue.tagName,
          storeStart: '2022-01-03',
          storeEnd: '2022-01-03',
          opcuaData: [
            {
              key: '2022-01-03',
              value: storeTagValue
            }
          ]
        };

        // Patch store value
        const id = storeValue[idField].toString();
        const patchValue = await patchItem(app, 'opcua-values', id, storeData);
        if (isDebug && storeValue) inspector('Save store values for test "store-items" hook.patchValue:', patchValue);

        // Get store value 
        storeValue = await getItem(app, 'opcua-values', id);
        if (isDebug && storeValue) inspector('Save store values for test "store-items" hook.storeValue:', storeValue);

        const opcuaValue = opcuaValues.find(v => v[idField] === id);

        const length1 = storeValue.opcuaData.length;
        const length2 = opcuaValue.opcuaData.length;
        assert.ok((length1 - length2) === 1, `length1 must be greater than length2  - (${length1}) - (${length2}) = 1`);
      }
    }
  });

});
