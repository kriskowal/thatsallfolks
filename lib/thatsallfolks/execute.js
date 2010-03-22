
var UTIL = require("util");
var LOAD = require("./load");
var INLINE = require("./inline");
var BLOCK = require("./block");
var FILTER = require("./filter");

/** */
exports.Template = function (node, name) {

    var bases = [];
    var blocks = {};
    var nodes = [];
    (node.children || []).forEach(function (node) {
        if (typeof node == "string")
            nodes.push(node);
        else if (
            node.type == "inline" &&
            /^extends\s+/.test(node.content)
        ) {
            var match = /^extends\s+(\S+)$/.exec(node.content);
            var name = JSON.decode(match[1]);
            bases.push(name);
        } else if (
            node.type == "block" &&
            /^block\s+/.test(node.content)
        ) {
            var match = /^block\s+(\S+)$/.exec(node.content);
            var blockName = match[1];
            blocks[blockName] = node;
            nodes.push(node);
        } else {
            nodes.push(node);
        }
    });
    if (!bases.length) {
        blocks.base = node;
    }

    var template = Object.create(exports.Template.prototype);
    UTIL.update(template, {
        "bases": bases,
        "blocks": blocks,
        "name": name
    });
    template.order = exports.deepBases(template);

    // create a lookup table on the node for the super-block
    // of the node
    var snapshot = {};
    template.order.forEach(function (base) {
        if (base == template.name)
            child = template;
        else
            child = LOAD.load(base);
        UTIL.forEachApply(child.blocks, function (name, block) {
            var supers = UTIL.getset(block, 'supers' , {});
            supers[template.name] = snapshot[name];
            snapshot[name] = block;
        });
    });
    template.blocks = snapshot;

    return template;
};

exports.Template.prototype.format = function (context) {
    context.template = this.name;
    context.blocks = this.blocks;
    return exports.compile(this.blocks.base)(context);
};

/**
 * linearizes the transitive bases of a template from the
 * base up.
 */
exports.deepBases = function (template, visited) {
    visited = visited || {};
    if (visited[template.name])
        return [];
    visited[template.name] = true;
    var bases = [template.name];
    template.bases.forEach(function (base) {
        var template = LOAD.load(base);
        bases.unshift.apply(bases, exports.deepBases(template, visited));
    });
    return bases;
};

/** */
exports.compile = function (node) {
    var nodes = (node.children || []).map(function (node) {
        if (typeof node === "string") {
            return node;
        } else {
            return exports.compile(node);
        }
    });
    return function (context) {
        if (node.type == "inline") {
            return exports.evaluate(node.content, context);
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
exports.evaluate = function (content, context) {
    return content.split(/\s*\|\s*/)
    .reduce(function (context, content) {
        var match = /^\s*(\w+)\s+(.*)$/.exec(content);
        if (match) {
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

