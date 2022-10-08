/* eslint-disable no-unused-vars */
const { join } = require('path');
const appRoot = join(__dirname, '../../../');
const moment = require('moment');
const hash = require('object-hash');
const logger = require('../../logger');

const loCloneDeep = require('lodash/cloneDeep');
const loReplace = require('lodash/replace');

const debug = require('debug')('app:util');
const isDebug = false;

//=======================================================

/**
 * Delay time
 * @param sec
 * @return {Promise}
 */
const delayTime = function (sec = 1) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      debug(`delayTime: ${sec * 1000} MSec`);
      resolve('done!');
    }, sec * 1000);
  });
};

/**
 * Pause
 * @param ms
 * @return {Promise}
 */
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Awaiting positive completion of a function
 * @param fn
 * @param cb
 * @param delay
 */
const waitTimeout = function (fn, cb = null, delay = 0) {
  let _delay = delay ? delay : 1000;
  let timerId = setTimeout(function request() {
    let result = fn();
    if (!result) {
      timerId = setTimeout(request, _delay);
    } else {
      if (cb) cb();
      clearInterval(timerId);
    }
  }, _delay);
};

/**
 * Awaiting negative completion of a function
 * @async
 * @method waitTimeout
 * @param {Function} fn
 * @param {Array} args
 * @param {Number} wait
 * e.g. result = fn(...args); if(result === false) then -> return from cycle 
 */
const waitTime = async (fn, args = [], wait = 1000) => {
  while (fn(...args)) {
    await pause(wait, true);
  }
};

/**
 * @method waitTill
 * @param {Function} fn 
 * @param {Array} args 
 * @param {Function} thenDo 
 * @param {Array} args2 
 * @returns 
 */
const waitTill = (fn, args = [], thenDo, args2 = []) => {
  const isWait = fn(...args);
  if (!isWait) {
    thenDo(...args2);
    return;
  }
  setTimeout(() => { waitTill(fn, args = [], thenDo, args2 = []); }, 1000);
};

/**
 * @method isValidDateTime
 * e.g. dt='2013-02-08 09:30:26'|dt='2013-02-08T09:30:26'|dt='20130208T080910,123'|dt='20130208T080910.123'|dt='20130208T080910,123'|dt='20130208T08'
 * @param {Number|String} dt 
 * @returns {Boolean}
 */
const isValidDateTime = function (dt = '') {
  return moment(dt).isValid();
};

/**
 * @method dtToObject
 * e.g. { year: 2020, month: 9, date: 22, hours: 13, minutes: 31, seconds: 10, milliseconds: 555 }
 * @param {Number|String} dt 
 * @param {Boolean} isUtc 
 * @returns {Object}
 */
const dtToObject = function (dt = '', isUtc = true) {
  if (isUtc) {
    dt = moment.utc(dt === '' ? undefined : dt);
  } else {
    dt = moment(dt === '' ? undefined : dt);
  }
  dt = dt.toObject();
  dt.months = dt.months + 1;
  return dt;
};

/**
 * @method getDate
 * @param {Number|String} dt 
 * @param {Boolean} isUtc 
 * @returns {String} e.g. 2021-01-10
 */
const getDate = function (dt = '', isUtc = true) {
  dt = dtToObject(dt, isUtc);
  return `${dt.years}-${dt.months}-${dt.date}`;
};

/**
 * @method getTime
 * @param {Number|String} dt 
 * @param {Boolean} isUtc 
 * @returns {String} e.g. 15:50:10.134
 */
const getTime = function (dt = '', isUtc = true) {
  dt = dtToObject(dt, isUtc);
  return `${dt.hours}:${dt.minutes}:${dt.seconds}.${dt.milliseconds}`;
};

/**
 * @method getDateTime
 * @param {Number|String} dt 
 * @param {Boolean} isUtc 
 * @returns {String} e.g. 2021-01-10T15:50:10.134
 */
const getDateTime = function (dt = '', isUtc = true) {
  dt = dtToObject(dt, isUtc);
  return `${dt.years}-${dt.months}-${dt.date}T${dt.hours}:${dt.minutes}:${dt.seconds}.${dt.milliseconds}`;
};

/**
 * @method getTimeDuration
 * @param {Object|String|Array} startTime 
 * @param {Object|String|Array} endTime 
 * @param {String} unit 
 * e.g. years, months, weeks, days, hours, minutes, seconds, and milliseconds 
 * @returns {Number}
 */
const getTimeDuration = function (startTime, endTime, unit) {
  startTime = moment.utc(startTime);
  endTime = moment.utc(endTime);
  if (unit) {
    return endTime.diff(startTime, unit);
  } else {
    return endTime.diff(startTime);// return -> milliseconds
  }
};

/**
 * @method getNextDateTime
 * @param {Object|String|Array} startTime 
 * @param {Array} period 
 * e.g. [1, 'hours']
 * @param {Boolean} isUtc 
 * @returns {Number}
 */
const getNextDateTime = function (startDateTime, period, isUtc = true) {
  startDateTime = moment.utc(startDateTime);
  const nextDateTime = moment.utc(startDateTime).add(period[0], period[1]);
  if (isUtc) {
    return moment.utc(nextDateTime).format();
  } else {
    return moment(nextDateTime).format();
  }
};

/**
 * @method getPreviousDateTime
 * @param {Object|String|Array} startTime 
 * @param {Array} period 
 * e.g. [1, 'hours']
 * @param {Boolean} isUtc 
 * @returns {Number}
 */
const getPreviousDateTime = function (startDateTime, period, isUtc = true) {
  startDateTime = moment.utc(startDateTime);
  const nextDateTime = moment.utc(startDateTime).subtract(period[0], period[1]);
  if (isUtc) {
    return moment.utc(nextDateTime).format();
  } else {
    return moment(nextDateTime).format();
  }
};

/**
 * @method getStartOfPeriod
 * @param {Object|String|Array} dateTime 
 * e.g. moment()|'2022-05-15T10:55:11'|[2022, 4, 15, 10, 55, 11]
 * @param {Array} period
 * e.g. [1, 'months'] | [-1, 'months']
 * @returns {String} 
 * e.g. '2022-05-01T00:00:00' | '2022-04-01T00:00:00'
 */
const getStartOfPeriod = function (dateTime, period) {
  let startList = [], startPeriod, condition;
  let _dateTime = cloneObject(dateTime), _period = cloneObject(period);
  //-----------------------------------------
  if (!Array.isArray(_period)) new Error('Argument error, argument "period" must be an array');
  // Get start dateTime
  if (_period[0] < 0) {
    _dateTime = moment.utc(_dateTime).subtract(Math.abs(_period[0]), _period[1]).format('YYYY-MM-DDTHH:mm:ss');
    _period[0] = Math.abs(_period[0]);
  } else {
    _dateTime = moment.utc(_dateTime).format('YYYY-MM-DDTHH:mm:ss');
  }
  startPeriod = moment.utc(_dateTime).startOf('year');
  startList.push(startPeriod.format('YYYY-MM-DDTHH:mm:ss'));

  do {
    startPeriod = startPeriod.add(..._period);
    condition = (_dateTime >= startPeriod.format('YYYY-MM-DDTHH:mm:ss'));
    if (condition) {
      startList.push(startPeriod.format('YYYY-MM-DDTHH:mm:ss'));
    }
  } while (condition);

  if (isDebug && startList.length) console.log('util.getStartOfPeriod.startList:', startList);
  return startList[startList.length - 1];
};

/**
 * @method getEndOfPeriod
 * @param {Object|String|Array} dateTime 
 * e.g. moment()|'2022-05-15T10:55:11'|[2022, 4, 15, 10, 55, 11]
 * @param {Array} period
 * e.g. [1, 'months'] | [-1, 'months']
 * @returns {String} 
 * e.g. '2022-05-31T23:59:59' | '2022-04-31T23:59:59'
 */
const getEndOfPeriod = function (dateTime, period) {
  let startList = [], startPeriod, endPeriod, condition;
  let _dateTime = cloneObject(dateTime), _period = cloneObject(period);
  //--------------------------------------------------------------------
  if (!Array.isArray(_period)) new Error('Argument error, argument "period" must be an array');
  // Get start dateTime
  if (_period[0] < 0) {
    _dateTime = moment.utc(_dateTime).subtract(Math.abs(_period[0]), _period[1]).format('YYYY-MM-DDTHH:mm:ss');
    _period[0] = Math.abs(_period[0]);
  } else {
    _dateTime = moment.utc(_dateTime).format('YYYY-MM-DDTHH:mm:ss');
  }
  startPeriod = moment.utc(_dateTime).startOf('year');
  startPeriod = startPeriod.add(..._period).format('YYYY-MM-DDTHH:mm:ss');
  endPeriod = moment.utc(startPeriod).subtract(1, 'seconds');

  do {
    startList.push(endPeriod.format('YYYY-MM-DDTHH:mm:ss'));
    condition = (_dateTime > endPeriod.format('YYYY-MM-DDTHH:mm:ss'));
    startPeriod = moment.utc(startPeriod).add(..._period).format('YYYY-MM-DDTHH:mm:ss');
    endPeriod = moment.utc(startPeriod).subtract(1, 'seconds');
  } while (condition);

  if (isDebug && startList.length) console.log('util.getStartOfPeriod.startList:', startList);
  return startList[startList.length - 1];
};

/**
 * @method getStartEndOfPeriod
 * @param {Object|String|Array} dateTime 
 * e.g. moment()|'2022-05-15T10:55:11'|[2022, 4, 15, 10, 55, 11]
 * @param {Array} period
 * e.g. [1, 'months'] 
 * @returns {String[]} 
 * e.g. ['2022-05-01T00:00:00', '2022-05-31T23:59:59']
 */
const getStartEndOfPeriod = function (dateTime, period) {
  const start = getStartOfPeriod(dateTime, period);
  const end = getEndOfPeriod(dateTime, period);
  return [start, end];
};

/**
 * @method getRangeStartEndOfPeriod
 * @param {Object|String|Array} dateTime 
 * e.g. moment()|'2022-05-15T10:55:11'|[2022, 4, 15, 10, 55, 11]
 * @param {Array} period
 * e.g. [5, 'years']|[-5, 'years']|moment()|'2022-05-15T10:55:11'|[2022, 4, 15, 10, 55, 11]
 * @param {String} unit
 * e.g. 'years'|'months'|'days'|'hours'|'minutes'|'seconds'
 * @returns {Number[]} 
 * e.g. ['2022', '2023', '2024', '2025', '2026'] | ['2017', '2018', '2019', '2020', '2021']
 */
const getRangeStartEndOfPeriod = function (dateTime, period, unit = 'years') {
  let rangeList = [], condition, unitFormat;
  let startPeriod, endPeriod;
  //----------------------------
  if (Array.isArray(period) && period.length === 2) {
    startPeriod = getStartOfPeriod(dateTime, period);
    endPeriod = getEndOfPeriod(dateTime, period);
  } else {
    startPeriod = moment.utc(dateTime).format('YYYY-MM-DDTHH:mm:ss');
    endPeriod = moment.utc(period).format('YYYY-MM-DDTHH:mm:ss');
  }

  // Get unitFormat
  if (unit === 'years') unitFormat = 'YYYY';
  if (unit === 'months') unitFormat = 'YYYY-MM';
  if (unit === 'days') unitFormat = 'YYYY-MM-DD';
  if (unit === 'hours') unitFormat = 'YYYY-MM-DDTHH';
  if (unit === 'minutes') unitFormat = 'YYYY-MM-DDTHH:mm';
  if (unit === 'seconds') unitFormat = 'YYYY-MM-DDTHH:mm:ss';

  rangeList.push(moment.utc(startPeriod).format(unitFormat));

  do {
    startPeriod = moment.utc(startPeriod).add(...[1, unit]).format(unitFormat);
    condition = (endPeriod >= startPeriod);
    if (condition) {
      rangeList.push(startPeriod);
    }
  } while (condition);
  return rangeList;
};


/**
 * Strip slashes
 * @param value String
 * @return {XML|string|*|void}
 */
const stripSlashes = function (value) {
  return value.replace(/^(\/*)|(\/*)$/g, '');
};

/**
 * Strip slashes
 * @param value String
 * @param symbol String
 * @return {string|*|void}
 */
const stripSpecific = function (value, symbol = '') {
  const regEx = new RegExp('^[' + symbol + ']+|[' + symbol + ']+$', 'g');
  const trimValue = symbol ? value.replace(regEx, '') : value.trim();
  return trimValue;
};

/**
 * Replace string
 * @param {String} value 
 * @param {String} substr 
 * @param {String} newSubstr 
 * @returns 
 */
const strReplace = function (value, substr, newSubstr = '') {
  const regEx = new RegExp(substr, 'gi');
  const replacedValue = value.replace(regEx, newSubstr);
  return replacedValue;
};

/**
 * Replace string extended
 * @param {String} value 
 * e.g. 'c:\\temp\\lib'
 * @param {String|RegExp} substr 
 * e.g. String -> '\\'
 * e.g. RegExp -> /\\/gi
 * @param {String} newSubstr 
 * e.g. '/'
 * @returns {String} 
 * e.g. 'c:/temp\\lib'
 * e.g. 'c:/temp/lib'
 */
const strReplaceEx = function (value, substr, newSubstr = '') {
  const replacedValue = loReplace(value, substr, newSubstr);
  return replacedValue;
};

/**
 * Get capitalize string
 * @param value
 * @param prefix
 */
const getCapitalizeStr = function (value, prefix = '') {
  const loCapitalize = require('lodash/capitalize');
  const loWords = require('lodash/words');
  let _value = loCapitalize(value);
  if (prefix) {
    let words = loWords(_value).map(word => loCapitalize(word));
    _value = words.join('');
    _value = prefix + _value;
  }
  return _value;
};

/**
 * Is true
 * @param value String|Any
 * @return boolean
 */
const isTrue = function (value) {
  if (typeof (value) === 'string') {
    value = value.trim().toLowerCase();
  }
  switch (value) {
  case true:
  case 'true':
  case 1:
  case '1':
  case 'on':
  case 'yes':
    return true;
  default:
    return false;
  }
};

/**
 * Get number from value
 * @param value
 * @return {number}
 */
const getNumber = function (value) {
  return Number.isInteger(value) ? value : Number.parseInt(value);
};

/**
 * Get Regex
 * @param type
 * @return {String}
 */
const getRegex = function (type) {
  if (typeof (type) === 'string') {
    type = type.trim().toLowerCase();
  }
  switch (type) {
  case 'phone':
    /*
      (123) 456-7890
      +(123) 456-7890
      +(123)-456-7890
      +(123) - 456-7890
      +(123) - 456-78-90
      123-456-7890
      123.456.7890
      1234567890
      +31636363634
      +380980029669
      075-63546725
      */
    return '^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\\s\\./0-9]*$';
  case 'zip_code':
    /*
      12345
      12345-6789
      */
    return '^[0-9]{5}(?:-[0-9]{4})?$';
  case 'lat':
    /*
      +90.0
      45
      -90
      -90.000
      +90
      47.123123
      */
    return '^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$';
  case 'long':
    /*
      -127.554334
      180
      -180
      -180.0000
      +180
      179.999999
      */
    return '^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$';
  case 'lat_and_long':
    /*
      +90.0, -127.554334
      45, 180
      -90, -180
      -90.000, -180.0000
      +90, +180
      47.1231231, 179.99999999
      */
    return '^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$';
  default:
    return '//g';
  }
};


/**
 * Inspector to display objects
 * @param desc
 * @param obj
 * @param depth
 */
const inspector = function (desc, obj, depth = 6) {
  const { inspect } = require('util');
  console.log(`\n${desc}`);
  console.log(inspect(obj, { depth, colors: true }));
};

/**
 * Query params
 * @param obj
 * @returns {string}
 */
const qlParams = function (obj) {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Expected object. (qlParams)');
  }

  return stringify(obj, undefined, undefined, '', '');
};

/**
 * Stringify to represent an object as a string
 * @param obj
 * @param spacer
 * @param separator
 * @param leader
 * @param trailer
 * @returns {string}
 */
const stringify = function (obj, spacer = ' ', separator = ', ', leader = '{', trailer = '}') {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return JSON.stringify(obj);
  }

  const str = Object
    .keys(obj)
    .map(key => `${key}:${spacer}${stringify(obj[key], spacer, separator)}`)
    .join(', ');

  return `${leader}${str}${trailer}`;
};

/**
 * The value to recursively clone
 * @method cloneObject
 * @param {Object?} obj - Object to clone
 * @returns {Object} Cloned object
 */
const cloneObject = function (obj) {
  return loCloneDeep(obj);
};


/**
 * sort array by string field
 * @param items {Array}
 * @param name {String}
 * @param isAscending {Boolean}
 */
const sortByStringField = function (items, name, isAscending = true) {
  items.sort((x, y) => {
    let textA = x[name].toLocaleUpperCase();
    let textB = y[name].toLocaleUpperCase();
    if (isAscending) return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    if (!isAscending) return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
  });
  return items;
};

/**
 * sort array by number field
 * @param items {Array}
 * @param name {String}
 * @param isAscending {Boolean}
 */
const sortByNumberField = function (items, name, isAscending = true) {
  items.sort((x, y) => {
    if (isAscending) return x[name] - y[name];
    if (!isAscending) return y[name] - x[name];
  });
  return items;
};

/**
 * sort array by string
 * @param items {Array}
 * @param isAscending {Boolean}
 */
const sortByString = function (items, isAscending = true) {
  items.sort((x, y) => {
    let textA = x.toLocaleUpperCase();
    let textB = y.toLocaleUpperCase();
    if (isAscending) return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    if (!isAscending) return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
  });
  return items;
};

/**
 * sort array by number field
 * @param items {Array}
 * @param isAscending {Boolean}
 */
const sortByNumber = function (items, isAscending = true) {
  items.sort((x, y) => {
    if (isAscending) return x - y;
    if (!isAscending) return y - x;
  });
  return items;
};

/**
 * Generate a hash from any object or type. Defaults to sha1 with hex encoding.
 * @method objectHash
 * @param {Object|Array|any} value 
 * @param {Object} options 
 * algorithm hash algo to be used: 'sha1', 'md5', 'passthrough'. default: sha1
  This supports the algorithms returned by crypto.getHashes(). Note that the default of SHA-1 is not considered secure, 
  and a stronger algorithm should be used if a cryptographical hash is desired.
  This also supports the passthrough algorith, which will return the information that would otherwise have been hashed.
 * excludeValues {true|false} hash object keys, values ignored. default: false
 * encoding hash encoding, supports 'buffer', 'hex', 'binary', 'base64'. default: hex
 * ignoreUnknown {true|*false} ignore unknown object types. default: false
 * replacer optional function that replaces values before hashing. default: accept all values
 * respectFunctionProperties {true|false} Whether properties on functions are considered when hashing. default: true
 * respectFunctionNames {true|false} consider name property of functions for hashing. default: true
 * respectType {true|false} Whether special type attributes (.prototype, .__proto__, .constructor) are hashed. default: true
 * unorderedArrays {true|false} Sort all arrays before hashing. Note that this affects all collections, i.e. including typed arrays, Sets, Maps, etc. default: false
 * unorderedSets {true|false} Sort Set and Map instances before hashing, i.e. make hash(new Set([1, 2])) == hash(new Set([2, 1])) return true. default: true
 * unorderedObjects {true|false} Sort objects before hashing, i.e. make hash({ x: 1, y: 2 }) === hash({ y: 2, x: 1 }). default: true
 * excludeKeys optional function for excluding specific key(s) from hashing, if true is returned then exclude from hash. default: include all keys
 * @returns {String}
 */
const objectHash = function (value, options) {
  return hash(value, options);
};
  
/**
   * Hash using the sha1 algorithm.
   * Note that SHA-1 is not considered secure, and a stronger algorithm should be used if a cryptographical hash is desired.
   * Sugar method, equivalent to hash(value, {algorithm: 'sha1'})
   * @method objectHashSha1
   * @param {Object|Array|any} value 
   * @returns {String}
   */
const objectHashSha1 = function (value) {
  return hash.sha1(value);
};
  
/**
   * Hash object keys using the sha1 algorithm, values ignored
   * Sugar method, equivalent to hash(value, {excludeValues: true})
   * @method objectHashKeys
   * @param {Object|Array|any} value 
   * @returns {String}
   */
const objectHashKeys = function (value) {
  return hash.keys(value);
};
  
/**
   * Hash using the md5 algorithm.
   * Note that the MD5 algorithm is not considered secure, and a stronger algorithm should be used if a cryptographical hash is desired.
   * @method objectHashMD5
   * @param {Object|Array|any} value 
   * @returns {String}
   */
const objectHashMD5 = function (value) {
  return hash.MD5(value);
};
  
/**
   * Hash object keys using the md5 algorithm, values ignored.
   * Note that the MD5 algorithm is not considered secure, and a stronger algorithm should be used if a cryptographical hash is desired.
   * Sugar method, equivalent to hash(value, {algorithm: 'md5', excludeValues: true})
   * @method objectHashKeysMD5
   * @param {Object|Array|any} value 
   * @returns {String}
   */
const objectHashKeysMD5 = function (value) {
  return hash.keysMD5(value);
};
  
/**
   * Write the information that would otherwise have been hashed to a stream.
   * Note that the MD5 algorithm is not considered secure, and a stronger algorithm should be used if a cryptographical hash is desired.
   * @method objectHashMD5
   * @param {Object|Array|any} value 
   * @param {Stream} stream 
   * @param {Object} options 
   * @returns {String}
   * e.g. hash.writeToStream({foo: 'bar', a: 42}, {respectType: false}, process.stdout)
   * e.g. -> 'object:a:number:42foo:string:bar'
   */
const objectHashWriteToStream = function (value, stream, options = {}) {
  return hash.writeToStream(value, options, stream);
};


module.exports = {
  appRoot,
  logger,
  delayTime,
  pause,
  waitTimeout,
  waitTime,
  waitTill,
  dtToObject,
  getDate,
  getTime,
  getDateTime,
  isValidDateTime,
  getTimeDuration,
  getNextDateTime,
  getPreviousDateTime,
  getStartOfPeriod,
  getEndOfPeriod,
  getStartEndOfPeriod,
  getRangeStartEndOfPeriod,
  stripSlashes,
  stripSpecific,
  strReplace,
  strReplaceEx,
  getCapitalizeStr,
  isTrue,
  getNumber,
  getRegex,
  inspector,
  qlParams,
  stringify,
  cloneObject,
  sortByStringField,
  sortByNumberField,
  sortByString,
  sortByNumber,
  objectHash,
  objectHashSha1,
  objectHashKeys,
  objectHashMD5,
  objectHashKeysMD5,
  objectHashWriteToStream
};
