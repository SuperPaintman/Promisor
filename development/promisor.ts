'use strict';
/// <reference path="typings/tds.d.ts"/>

import _ = require("lodash");

let Promise;

if (global.Promise) {
    // Native
    Promise = global.Promise;
} else {
    // Bluebird
    Promise = require("bluebird");
}

/**
 * Delay
 * @param  {number}        ms
 * 
 * @return {Promise}
 */
function _delay<T>(ms: number, value?: T): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
        setTimeout(() => {
            resolve(value);
        }, ms);
    });
}

/**
 * allSeries
 * @param  {Function[]}       values
 * @param  {number}           [limit=1]
 * 
 * @return {Promise}
 */
function _allSeries(values: Function[], limit = 1, delay = 0): Promise<any> {
    let all = [];

    // Делим функции на чанки
    const chunks: Function[][] = _.chunk<Function>(values, limit);

    // Заводим промис
    let p: Promise<any>;
    p = Promise.resolve();

    // Обход всех чанков
    _.forEach(chunks, (chunk: Function[]) => {
        p = p
            .then(() => {
                const promises: Promise<any>[] = [];

                _.forEach(chunk, (fn: Function) => {
                    promises.push(fn());
                });

                return Promise.all(promises);
            })
            // Задержка между сериями
            .then((results: any[]) => {
                return delay > 0 ?
                    _delay(delay, results) : Promise.resolve(results);
            })
            .then((results: any[]) => {
                all.push(results);

                return Promise.resolve();
            });
    });

    p = p.then(() => {

        /**
         * На момент окончания, резуьтат будет иметь вид:
         * [][]
         */
        all = _(all)
            .flatten()
            .flatten()
            .value();

        return Promise.resolve(all);
    });

    return p;
}

class Promisor {
    constructor() { }

    public static delay = _delay;
    public delay = _delay;

    public static allSeries = _allSeries;
    public allSeries = _allSeries;
}

export = Promisor;
