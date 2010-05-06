
var ASSERT = require("assert");

exports.test = function () {
    var FS = require("narwhal/fs");
    var TAF = require("thatsallfolks");
    var html = FS.path(module.path).resolve("input.html");
    var template = TAF.load(html);
    var json = FS.path(module.path).resolve("input.json").read({
        "charset": "UTF-8"
    });
    var expected = FS.path(module.path).resolve("output.html").read({
        "charset": "UTF-8"
    });
    var context = JSON.parse(json);
    var actual = template.format(context);
    ASSERT.equal(actual, expected);
};

if (require.main === module)
    require("narwhal/os").exit(require("test").run(exports));

