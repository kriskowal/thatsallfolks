
var UTIL = require("util");
var EXECUTE = require("./execute");

/** */
var compilers = exports.compilers = {};

/** */
compilers.root = function (argument, node, nodes, context) {
    return EXECUTE.execute(nodes, context);
};

/** */
compilers['if'] = function (argument, node, nodes, context) {
    if (EXECUTE.evaluate(argument, context))
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
compilers['block'] = function (argument, node, nodes, context) {
    var name = UTIL.trim(argument);
    var context = Object.create(context);
    context.block = {};
    var supers = node['supers'];
    if (supers) {
        var supr = supers[context.template];
        if (supr) {
            context.block['super'] = EXECUTE.execute(node['supers'][context.template].nodes, context);
        }
    }
    return EXECUTE.compile(context.blocks[name])(context);
};

