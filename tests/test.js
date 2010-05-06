
exports.testContext = require("./context");
exports.testParse = require("./parse/test");
exports.testFilterJson = require("./filter-json/test");
exports.testBlockFor = require("./block-for/test");
exports.testBlockForIn = require("./block-for-in/test");
exports.testBlockIf = require("./block-if/test");
exports.testBlockWith = require("./block-with/test")
exports.testExtendsRelative = require("./extends-relative/test");
exports.testHolistic = require("./holisitic/test");

if (module === require.main)
    require("narwhal/os").exit(require("test").run(exports));

