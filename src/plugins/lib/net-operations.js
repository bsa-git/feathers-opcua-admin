/* eslint-disable no-unused-vars */
const dns = require('dns');
const debug = require('debug')('app:net-operations');

const { 
  isTrue
} = require('./util');

//---------------- NET -------------//

/**
 * @method getLocalIpAddress
 * @returns {Object}
 */
const getLocalIpAddress = function () {
  const { networkInterfaces } = require('os');

  const nets = networkInterfaces();
  const results = {}; // or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }

        results[name].push(net.address);
      }
    }
  }
  return results;
};

/**
 * @method getIpAddresses
 * @returns {Array}
 */
const getIpAddresses = function () {
  const ipAddresses = [];
  const { networkInterfaces } = require('os');
  const interfaces = networkInterfaces();
  Object.keys(interfaces).forEach(function (interfaceName) {
    let alias = 0;

    interfaces[interfaceName].forEach((iFace) => {
      if ('IPv4' !== iFace.family || iFace.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        // console.log(interfaceName + ':' + alias, iFace.address);
        ipAddresses.push(iFace.address);
      } else {
        // this interface has only one ipv4 address
        // console.log(interfaceName, iFace.address);
        ipAddresses.push(iFace.address);
      }
      ++alias;
    });
  });
  return ipAddresses;
};

/**
 * @method getHostname
 * @returns {String}
 */
const getHostname = function () {
  const os = require('os');
  return os.hostname().toLowerCase();
};

/**
 * Get an instance of a class 'URL'
 * @method getPaseUrl
 * The absolute or relative input URL to parse. If input is relative, then base is required. If input is absolute, the base is ignored.
 * @param {String} url
 * The base URL to resolve against if the input is not absolute. 
 * @param {String} base 
 * @returns {Object}
 */
const getParseUrl = function (url, base) {
  // const url = require('url');
  const URL = require('url').URL;
  // return url.parse(aUrl);
  return new URL(url, base);
};

/**
 * @method isIP
 * @param {String} ip 
 * @returns {Int32}
 */
const isIP = function (ip) {
  const net = require('net');
  return net.isIP(ip);
};

/**
 * @method getMyIp
 * @returns {String}
 */
const getMyIp = function () {
  return getIpAddresses().length ? getIpAddresses()[0] : '';
};

/**
 * @method isMyIp
 * @param {Array} ips
 * @param {Boolean} exclude
 * @returns {Boolean}
 */
const isMyIp = function (ips = [], exclude = true) {
  const findedIp = ips.find(ip => exclude ? ip !== getMyIp() : ip === getMyIp());
  return !!findedIp;
};

/**
 * Set my "localhost" to my IP
 * @method setLocalhostToMyIP
 * e.g. "localhost" -> "10.60.5.128"
 * e.g. "http://localhost:3030" -> "http://10.60.5.128:3030"
 */
const setLocalhostToMyIP = function () {
  const isMyLocalhostToIP = isTrue(process.env.MY_LOCALHOST_TO_IP);
  const isLocalhost = process.env.HOST === 'localhost';
  if (isMyLocalhostToIP && isLocalhost && getMyIp()) {
    process.env.HOST = getMyIp();
    process.env.BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
    if (true && process.env.HOST) {
      console.log('process.env.HOST', process.env.HOST);
      console.log('process.env.BASE_URL', process.env.BASE_URL);
    }
  }
};


//---------------- DNS -------------//

/**
 * @method dnsLookup
 * @param {String} url 
 * @returns {Promise}
 */
const dnsLookup = function (url) {
  return new Promise((resolve, reject) => {
    dns.lookup(url, (err, addresses, family) => {
      if (err) {
        console.log('dnsLookup.error: ', err);
        reject('dnsLookup ERR');
        return;
      }
      resolve({addresses, family});
    });
  });
};


module.exports = {
  getLocalIpAddress,
  getIpAddresses,
  getHostname,
  getParseUrl,
  isIP,
  getMyIp,
  isMyIp,
  setLocalhostToMyIP,
  dnsLookup
};
