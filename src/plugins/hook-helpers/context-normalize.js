/* eslint-disable no-unused-vars */
const { inspector, isString, isObject, isNumber, isNull } = require('../lib');
const HookHelper = require('./hook-helper.class');
const AuthServer = require('../auth/auth-server.class');
const loToNumber = require('lodash/toNumber');

const isLog = false;


/**
 * Base normalize
 * @param record
 */
const baseNormalize = async (record) => {
  if (!record) return;
  let _cloneObject = JSON.parse(JSON.stringify(record));
  Object.assign(record, _cloneObject);
  if (isLog) inspector('plugins.contextNormalize::record:', record);
};


/**
 * Before normalize create user
 * @async
 * @method beforeNormalizeCreateUser
 * @param {Object} record
 */
const beforeNormalizeCreateUser = async (record) => {
  if (!record) return;
  if (AuthServer.isSetUserActive()) {
    if (record.active === undefined || !record.active) {
      record.active = true;
    }
  }

  // if (!AuthServer.isAuthManager()) {
  //   record.isVerified = true;
  // }
};


/**
 * Before normalize user auth
 * @async
 * @param {Object} record
 */
const beforeNormalizeUserAuth = async (record) => {
  let date, _record = {};
  //---------------------
  if (!record) return;
  //--- Normalize -> verifyExpires Date ---
  if (isNull(record.verifyExpires)) {
    date = new Date(0);
    _record.verifyExpires = date.toJSON();
  }
  if (isNumber(record.verifyExpires)) {
    date = new Date(record.verifyExpires);
    _record.verifyExpires = date.toJSON();
  }
  if (isObject(record.verifyExpires)) {
    _record.verifyExpires = record.verifyExpires.toJSON();
  }
  if (isString(record.verifyExpires)) {
    date = new Date(record.verifyExpires);
    _record.verifyExpires = date.toJSON();
  }

  //--- Normalize -> resetExpires  Date ---
  if (isNull(record.resetExpires)) {
    date = new Date(0);
    _record.resetExpires = date.toJSON();
  }
  if (isNumber(record.resetExpires)) {
    date = new Date(record.resetExpires);
    _record.resetExpires = date.toJSON();
  }
  if (isObject(record.resetExpires)) {
    _record.resetExpires = record.resetExpires.toJSON();
  }
  if (isString(record.resetExpires)) {
    date = new Date(record.resetExpires);
    _record.resetExpires = date.toJSON();
  }
  //--- Normalize -> verifyToken ---
  if (isNull(record.verifyToken)) {
    _record.verifyToken = '';
  }
  //--- Normalize -> verifyShortToken ---
  if (isNull(record.verifyShortToken)) {
    _record.verifyShortToken = '';
  }
  //--- Normalize -> resetToken ---
  if (isNull(record.resetToken)) {
    _record.resetToken = '';
  }
  //--- Normalize -> resetShortToken ---
  if (isNull(record.resetShortToken)) {
    _record.resetShortToken = '';
  }
  Object.assign(record, _record);
  if (isLog) inspector('plugins.contextNormalize::record:', record);
};

/**
 * After normalize user auth
 * @async
 * @param {Object} record
 */
const afterNormalizeUserAuth = async (record) => {
  let _record = {};
  //----------------
  if (!record) return;
  //--- Normalize -> verifyExpires  Date ---
  if (isNull(record.verifyExpires)) {
    _record.verifyExpires = 0;
  }
  if (isObject(record.verifyExpires)) {
    _record.verifyExpires = Date.parse(record.verifyExpires.toJSON());
  }
  if (isString(record.verifyExpires)) {
    _record.verifyExpires = Date.parse(record.verifyExpires);
  }
  //--- Normalize -> resetExpires  Date ---
  if (isNull(record.resetExpires)) {
    _record.resetExpires = 0;
  }
  if (isObject(record.resetExpires)) {
    _record.resetExpires = Date.parse(record.resetExpires.toJSON());
  }
  if (isString(record.resetExpires)) {
    _record.resetExpires = Date.parse(record.resetExpires);
  }
  Object.assign(record, _record);
  if (isLog) inspector('plugins.contextNormalize::record:', record);
};


/**
 * Context normalize
 * @async
 * @param {Object} context
 * @return {Array|Object}
 */
module.exports = async function contextNormalize(context) {
  // let normalize = null;
  // Create HookHelper object
  const hh = new HookHelper(context);// contextMethod
  // Run base normalize
  if (hh.contextType === 'before' || hh.contextType === 'after') {
    await hh.forEachRecords(baseNormalize);
  }
  // Run normalize
  switch (`${hh.contextPath}.${hh.contextType}`) {
  case 'users.before':
    if (hh.contextMethod === 'create') await hh.forEachRecords(beforeNormalizeCreateUser);
    await hh.forEachRecords(beforeNormalizeUserAuth);
    break;
  case 'users.after':
    await hh.forEachRecords(afterNormalizeUserAuth);
    break;
  default:
    break;
  }
  return hh.contextRecords;
};
