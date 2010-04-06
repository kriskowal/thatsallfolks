
/*whatsupdoc*/

var PACKAGES = require("narwhal/packages");
var UTIL = require("narwhal/util");
var LOAD = require("./thatsallfolks/load");
var EXECUTE = require("./thatsallfolks/execute");

/** */
exports.load = LOAD.load;

if (require.main == module) {
    var template = LOAD.load("thatsallfolks/tests/a.html");
    print(template.format({}));
    //var template = LOAD.load("thatsallfolks/test.html");
    //print(template.format({"hi": "Hello", "title": "Hi!"}));
    //var result = format({"hi": 10, 'children': [{'bye': 20}]});
    //print("> " + result);
}

