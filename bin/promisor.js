'use strict';
/// <reference path="typings/tds.d.ts"/>
var _ = require("lodash");
var Promise = require("bluebird");
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
    var all = [];
    // Делим функции на чанки
    var chunks = _.chunk(values, limit);
    // Заводим промис
    var p;
    p = Promise.resolve();
    // Обход всех чанков
    _.forEach(chunks, function (chunk) {
        p = p
            .then(function () {
            var promises = [];
            _.forEach(chunk, function (fn) {
                promises.push(fn());
            });
            return Promise.all(promises);
        })
            .then(function (results) {
            return delay > 0 ?
                Promise.delay(delay, results) : Promise.resolve(results);
        })
            .then(function (results) {
            all.push(results);
            return Promise.resolve();
        });
    });
    p = p.then(function () {
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
var Promisor = (function () {
    function Promisor() {
        this.allSeries = _allSeries;
    }
    Promisor.allSeries = _allSeries;
    return Promisor;
})();
module.exports = Promisor;
