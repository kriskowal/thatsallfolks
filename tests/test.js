
exports.testContext = require("./context");

[
    "block-for-in",
    "block-if",
    "block-repetition",
    "block-super",
    "block-with-as",
    "block-with",
    "extends-relative",
    "filter-json",
    "holisitic",
    "parse"
].forEach(function (name) {
    exports["test " + name] = require("./" + name + "/test");
});

if (module === require.main)
    require("narwhal/os").exit(require("test").run(exports));

