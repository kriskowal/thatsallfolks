
var ASSERT = require("assert");

exports.test = function () {
    var TAF = require("thatsallfolks/load");
    var FS = require("narwhal/fs");
    var here = FS.path(module.path);
    var html = here.resolve("child.html").canonical();
    var actual = TAF.load(html).format({
        "body": "Body"
    });
    var expected = here.resolve("output.html").read({"charset": "UTF-8"});
    ASSERT.equal(actual, expected);
};

if (module === require.main)
    require("narwhal/os").exit(require("test").run(exports));

