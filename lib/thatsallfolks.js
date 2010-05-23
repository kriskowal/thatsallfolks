
/*whatsupdoc*/

var PACKAGES = require("narwhal/packages");
var UTIL = require("narwhal/util");
var LOAD = require("./thatsallfolks/load");
var EXECUTE = require("./thatsallfolks/execute");
var CONTEXT = require("./thatsallfolks/context");

/** */
exports.load = LOAD.load;

/** */
exports.Context = CONTEXT.Context;

if (require.main == module) {
    var template = LOAD.load("thatsallfolks/tests/a.html");
}

