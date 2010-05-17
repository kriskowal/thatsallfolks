
var PACKAGES = require("narwhal/packages");
var FS = require("narwhal/fs");
var UTIL = require("narwhal/util");
var PARSE = require("./parse");
var EXECUTE = require("./execute");
var resolve = require.loader.resolve;

var templates = {};
var documents = {};

/** */
exports.load = function (name, force) {
    if (!UTIL.has(templates, name) || force)
        exports.reload(name);
    return templates[name];
};

/** */
exports.reload = function (name) {
    templates[name] = exports.Template.load(name);
};

/** */
exports.loadDocument = function (name, force) {
    if (!UTIL.has(documents, name) || force)
        exports.reloadDocument(name);
    return documents[name];
};

/** */
exports.reloadDocument = function (name) {
    // XXX fix join
    var fileName = FS.join("thatsallfolks", name); 
    var text = PACKAGES.resource(fileName).read({"charset": "UTF-8"});
    var tree = PARSE.parse(text, fileName);
    var document = exports.Document(tree, name);
    documents[name] = document;
};

/** */
exports.Document = function (node, name) {
    var document = Object.create(exports.Document.prototype);
    document.name = name;
    var bases = document.bases = [];
    var blocks = document.blocks = {};
    exports.walk(node, function (node) {
        if (
            node.type == "inline" &&
            /^extends\s+/.test(node.content)
        ) {
            var match = /^extends\s+(\S+)$/.exec(node.content);
            var name = JSON.parse(match[1]);
            node.extends = name;
            bases.push(name);
        } else if (
            node.type == "block" &&
            /^block\s+/.test(node.content)
        ) {
            var match = /^block\s+(\S+)$/.exec(node.content);
            var blockName = match[1];
            node.block = blockName;
            blocks[blockName] = node;
        }
    });
    blocks.root = node;
    return document;
};

/** */
exports.Template = function (text, fileName, lineNo) {
    if (!fileName) fileName = "<string>";
    if (!lineNo) lineNo = 1;
    throw new Error("Not yet implemented");
};

/*** */
exports.Template.load = function (name, baseName) {
    if (baseName)
        name = resolve(name, baseName);
    var document = exports.loadDocument(name);
    var template = Object.create(exports.Template.prototype);
    UTIL.update(template, {
        "name": document.name,
        "documents": exports.deepBases(document).map(function (childName) {
            childName = resolve(childName, document.name);
            return exports.loadDocument(childName);
        })
    });
    return template;
};

/*** */
exports.Template.prototype.format = function (context) {

    // construct chains of blocks for inheritance
    var blocks = {};
    this.documents.forEach(function (document) {
        UTIL.forEachApply(document.blocks, function (name, node) {
            UTIL.getset(blocks, name, []).push(node);
        });
    });

    context.blocks = blocks;
    var root = blocks.root.shift();
    return EXECUTE.compile(root)(context);

};

/**
 * linearizes the transitive bases of a document from the
 * base up.
 */
exports.deepBases = function (document, visited) {
    visited = visited || {};
    if (visited[document.name])
        return [];
    visited[document.name] = true;
    var bases = [document.name];
    document.bases.forEach(function (base) {
        base = resolve(base, document.name);
        var subDocument = exports.loadDocument(base);
        bases.unshift.apply(bases, exports.deepBases(subDocument, visited));
    });
    return bases;
};

/** */
exports.walk = function (node, callback) {
    callback(node);
    (node.children || []).forEach(function (node) {
        exports.walk(node, callback);
    });
};

