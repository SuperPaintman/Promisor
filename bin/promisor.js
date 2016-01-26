'use strict';
/// <reference path="typings/tds.d.ts"/>
var _ = require("lodash");
var Promise = require("bluebird");
var async = require("async");
/**
 * allSeries
 * @param  {Function[]}       values
 * @param  {number}           [limit=1]
 *
 * @return {Promise}
 */
function _allSeries(values, limit, delay) {
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
            Promise.all(promises)
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
            var all = [];
            all = _(results)
                .flatten()
                .flatten()
                .value();
            resolve(all);
        });
    });
}
var Promisor = (function () {
    function Promisor() {
        this.allSeries = _allSeries;
    }
    Promisor.allSeries = _allSeries;
    return Promisor;
})();
module.exports = Promisor;
