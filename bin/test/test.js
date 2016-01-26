'use strict';
/// <reference path="typings/tds.d.ts"/>
var assert = require('assert');
var Promise = require("bluebird");
var Promisor = require("../promisor");
// const Promise = global.Promise;
/**
 * Helps
 */
/**
 * Check delata time
 * @param  {number}  expected
 * @param  {number}  value
 * @param  {number}  [range=10]
 *
 * @return {boolean}
 */
function isAbout(expected, value, range) {
    if (range === void 0) { range = 10; }
    return (expected - range < value && value < expected + range);
}
describe("#allSeries", function () {
    it("should return 9 value by 3 series after 900ms", function () {
        this.timeout(10000);
        this.slow(3000);
        // Массив под промисы
        var promises = [];
        for (var i = 0, len = 9; i < len; i++) {
            (function (promises, i) {
                promises.push(function () {
                    return Promise.delay(300, i);
                });
            })(promises, i);
        }
        var start = new Date().getTime();
        return Promisor.allSeries(promises, 3)
            .then(function (result) {
            var end = new Date().getTime();
            var delta = end - start;
            assert.ok(isAbout(900, delta), "delta time exepted 900ms, actual " + delta + "ms");
            assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
    });
    it("should return 9 value by 3 series after 1800ms", function () {
        this.timeout(10000);
        this.slow(4000);
        // Массив под промисы
        var promises = [];
        for (var i = 0, len = 9; i < len; i++) {
            (function (promises, i) {
                promises.push(function () {
                    /**
                     * 100 | 200 | 300 | max> 300  |
                     * 400 | 500 | 600 | max> 600  | sum> 1800
                     * 700 | 800 | 900 | max> 900  |
                     */
                    return Promise.delay(100 * (i + 1), i);
                });
            })(promises, i);
        }
        var start = new Date().getTime();
        return Promisor.allSeries(promises, 3)
            .then(function (result) {
            var end = new Date().getTime();
            var delta = end - start;
            assert.ok(isAbout(1800, delta), "delta time exepted 1800ms, actual " + delta + "ms");
            assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
    });
    it("should return 9 value by 3 series and delay by 100 after 2100ms", function () {
        this.timeout(10000);
        this.slow(5000);
        // Массив под промисы
        var promises = [];
        for (var i = 0, len = 9; i < len; i++) {
            (function (promises, i) {
                promises.push(function () {
                    /**
                     * 100 | 200 | 300 | max> 300  |
                     * 400 | 500 | 600 | max> 600  | sum> 1800 + 100 * 3
                     * 700 | 800 | 900 | max> 900  |
                     */
                    return Promise.delay(100 * (i + 1), i);
                });
            })(promises, i);
        }
        var start = new Date().getTime();
        return Promisor.allSeries(promises, 3, 100)
            .then(function (result) {
            var end = new Date().getTime();
            var delta = end - start;
            assert.ok(isAbout(2100, delta), "delta time exepted 2100ms, actual " + delta + "ms");
            assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
    });
});
