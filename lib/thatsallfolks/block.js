
var UTIL = require("narwhal/util");
var EXECUTE = require("./execute");

/** */
var compilers = exports.compilers = {};

/** */
compilers.root = function (argument, node, nodes, context) {
    return EXECUTE.execute(nodes, context);
};

/** */
compilers['if'] = function (argument, node, nodes, context) {
    var varity = EXECUTE.evaluate(argument, context);
    if (UTIL.isArrayLike(varity))
        varity = varity.length;
    if (varity)
        return EXECUTE.execute(nodes, context);
    return '';
};

/** */
compilers['for'] = function (argument, node, nodes, context) {
    return EXECUTE.evaluate(argument, context).map(function (value) {
        var innerContext = Object.create(context);
        UTIL.update(innerContext, value);
        return EXECUTE.execute(nodes, innerContext);
    });
    return '<for>';
};

/** */
compilers['with'] = function (argument, node, nodes, context) {
    var innerContext = Object.create(context);
    UTIL.update(innerContext, EXECUTE.evaluate(argument, context));
    return EXECUTE.execute(nodes, innerContext);
};

/** */
compilers['block'] = function (name, node, nodes, context) {
    var blocks = context.blocks[name];
    if (!blocks || !blocks.length)
        return '[[' + name + ' ' +
            Object.keys(context.blocks).map(function (key) {
                return key + ":" + context.blocks[key].length;
            }).join(", ") +
        ']]';
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

