#!/usr/bin/env node
/*
 * random-useragent
 * https://github.com/skratchdot/random-useragent
 *
 * Copyright (c) 2014 skratchdot
 * Licensed under the MIT license.
 */
/*eslint prefer-template:0, no-console:0 */
'use strict';

// config
const file = __dirname + '/../useragent-data.json';

// requires
const fs = require('fs');
const UAParser = require('ua-parser-js');
const TransformStream = require('stream-transform');
const CSVParse = require('csv-parse');
const PromisePipe = require('promisepipe');
const Promise = require('bluebird');
const moment = require('moment');
const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));
Promise.promisifyAll(fs);

// instance
const useragents = {};
const uaParser = new UAParser();

// functions
function parseUserAgent(userAgentData) {
  if (typeof userAgentData.userAgent === 'string' && userAgentData.userAgent.length > 1) {
    let requestDate = moment(userAgentData.date, 'DD/MMM/YYYY:HH:mm:ss Z').toDate();
    var parsed;
    uaParser.setUA(userAgentData.userAgent);
    parsed = uaParser.getResult();
    if(!useragents[userAgentData.userAgent]){
      useragents[userAgentData.userAgent] = {
        folder: 'Apache Log',
        description: '',
        userAgent: userAgentData.userAgent,
        appCodename: '',
        appName: '',
        appVersion: '',
        platform: '',
        vendor: '',
        vendorSub: '',
        browserName: parsed.browser.name || '',
        browserMajor: parsed.browser.major || '',
        browserVersion: parsed.browser.version || '',
        deviceModel: parsed.device.model || '',
        deviceType: parsed.device.type || '',
        deviceVendor: parsed.device.vendor || '',
        engineName: parsed.engine.name || '',
        engineVersion: parsed.engine.version || '',
        osName: parsed.os.name || '',
        osVersion: parsed.os.version || '',
        cpuArchitecture: parsed.cpu.architecture || '',
        firstSeen: requestDate,
        lastSeen: requestDate,
        seen: 1
      };
    }else{
      useragents[userAgentData.userAgent].lastSeen = requestDate;
      useragents[userAgentData.userAgent].seen++;
    }
  }
};

// create file
let progress = 0;
PromisePipe(
  fs.createReadStream(argv._[0]),
  CSVParse({ delimiter: ' ', auto_parse: true, skip_lines_with_error: true, columns: ['host', 'i1','i2', 'date1', 'date2', 'request', 'status', 'size', 'referer', 'userAgent'] }),
  TransformStream((row, callback) => {
    row.date = row.date1 + row.date2;
    parseUserAgent(row);
    progress++;
    if(progress%50000 === 0){
      console.log('Parsed %d lines...', progress);
    }
    callback();
  }, { parallel:4 })
).then(() => {
  return fs.writeFileAsync(file, JSON.stringify(_.chain(useragents).values().filter(e => e.seen >= 50).value(), null, '\t'));
});
