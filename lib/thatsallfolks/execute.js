
var UTIL = require("narwhal/util");
var LOAD = require("./load");
var BLOCK = require("./block");
var FILTER = require("./filter");
var CONTEXT = require("./context");
var Context = CONTEXT.Context;

/**
 * @param node a node of a template syntax tree as produced by the
 * `./parse` module's `parse` method.
*/
exports.compile = function (node) {
    if (typeof node === "string")
        return node;
    if (node.type === "inline") {
        var expression = exports.compileExpression(node.content, node);
        return function (context) {
            context = Context.coerce(context);
            return expression(context);
        };
    } else if (node.type === "block") {
        var nodes = node.children.map(function (node) {
            if (typeof node === "string") {
                return node;
            } else {
                return exports.compile(node);
            }
        });
        return function (context) {
            context = Context.coerce(context);
            var match = /^\s*(\w*)(?:\s+([\s\S]*))?$/.exec(node.content);
            if (!BLOCK.compilers[match[1]])
                throw new Error(
                    "TemplateError: Urecognized block type " +
                    UTIL.enquote(match[1]) + " at " +
                    node.fileName + ":" + node.lineNo + ":" +
                    node.columnNo
                );
            return BLOCK.compilers[match[1]](
                match[2],
                node,
                nodes
            )(context);
        };
    }
};

exports.compileExpression = function (expression, node) {
    var terms = expression.split(/\s*\|\s*/g);
    var first = terms.shift().split(/\./g);
    return terms.reduce(function (basis, term) {
        term = term.trim();
        if (!UTIL.has(FILTER.filters, term))
            throw new Error("Unrecognized filter " + UTIL.enquote(term) + " in " + node.fileName + ":" + node.lineNo);
        var step = FILTER.filters[term];
        return function (context) {
            var value = basis(context);
            return step(value);
        };
    }, function (context) {
        var value = context.get(first);
        if (typeof value === "function")
            value = value();
        return value;
    });
};

/**
 * `execute` is used by block compilers to created functions that
 * will execute a pre-processed template program.
 * 
 * @param program is an Array of mixed functions and strings.
 * @param context is a Context object, or an object coercible to a
 * Context.
 * @returns an Array of Strings, for each respective String or the
 * return value of each function, given the context as an argument.
 */
exports.execute = function (program, context) {
    return program.map(function (child) {
        if (typeof child === "string") {
            return child;
        } else {
            return child(context);
        }
    }).join("");
};

