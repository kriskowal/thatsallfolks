
var UTIL = require("narwhal/util");
var EXECUTE = require("./execute");
var CONTEXT = require("./context");

var Context = CONTEXT.Context;

/** */
var compilers = exports.compilers = {};

/** */
compilers['root'] = function (argument, node, nodes) {
    return function (context) {
        return EXECUTE.execute(nodes, context);
    };
};

/** */
compilers['if'] = function (argument, node, nodes) {
    return function (context) {
        var verity = EXECUTE.evaluate(argument, context);
        if (UTIL.isArrayLike(verity))
            verity = verity.length;
        if (verity)
            return EXECUTE.execute(nodes, context);
        return '';
    }
};

/** */
compilers['for'] = function (argument, node, nodes) {
    var match = /^\s*(\S+)\s+in\s+(\S+)\s*$/.exec(argument);
    if (match) {
        var iterand = match[1];
        var iterator = match[2];
        return function (context) {
            var values = EXECUTE.evaluate(iterator, context);
            return (values || []).map(function (value) {
                var innerContext = Context({}, context);
                innerContext.set(iterand.split("."), value);
                return EXECUTE.execute(nodes, innerContext);
            }).join("");
        };
    } else {
        return function (context) {
            var values = EXECUTE.evaluate(argument, context);
            return (values || []).map(function (value) {
                var innerContext = Context(value, context);
                return EXECUTE.execute(nodes, innerContext);
            }).join("");
        };
    }
};

/** */
compilers['with'] = function (argument, node, nodes) {
    return function (context) {
        var value = EXECUTE.evaluate(argument, context);
        var innerContext = Context(value, context);
        return EXECUTE.execute(nodes, innerContext);
    };
};

/** */
compilers['block'] = function (name, node, nodes) {
    return function (context) {
        var blocks = context.get(["blocks"].concat(name.split(".")));
        if (!blocks || !blocks.length)
            return '';
        var block = blocks.pop();

        context = Object.create(context);
        context.block = {};
        Object.defineProperty(context.block, 'super', {
            "get": function () {
                return compilers.block(name, node, nodes, context);
            }
        });

        return EXECUTE.execute(
            block.children.map(function (child) {
                return EXECUTE.compile(child);
            }),
            context
        );
    };
};

