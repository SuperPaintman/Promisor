# Promisor

[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![NPM version][npm-v-image]][npm-url]
[![NPM Downloads][npm-dm-image]][npm-url]
[![Test Coverage][coveralls-image]][coveralls-url]


Advanced functionality for Promise

## Installation
```sh
npm install promisor --save
```

--------------------------------------------------------------------------------

## API
### Promisor\#allSeries
This same as `Promise#all` but runs only a portions async promises at a time.

**Arguments**
* **values** {`Functin[] -> Promise`}      - array of functions that return *promise*
* [**limit**=*1*] {`Integer`}   - limit of one run
* [**delay**=*0*] {`delay`}     - delay before running the next series

**Returns**
* {`Promise`} returns results of all promises

**Example**

```js
const promises = [
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); }
]

Promisor.allSeries(promises, 1) // By 1
    .then(() => {
        /**
         * 100 -> 100 -> 100 -> 100 -> 100 -> 100 = 600ms
         */
        
        console.log("passed 600 milliseconds!");
    });

// Or by 3
const promises = [
    function () { return Promise.delay(100, 0); },
    function () { return Promise.delay(100, 1); },
    function () { return Promise.delay(100, 2); },
    function () { return Promise.delay(100, 3); },
    function () { return Promise.delay(100, 4); },
    function () { return Promise.delay(100, 5); }
]

Promisor.allSeries(promises, 3) // By 3
    .then((results) => {
        console.log(results); // [0, 1, 2, 3, 4, 5]

        /**
         * 100 and 100 and 100 -> 100 and 100 and 100 = 200ms
         */
        
        console.log("passed 200 milliseconds!");
    });
```

### Promisor\#allLimit

This same as `Promise#all` but runs a maximum of limit async operations at a time.

**Arguments**
* **values** {`Functin[] -> Promise`}      - array of functions that return *promise*
* [**limit**=*1*] {`Integer`}   - maximum of runs operations
* [**delay**=*0*] {`delay`}     - delay before running the next promise

**Returns**
* {`Promise`} returns results of all promises

**Example**

```js
const promises = [
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); },
    function () { return Promise.delay(100); }
]

Promisor.allLimit(promises, 1) // By 1
    .then(() => {
        /**
         * It works like #allSeries
         */
        
        console.log("passed 600 milliseconds!");
    });

// Or by 2
const promises = [
    function () { return Promise.delay(100, 0); },
    function () { return Promise.delay(300, 1); },
    function () { return Promise.delay(400, 2); },
    function () { return Promise.delay(200, 3); },
    function () { return Promise.delay(100, 4); }
]

Promisor.allLimit(promises, 2) // By 2
    .then((results) => {
        console.log(results); // [0, 1, 2, 3, 4]

        console.log("passed 600 milliseconds!");
    });
```

--------------------------------------------------------------------------------

## Changelog
### 0.3.0 [`Unstable`]
```diff
+ Added: dependence on Async
+ Added: allLimit method
```

### 0.2.0 [`Unstable`]
```diff
+ Added: dependence on BlueBird
- Removed: delay method
```

### 0.1.0 [`Unstable`]
```diff
+ First realise
```

--------------------------------------------------------------------------------

## License
Copyright (c)  2016 [Alexander Krivoshhekov](http://github.com/SuperPaintman)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-url]: https://www.npmjs.com/package/promisor
[npm-v-image]: https://img.shields.io/npm/v/promisor.svg
[npm-dm-image]: https://img.shields.io/npm/dm/Promisor.svg
[travis-image]: https://img.shields.io/travis/SuperPaintman/Promisor/master.svg?label=linux
[travis-url]: https://travis-ci.org/SuperPaintman/Promisor
[appveyor-image]: https://img.shields.io/appveyor/ci/SuperPaintman/Promisor/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/SuperPaintman/Promisor
[coveralls-image]: https://img.shields.io/coveralls/SuperPaintman/Promisor/master.svg
[coveralls-url]: https://coveralls.io/r/SuperPaintman/Promisor?branch=master
