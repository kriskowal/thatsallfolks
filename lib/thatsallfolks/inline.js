
var UTIL = require("util");
var LOAD = require("./load");

/** */
var compilers = exports.compilers = {};

/** */
exports.Safe = function (value) {
    return Object.create(exports.Safe.prototype, {
        "valueOf": function () {
            return value;
        }
    });
};

