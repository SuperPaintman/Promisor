'use strict';
/// <reference path="typings/tds.d.ts"/>
var assert = require('assert');
var _ = require('lodash');
var BBPromise = require('bluebird');
var Promisor = require('../promisor');
/**
 * Helps
 */
/**
 * Check delata time
 * @param  {number}  expected
 * @param  {number}  value
 * @param  {number}  [range=25]
 *
 * @return {boolean}
 */
function isAbout(expected, value, range) {
    if (range === void 0) { range = 25; }
    return (expected - range < value && value < expected + range);
}
function getTolalTimeOfAllLimit(arr, limit, delay) {
    if (delay === void 0) { delay = 0; }
    var time = 0;
    // Added delay for every promise
    if (delay) {
        arr = _.map(arr, function (item) { return item + delay; });
    }
    if (limit <= 0) {
        limit = arr.length;
    }
    var stack = [];
    for (var i = 0, len = limit; i < len; i++) {
        stack.push(arr.shift());
    }
    do {
        stack = _.sortBy(stack);
        var first = _.head(stack);
        time += first;
        stack = (function (stack, first) {
            return _(stack)
                .map(function (item) { return item - first; })
                .filter(function (item) { return item > 0; })
                .value();
        })(stack, first);
        var needAdd = 0;
        if (limit) {
            needAdd = limit - stack.length;
        }
        var itemArr = void 0;
        while (needAdd-- && (itemArr = arr.shift())) {
            stack.push(itemArr);
        }
    } while (stack.length > 0);
    return time;
}
describe('test helps', function () {
    describe('getTolalTimeOfAllLimit()', function () {
        it('should return time without delay', function () {
            var needTime;
            needTime = getTolalTimeOfAllLimit([
                100,
                300,
                400,
                200,
                100
            ], 2);
            assert.equal(needTime, 600);
            needTime = getTolalTimeOfAllLimit([
                100,
                300,
                200,
                500,
                700,
                200,
                300,
                400,
                900
            ], 3);
            assert.equal(needTime, 1700);
        });
        it('should return time with delay', function () {
            var needTime;
            needTime = getTolalTimeOfAllLimit([
                100,
                300,
                200,
                500,
                700,
                200,
                300,
                400,
                900
            ], 3, 100);
            assert.equal(needTime, 2100);
        });
    });
});
describe('#allSeries', function () {
    it('should return 9 value by 3 series after 900ms', function () {
        this.timeout(10000);
        this.slow(3000);
        // Массив под промисы
        var promises = [];
        for (var i = 0, len = 9; i < len; i++) {
            (function (promises, i) {
                promises.push(function () {
                    return BBPromise.delay(300, i);
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
    it('should return 9 value by 3 series after 1800ms', function () {
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
                    return BBPromise.delay(100 * (i + 1), i);
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
    it('should return 9 value by 3 series and delay by 100 after 2100ms', function () {
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
                    return BBPromise.delay(100 * (i + 1), i);
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
describe('#allLimit', function () {
    it('should return 9 value with limit by 3 after 900m', function () {
        this.timeout(10000);
        this.slow(5000);
        // Массив под промисы
        var promises = [];
        var promisesTime = [];
        for (var i = 0, len = 9; i < len; i++) {
            (function (promises, i) {
                promisesTime.push(300);
                promises.push(function () {
                    return BBPromise.delay(300, i);
                });
            })(promises, i);
        }
        var start = new Date().getTime();
        return Promisor.allLimit(promises, 3)
            .then(function (result) {
            var end = new Date().getTime();
            var delta = end - start;
            var shouldTime = getTolalTimeOfAllLimit(promisesTime, 3);
            assert.ok(isAbout(shouldTime, delta), "delta time exepted " + shouldTime + "ms, actual " + delta + "ms");
            assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
    });
    it('should return 9 value with limit by 3 after 1700m', function () {
        this.timeout(10000);
        this.slow(5000);
        // Массив под промисы
        var promises = [
            function () { return BBPromise.delay(100, 0); },
            function () { return BBPromise.delay(300, 1); },
            function () { return BBPromise.delay(200, 2); },
            function () { return BBPromise.delay(500, 3); },
            function () { return BBPromise.delay(700, 4); },
            function () { return BBPromise.delay(200, 5); },
            function () { return BBPromise.delay(300, 6); },
            function () { return BBPromise.delay(400, 7); },
            function () { return BBPromise.delay(900, 8); }
        ];
        var promisesTime = [
            100,
            300,
            200,
            500,
            700,
            200,
            300,
            400,
            900
        ];
        var start = new Date().getTime();
        return Promisor.allLimit(promises, 3)
            .then(function (result) {
            var end = new Date().getTime();
            var delta = end - start;
            var shouldTime = getTolalTimeOfAllLimit(promisesTime, 3);
            assert.ok(isAbout(shouldTime, delta), "delta time exepted " + shouldTime + "ms, actual " + delta + "ms");
            assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
    });
    it('should return 9 value with limit by 3 and delay by 100 after 2100m', function () {
        this.timeout(10000);
        this.slow(5000);
        // Массив под промисы
        var promises = [
            function () { return BBPromise.delay(100, 0); },
            function () { return BBPromise.delay(300, 1); },
            function () { return BBPromise.delay(200, 2); },
            function () { return BBPromise.delay(500, 3); },
            function () { return BBPromise.delay(700, 4); },
            function () { return BBPromise.delay(200, 5); },
            function () { return BBPromise.delay(300, 6); },
            function () { return BBPromise.delay(400, 7); },
            function () { return BBPromise.delay(900, 8); }
        ];
        var promisesTime = [
            100,
            300,
            200,
            500,
            700,
            200,
            300,
            400,
            900
        ];
        var start = new Date().getTime();
        return Promisor.allLimit(promises, 3, 100)
            .then(function (result) {
            var end = new Date().getTime();
            var delta = end - start;
            var shouldTime = getTolalTimeOfAllLimit(promisesTime, 3, 100);
            assert.ok(isAbout(shouldTime, delta), "delta time exepted " + shouldTime + "ms, actual " + delta + "ms");
            assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
    });
});
