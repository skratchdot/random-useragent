/*
 * random-useragent
 * https://github.com/skratchdot/random-useragent
 *
 * Copyright (c) 2014 skratchdot
 * Licensed under the MIT license.
 */
/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/
'use strict';

var random_useragent = require('../lib/random-useragent.js');
var iterations = 100;

var getType = function (obj) {
	return ({}).toString.call(obj).match(/(\[object )(.*)(\])/)[2];
};

exports['random-useragent tests'] = {
	setUp: function (done) {
		// setup here
		done();
	},
	'don\'t change data': function (test) {
		var d1, d2, key = 'someNewKey';
		test.expect(2);
		d1 = random_useragent.getAllData();
		d1[0][key] = 'foo';
		d2 = random_useragent.getAllData();
		test.equal(d1[0].hasOwnProperty(key), true, 'new key should exist');
		test.equal(d2[0].hasOwnProperty(key), false, 'new key should not exist');
		test.done();
	},
	'return values': function (test) {
		test.expect(4);
		test.equal(getType(random_useragent.getRandom()), 'String', 'getRandom() should return a String');
		test.equal(getType(random_useragent.getRandomData()), 'Object', 'getRandomData() should return an Object');
		test.equal(getType(random_useragent.getAll()), 'Array', 'getAll() should return a Array');
		test.equal(getType(random_useragent.getAllData()), 'Array', 'getAllData() should return an Array');
		test.done();
	},
	'randomization works': function (test) {
		var i;
		test.expect(iterations * 2);
		for (i = 0; i < iterations; i++) {
			test.equal(getType(random_useragent.getRandom()), 'String', 'getRandom() should return a String');
			test.equal(getType(random_useragent.getRandomData()), 'Object', 'getRandomData() should return a Object');
		}
		test.done();
	},
	'valid filters work': function (test) {
		var filter = function (item) {
			return item.browserName === 'Chrome';
		};
		test.expect(6);
		test.equal(getType(random_useragent.getRandom(filter)), 'String', 'getRandom(valid_filter) should return a String');
		test.equal(getType(random_useragent.getRandomData(filter)), 'Object', 'getRandomObject(valid_filter) should return a Object');
		test.equal(getType(random_useragent.getAll(filter)), 'Array', 'getAll(valid_filter) should return an Array');
		test.equal(getType(random_useragent.getAllData(filter)), 'Array', 'getAllData(valid_filter) should return an Array');
		test.equal(random_useragent.getAll(filter).length > 0, true, 'getAll(valid_filter) should return an Array with length > 0');
		test.equal(random_useragent.getAllData(filter).length > 0, true, 'getAllData(valid_filter) should return an Array with length > 0');
		test.done();
	},
	'invalid filters work': function (test) {
		var filter = function (item) {
			return item.browserName === 'Some Fake Browser';
		};
		test.expect(6);
		test.equal(getType(random_useragent.getRandom(filter)), 'Null', 'getRandom(invalid_filter) should return null');
		test.equal(getType(random_useragent.getRandomData(filter)), 'Null', 'getRandomData(invalid_filter) should return null');
		test.equal(getType(random_useragent.getAll(filter)), 'Array', 'getAll(invalid_filter) should return an Array');
		test.equal(getType(random_useragent.getAllData(filter)), 'Array', 'getAllData(invalid_filter) should return an Array');
		test.equal(random_useragent.getAll(filter).length === 0, true, 'getAll(valid_filter) should return an Array with length === 0');
		test.equal(random_useragent.getAllData(filter).length === 0, true, 'getAllData(valid_filter) should return an Array with length === 0');
		test.done();
	}
};
