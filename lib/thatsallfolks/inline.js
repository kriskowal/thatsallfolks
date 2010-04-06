
var UTIL = require("narwhal/util");
var LOAD = require("./load");

/** */
var compilers = exports.compilers = {};

exports.compilers.extends = function () {
};

/** */
exports.Safe = function (value) {
    return Object.create(exports.Safe.prototype, {
        "valueOf": function () {
            return value;
        }
    });
};

