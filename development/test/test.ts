'use strict';
/// <reference path="typings/tds.d.ts"/>

import assert = require('assert');
import _ = require("lodash");

import Promisor = require("../Promisor");

// const Promise = global.Promise;

function isAbout(expected: number, value: number, range = 10): boolean {
    return (expected - range < value && value < expected + range);
}

describe("Promisor", () => {
    describe("#delay", () => {
        it("should return after 500ms without value", function () {
            this.timeout(2000);
            this.slow(1500);

            const start = new Date().getTime();

            return Promisor.delay(500)
                .then(() => {
                    const end = new Date().getTime();
                    const delta = end - start;

                    assert.ok(isAbout(500, delta)
                        , `delta time exepted 500ms, actual ${delta}ms`);
                });
        });

        it("should return after 500ms with value", function () {
            this.timeout(2000);
            this.slow(1500);

            const start = new Date().getTime();

            return Promisor.delay(500, 42)
                .then((result) => {
                    const end = new Date().getTime();
                    const delta = end - start;

                    assert.ok(isAbout(500, delta)
                        , `delta time exepted 500ms, actual ${delta}ms`);
                    assert.equal(result, 42);
                });
        });
    });

    describe("#allSeries", () => {
        it("should return 9 value by 3 series after 900ms", function() {
            this.timeout(10000);
            this.slow(3000);

            // Массив под промисы
            const promises = [];

            for (let i = 0, len = 9; i < len; i++) {
                (function(promises, i) {
                    promises.push(function() {
                        return Promisor.delay(300).then(() => {
                            return i;
                        });
                    });
                })(promises, i);
            }

            const start = new Date().getTime();

            return Promisor.allSeries(promises, 3)
                .then((result) => {
                    const end = new Date().getTime();
                    const delta = end - start;

                    assert.ok(isAbout(900, delta)
                        , `delta time exepted 900ms, actual ${delta}ms`);
                    assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
                });
        });

        it("should return 9 value by 3 series after 1800ms", function() {
            this.timeout(10000);
            this.slow(4000);

            // Массив под промисы
            const promises = [];

            for (let i = 0, len = 9; i < len; i++) {
                (function(promises, i) {
                    promises.push(function() {
                        /**
                         * 100 | 200 | 300 | max> 300  |
                         * 400 | 500 | 600 | max> 600  | sum> 1800
                         * 700 | 800 | 900 | max> 900  |
                         */

                        return Promisor.delay(100 * (i + 1)).then(() => {
                            return i;
                        });
                    });
                })(promises, i);
            }

            const start = new Date().getTime();

            return Promisor.allSeries(promises, 3)
                .then((result) => {
                    const end = new Date().getTime();
                    const delta = end - start;

                    assert.ok(isAbout(1800, delta)
                        , `delta time exepted 1800ms, actual ${delta}ms`);
                    assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
                });
        });

        it("should return 9 value by 3 series and delay by 100 after 2100ms", function() {
            this.timeout(10000);
            this.slow(5000);

            // Массив под промисы
            const promises = [];

            for (let i = 0, len = 9; i < len; i++) {
                (function(promises, i) {
                    promises.push(function() {
                        /**
                         * 100 | 200 | 300 | max> 300  |
                         * 400 | 500 | 600 | max> 600  | sum> 1800 + 100 * 3
                         * 700 | 800 | 900 | max> 900  |
                         */

                        return Promisor.delay(100 * (i + 1)).then(() => {
                            return i;
                        });
                    });
                })(promises, i);
            }

            const start = new Date().getTime();

            return Promisor.allSeries(promises, 3, 100)
                .then((result) => {
                    const end = new Date().getTime();
                    const delta = end - start;

                    assert.ok(isAbout(2100, delta)
                        , `delta time exepted 2100ms, actual ${delta}ms`);
                    assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
                });
        });
    });
});
