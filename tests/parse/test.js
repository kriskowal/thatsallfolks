
var ASSERT = require("assert");

exports.test = function () {
    var FS = require("narwhal/fs");
    var PARSE = require("thatsallfolks/parse");
    var path = FS.path(module.path).resolve("input.html");
    var content = path.read({"charset": "UTF-8"});
    var tree = PARSE.parse(content);
    var actual = JSON.stringify(tree, null, 4);
    var expected = FS.path(module.path).resolve("output.json").read({"charset": "UTF-8"});
    ASSERT.equal(actual, expected);    
};

if (require.main === module)
    require("narwhal/os").exit(require("test").run(exports));

