
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
    var verityExpression = EXECUTE.compileExpression(argument, node);
    return function (context) {
        var verity = verityExpression(context);
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
        var expression = EXECUTE.compileExpression(iterator, node);
        return function (context) {
            var values = expression(context);
            return (values || []).map(function (value) {
                var innerContext = Context({}, context);
                innerContext.set(iterand.split("."), value);
                return EXECUTE.execute(nodes, innerContext);
            }).join("");
        };
    } else {
        throw new Error("For loops require an 'in' clause in " + node.fileName + ":" + node.lineNo);
    }
};

/** */
compilers['with'] = function (argument, node, nodes) {
    var match = /^\s*(\S+)\s+as\s+(\S+)\s*$/.exec(argument);
    if (match) {
        var rvalue = match[1];
        var lvalue = match[2];
        var expression = EXECUTe.compileExpression(rvalue,node);
        return function (context) {
            var innerContext = Context(UTIL.object([
                [lvalue, expression(context)]
            ]), context);
            return EXECUTE.execute(nodes, innerContext);
        };
    } else {
        throw new Error("with blocks require an 'as' clause in " + node.fileName + ":" + node.lineNo);
    }
};

/** */
compilers['block'] = function (name, node, nodes) {
    return function (context) {
        var blocks = context.get(["blocks"].concat(name.split(".")));
        if (!blocks || !blocks.length)
            return '';
        var block = blocks.pop();

        context = Object.create(context);
        var supr = compilers.block(name, node, nodes, context)
        context.set(["block", "super"], function () {
            return supr(context);
        });

        return EXECUTE.execute(
            block.children.map(function (child) {
                return EXECUTE.compile(child);
            }),
            context
        );
    };
};

