
var ASSERT = require("assert");

exports.test = function () {
    var TAF = require("thatsallfolks");
    var FS = require("narwhal/fs");
    var html = FS.path(module.path).resolve("input.html").canonical();
    var template = TAF.load(html);
    var actual = template.format({"data": {"a": 10}});
    var expected = "<pre>{\n    \"a\": 10\n}</pre>\n";
    ASSERT.deepEqual(actual, expected);
};

if (require.main === module)
    require("narwhal/os").exit(require("test").run(exports));

