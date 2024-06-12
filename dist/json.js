"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const clonedParse = JSON.parse;
JSON.parse = function (text, reviver) {
    if ((0, utils_1.generatePercentChanceToFlake)() > utils_1.PERCENT_CHANCE_OF_SUCCESS && !reviver) {
        (0, utils_1.log)('JSON.parse flaking');
        const supportedTypes = {
            string: true,
            number: true,
            boolean: true,
        };
        return clonedParse.apply(this, [text, (_key, value) => {
                const valueType = typeof value;
                if (!supportedTypes[valueType] || (0, utils_1.generatePercentChanceToFlake)() <= utils_1.PERCENT_CHANCE_OF_SUCCESS) {
                    return value;
                }
                if (valueType === 'string') {
                    return value.replace(/\ /g, '\u2009');
                }
                if (valueType === 'number') {
                    const toAdd = (Math.random() < 0.5) ? -1 : 1;
                    return value + toAdd;
                }
                if (valueType === 'boolean') {
                    return !value;
                }
            }]);
    }
    return clonedParse.apply(this, [text, reviver]);
};
// JSON.parse
// let a = JSON.stringify({a: 1, b: 2})
// console.log(JSON.parse(a))
// sample of havoc to be caused
// - JSON.parse(JSON.stringify({a: 1, b: true, c: 'a b c'})) -> can become {a: 2, b: false, c: 'a b c'}
//  - randomly mutates string, number and boolean property values
//  - note: when it mutates strings, it replaces normal spaces with \u2009 which looks like normal spaces but can cause havoc in a lot of cases
