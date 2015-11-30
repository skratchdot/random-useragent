'use strict';

var expect = require('chai').expect;
var lib = require('./index.js');
var iterations = 100;

describe('random-useragent', function () {
	it('don\'t change data', function () {
		var d1;
		var d2;
		var key = 'someNewKey';
		d1 = lib.getAllData();
		d1[0][key] = 'foo';
		d2 = lib.getAllData();
		expect(d1[0].hasOwnProperty(key)).to.equal(true);
		expect(d2[0].hasOwnProperty(key)).to.equal(false);
	});
	it('return values', function () {
		expect(lib.getRandom()).to.be.a.string;
		expect(lib.getRandomData()).to.be.an.object;
		expect(lib.getAll()).to.be.an.array;
		expect(lib.getAllData()).to.be.an.array;
	});
	it('randomization works', function (done) {
		var i;
		for (i = 0; i < iterations; i++) {
			expect(lib.getRandom()).to.be.a.string;
			expect(lib.getRandomData()).to.be.an.object;
		}
		done();
	});
	it('valid filters work', function () {
		var filter = function (item) {
			return item.browserName === 'Chrome';
		};
		expect(lib.getRandom(filter)).to.be.a.string;
		expect(lib.getRandomData(filter)).to.be.an.object;
		expect(lib.getAll(filter)).to.be.an.array;
		expect(lib.getAllData(filter)).to.be.an.array;
		expect(lib.getAll(filter)).to.have.length.gt(0);
		expect(lib.getAllData(filter)).to.have.length.gt(0);
	});
	it('invalid filters work', function () {
		var filter = function (item) {
			return item.browserName === 'Some Fake Browser';
		};
		expect(lib.getRandom(filter)).to.be.null;
		expect(lib.getRandomData(filter)).to.be.null;
		expect(lib.getAll(filter)).to.be.an.array;
		expect(lib.getAllData(filter)).to.be.an.array;
		expect(lib.getAll(filter)).to.have.length(0);
		expect(lib.getAllData(filter)).to.have.length(0);
	});
});
