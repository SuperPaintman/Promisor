'use strict';
/// <reference path="typings/tds.d.ts"/>

import _ = require("lodash");
import Promise = require("bluebird");
import async = require("async");

/**
 * allSeries
 * @param  {Function[]}       values
 * @param  {number}           [limit=1]
 * 
 * @return {Promise}
 */
function _allSeries(values: Function[], limit = 1, delay = 0): Promise<any> {
    // Делим функции на чанки
    const chunks: Function[][] = _.chunk<Function>(values, limit);

    return new Promise((resolve, reject) => {
        async.mapSeries(chunks, (chunk: Function[], callback: Function) => {
            // Сбор промисов
            const promises: Promise<any>[] = [];

            _.forEach(chunk, (fn: Function) => {
                promises.push(fn());
            });

            // Запуск всех
            Promise.all(promises)
                .delay(delay)
                .then((results) => {
                    callback(null, results);
                }, (err) => {
                    callback(err);
                });
        }, (err, results) => {
            if (err) { return reject(err); }

            let all = [];
            all = _(results)
                .flatten()
                .flatten()
                .value();

            resolve(all);
        });
    });
}

class Promisor {
    constructor() { }

    public static allSeries = _allSeries;
    public allSeries = _allSeries;
}

export = Promisor;
