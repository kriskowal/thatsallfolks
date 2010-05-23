
var ASSERT = require("assert");

exports.test = function () {
    var TAF = require("thatsallfolks/load");
    var FS = require("narwhal/fs");
    var here = FS.path(module.path);
    var html = here.resolve("input.html").canonical();
    var actual = TAF.load(html).format({
        "hi": "Hello, World!",
        "children": [1, 2, 3],
        "bye": "Bye!"
    });
    here.resolve("actual.html").write(actual, {"charset": "UTF-8"});
    var expected = here.resolve("output.html").read({"charset": "UTF-8"});
    ASSERT.equal(actual, expected);
};

if (module === require.main)
    require("narwhal/os").exit(require("test").run(exports));

