
var PACKAGES = require("packages");
var UTIL = require("util");
var PARSE = require("./parse");
var EXECUTE = require("./execute");

var memo = {};
exports.load = function (name, force) {
    if (!UTIL.has(memo, name) || force)
        exports.reload(name);
    return memo[name];
};

exports.reload = function (name) {
    var fileName = "templates/" + name; 
    var text = PACKAGES.resource(fileName).read({"charset": "UTF-8"});
    var tree = PARSE.parse(text, fileName);
    var blocks = {};
    var bases = [];
    var template = EXECUTE.Template(tree, name);
    memo[name] = template;
};

