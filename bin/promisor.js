'use strict';
/// <reference path="typings/tds.d.ts"/>
var _ = require('lodash');
var BBPromise = require('bluebird');
var async = require('async');
/**
 * allSeries
 * @param  {Function[]}       values
 * @param  {number}           [limit=1]
 * @param  {delay}            [limit=0]
 *
 * @return {Promise}
 */
function allSeries(values, limit, delay) {
    if (limit === void 0) { limit = 1; }
    if (delay === void 0) { delay = 0; }
    // Делим функции на чанки
    var chunks = _.chunk(values, limit);
    return new Promise(function (resolve, reject) {
        async.mapSeries(chunks, function (chunk, callback) {
            // Сбор промисов
            var promises = [];
            _.forEach(chunk, function (fn) {
                promises.push(fn());
            });
            // Запуск всех
            BBPromise.all(promises)
                .delay(delay)
                .then(function (results) {
                callback(null, results);
            }, function (err) {
                callback(err);
            });
        }, function (err, results) {
            if (err) {
                return reject(err);
            }
            var all = _(results)
                .flatten()
                .value();
            resolve(all);
        });
    });
}
exports.allSeries = allSeries;
/**
 * allLimit
 * @param  {Function[]}       values
 * @param  {number}           [limit=1]
 * @param  {delay}            [limit=0]
 *
 * @return {Promise}
 */
function allLimit(values, limit, delay) {
    if (limit === void 0) { limit = 1; }
    if (delay === void 0) { delay = 0; }
    return new Promise(function (resolve, reject) {
        async.mapLimit(values, limit, function (fn, callback) {
            // Сбор промисов
            BBPromise.resolve(fn())
                .delay(delay)
                .then(function (results) {
                callback(null, results);
            }, function (err) {
                callback(err);
            });
        }, function (err, results) {
            if (err) {
                return reject(err);
            }
            // const all = _(results)
            //     .value();
            resolve(results);
        });
    });
}
exports.allLimit = allLimit;
