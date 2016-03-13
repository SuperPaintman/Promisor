'use strict';
/// <reference path="typings/tds.d.ts"/>

import * as _ from 'lodash';
import * as BBPromise from 'bluebird';
import * as async from 'async';

/**
 * allSeries
 * @param  {Function[]}       values
 * @param  {number}           [limit=1]
 * @param  {delay}            [limit=0]
 * 
 * @return {Promise}
 */
export function allSeries(values: Function[], limit = 1, delay = 0): Promise<any> {
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
            BBPromise.all(promises)
                .delay(delay)
                .then((results) => {
                    callback(null, results);
                }, (err) => {
                    callback(err);
                });
        }, (err, results) => {
            if (err) { return reject(err); }

            const all = _(results)
                .flatten()
                .value();

            resolve(all);
        });
    });
}

/**
 * allLimit
 * @param  {Function[]}       values
 * @param  {number}           [limit=1]
 * @param  {delay}            [limit=0]
 * 
 * @return {Promise}
 */
export function allLimit(values: Function[], limit = 1, delay = 0): Promise<any> {
    return new Promise((resolve, reject) => {
        async.mapLimit(values, limit, (fn: Function, callback: Function) => {
            // Сбор промисов
            BBPromise.resolve(fn())
            .delay(delay)
            .then((results) => {
                callback(null, results);
            }, (err) => {
                callback(err);
            });
        }, (err, results) => {
            if (err) { return reject(err); }

            // const all = _(results)
            //     .value();

            resolve(results);
        });
    });
}
