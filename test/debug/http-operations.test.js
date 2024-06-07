/* eslint-disable no-unused-vars */
const assert = require('assert');
const app = require('../../src/app');
const host = app.get('host');
const port = app.get('port');
const shouldProxy = require('should-proxy');
const axios = require('axios');

const {
  inspector,
  startListenPort,
  stopListenPort,
} = require('../../src/plugins');

const {
  getParseUrl,
} = require('../../src/plugins/lib/net-operations');

const {
  getHttp,
  reqHttp,
  getHttps,
  reqHttps,
  isUrlExists
} = require('../../src/plugins/lib/http-operations');

const isDebug = false;

const envNoProxy = process.env.no_proxy;
if(true && envNoProxy) console.log('envNoProxy:', envNoProxy);

let hostname = getParseUrl('http://192.168.3.5:3030').hostname;
let isProxy = shouldProxy(`http://${hostname}`, { no_proxy: envNoProxy });
console.log('proxy_url-1.1:', `"http://${hostname}"`, `(${isProxy})`);
hostname = getParseUrl(`http://${host}:${port}`).hostname;
isProxy = shouldProxy(`http://${hostname}/my/1234`, { no_proxy: envNoProxy });
console.log('proxy_url-1.2:', `"http://${hostname}"`, `(${isProxy})`);
hostname = getParseUrl('http://zf2-asm.srv2').hostname;
isProxy = shouldProxy(`http://${hostname}`, { no_proxy: envNoProxy });
console.log('proxy_url-1.3:', `"http://${hostname}"`,  `(${isProxy})`);
hostname = getParseUrl('https://jsonplaceholder.typicode.com/posts/1').hostname;
isProxy = shouldProxy(`http://${hostname}`, { no_proxy: envNoProxy });
console.log('proxy_url-2.1:', `"http://${hostname}"`, `(${isProxy})`);
hostname = getParseUrl('http://www.google.com').hostname;
isProxy = shouldProxy(`http://${hostname}`, { no_proxy: envNoProxy });
console.log('proxy_url-2.2:', `"http://${hostname}"`, `(${isProxy})`);

describe('<<=== HttpOperations: (http-operations.test) ===>>', () => {

  before(function (done) {
    startListenPort(app, done);
  });

  after(function (done) {
    stopListenPort(done);
  });

  it('#1: HttpOperations: getHttp("http://${host}:${port}")', async () => {
    const url = `http://${host}:${port}`;
    if (! await isUrlExists(url)) return;

    const response = await getHttp(url);

    if (isDebug && response.data) inspector(`getHttp(${url})`, response.data);
    assert.ok(response.statusCode === 200, `HttpOperations: getHttp(${url})`);
  });

  it('#2: HttpOperations: axios.get("http://${host}:${port}")', async () => {
    const url = `http://${host}:${port}`;
    if (! await isUrlExists(url)) return;

    const response = await axios.get(url);
    if (isDebug && response) console.log(`axios.get(${url}).statusText`, response.statusText);
    assert.ok(response.status === 200, 'HttpOperations: axios.get');
  });

  it('#3: HttpOperations: https.get("http://nodejs.org/dist/index.json")', async () => {
    let response, url = 'http://nodejs.org/dist/index.json';
    //------------------------------------------------------
    
    // External address
    if (! await isUrlExists(url)) return;

    response = await getHttps(url);
    if(isDebug && response.data) console.log('getHttps.data:', JSON.parse(response.data));
    assert.ok(response.statusCode === 200, `HttpOperations: getHttps("${url}")`);

    // Local address
    url = 'http://192.168.3.5/www_m5/m5_data/';
    if (! await isUrlExists(url)) return;

    response = await getHttp(url);
    if(isDebug && response.data) console.log('getHttp.data:', response.data);
    assert.ok(response.statusCode === 200, `HttpOperations: getHttp("${url}")`);
  });

  it('#4: HttpOperations: http.request("https://jsonplaceholder.typicode.com/posts/2")', async () => {
    let response, data, url = 'https://jsonplaceholder.typicode.com/posts/1';
    //------------------------------------------------------------------------
    
    // External address
    if (! await isUrlExists(url)) return;

    response = await reqHttps(url);
    data = JSON.parse(response.data);
    if(isDebug && data) console.log('getHttps.data:', data);
    assert.ok(response.statusCode === 200 &&  data.userId, `HttpOperations: http.request("${url}")`);

    // Local address
    url = 'http://192.168.3.5/www_m5/m5_data/';
    if (! await isUrlExists(url)) return;

    response = await reqHttp(url);
    if(isDebug && response.data) console.log('reqHttp.data:', response.data);
    assert.ok(response.statusCode === 200, `HttpOperations: reqHttp("${url}")`);
  });

  it('#4: HttpOperations: http.request("https://jsonplaceholder.typicode.com/posts/2")', async () => {
    let response, data, url = 'https://jsonplaceholder.typicode.com/posts/2';
    //------------------------------------------------------------------------
    
    // External address
    if (! await isUrlExists(url)) return;

    response = await reqHttps(url);
    data = JSON.parse(response.data);
    if(isDebug && data) console.log('getHttps.data:', data);
    assert.ok(response.statusCode === 200 &&  data.userId, `HttpOperations: http.request("${url}")`);

    // Local address
    url = 'http://192.168.3.5/www_m5/m5_data2/';
    if (! await isUrlExists(url)) return;

    response = await axios.get(url);

    if(isDebug && response.data) console.log('reqHttp.data:', response.data);
    assert.ok(response.status === 200, `HttpOperations: reqHttp("${url}")`);
  });
});


