
/*whatsupdoc*/

var PACKAGES = require("packages");
var UTIL = require("util");
var LOAD = require("./thatsallfolks/load");
var EXECUTE = require("./thatsallfolks/execute");

/** */
exports.load = LOAD.load;

if (require.main == module) {
    var template = LOAD.load("thatsallfolks/test.html");
    print(JSON.encode(template, null, 4));
    print(template.format({"hi": 10}));
    //var result = format({"hi": 10, 'children': [{'bye': 20}]});
    //print("> " + result);
}

