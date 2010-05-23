
/**
 * Provides a Context type, consisting of a chain of overlaid
 * name spaces from which getting and setting with dot delimited
 * keys pertains to the topmost layer with a matching path.
 * @module
 */

/*whatsupdoc*/
/*markup markdown*/

var UTIL = require("narwhal/util");

/**
 * Creates a context.  If the data are already a context,
 * creates an empty child context.  If the data are an
 * object, creates a context containing those data.
 * @param data
 * @param parent
 */
exports.Context = function (object, parent) {
    var context = Object.create(exports.Context.prototype);
    if (typeof object === "undefined") {
        context.data = {};
    } else if (object instanceof exports.Context) {
        context.data = {};
        context.parent = object;
        if (parent)
            throw new Error("Contexts cannot be composed from two contexts.");
    } else {
        context.data = object;
        if (parent)
            context.parent = exports.Context.coerce(parent);
    }
    return context;
};

/***
 * @classmethod
 */
exports.Context.coerce = function (object) {
    if (object instanceof exports.Context) {
        return object;
    } else {
        return exports.Context(object);
    }
}

/***
 * @param key
 * @param value optional
 */
exports.Context.prototype.get = function (key, value) {
    var context = this;
    if (key.length === 0 && key[0] === ".")
        return context.data;
    while (context) {
        if (context.hasOwn(key)) {
            return key.reduce(function (data, key) {
                if (key === ".")
                    return data;
                else
                    return data[key];
            }, context.data);
        }
        context = context.parent;
    }
    return value;
};

/***
 * @param key
 */
exports.Context.prototype.has = function (key) {
    var context = this;
    while (context) {
        if (context.hasOwn(key))
            return true;
        context = context.parent;
    }
    return false;
};

/***
 * @param key
 */
exports.Context.prototype.hasOwn = function (key) {
    var at = this.data;
    for (var i = 0, ii = key.length; i < ii; i++) {
        var part = key[i];
        if (part === ".")
            continue;
        if (!Object.prototype.hasOwnProperty.call(at, part))
            return false;
        at = at[part];
    }
    return true;
};

/***
 * @param key
 * @param value
 */
exports.Context.prototype.set = function (key, value) {
    var key = key.filter(function (part) {
        return part !== ".";
    });
    var leaf = key[key.length - 1];
    var at = this.data;
    for (var i = 0, ii = key.length -1; i < ii; i++) {
        var part = key[i];
        at = UTIL.getset(at, part, {});
    }
    at[leaf] = value;
};

/***
 */
exports.Context.prototype.update = function (items) {
    var self = this;
    UTIL.forEachApply(items, function (key, value) {
        self.set([key], value);
    });
};

