
/*whatsupdoc*/

var PACKAGES = require("narwhal/packages");
var UTIL = require("narwhal/util");
var LOAD = require("./thatsallfolks/load");
var EXECUTE = require("./thatsallfolks/execute");

/** */
exports.load = LOAD.load;

if (require.main == module) {
    var template = LOAD.load("thatsallfolks/tests/a.html");
}

