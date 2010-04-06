
var UTIL = require("narwhal/util");
var LOAD = require("./load");
var INLINE = require("./inline");
var BLOCK = require("./block");
var FILTER = require("./filter");

/** */
exports.compile = function (node) {
    if (typeof node === "string")
        return node;
    var nodes = (node.children || []).map(function (node) {
        if (typeof node === "string") {
            return node;
        } else {
            return exports.compile(node);
        }
    });
    return function (context) {
        if (node.type == "inline") {
            return exports.evaluate(node.content, context, node);
        } else if (node.type == "block") {
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
                nodes,
                context
            );
        }
    };
};

/** */
exports.evaluateTerm = function () {
};

/** */
exports.evaluate = function (content, context, node) {
    var terms = content.split(/\s*\|\s*/);
    return terms.reduce(function (context, content) {
        var match = /^\s*(\w+)\s+(.*)$/.exec(content);
        if (match) {
            if (!INLINE.compilers[match[1]])
                throw new Error(
                    "TemplateError: Unrecognized inline type " + 
                    UTIL.enquote(match[1]) + " at " + 
                    node.fileName + ":" + node.lineNo + ":" +
                    node.columnNo
                );
            return INLINE.compilers[match[1]](match[2], context);
        } else {
            return content.split(/\s*\.\s*/)
            .reduce(function (context, content) {
                if (typeof context === "array" && /^\d+$/.test(content))
                    content = content >>> 0;
                return context[content];
            }, context);
        }
    }, context);
};

/** */
exports.execute = function (nodes, context) {
    return nodes.map(function (child) {
        if (typeof child === "string") {
            return child;
        } else {
            return child(context);
        }
    }).join("");
};

