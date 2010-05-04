
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
 * @param data
 * @param parent
 */
exports.Context = function (object, parent) {
    var context = Object.create(exports.Context.prototype);
    if (object instanceof exports.Context) {
        context.data = {};
        context.parent = object;
    } else {
        context.data = object;
        context.parent = parent;
    }
    return context;
};

/**
 * @member Context
 */
exports.Context.coerce = function (object) {
    if (object instanceof exports.Context) {
        return object;
    } else {
        return exports.Context(object);
    }
}

/**
 * @param key
 * @param value optional
 */
exports.Context.prototype.get = function (key, value) {
    var context = this;
    while (context) {
        if (context.hasOwn(key)) {
            return key.reduce(function (data, key) {
                return data[key];
            }, context.data);
        }
        context = context.parent;
    }
    return value;
};

/**
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

/**
 * @param key
 */
exports.Context.prototype.hasOwn = function (key) {
    var at = this.data;
    for (var i = 0, ii = key.length; i < ii; i++) {
        var part = key[i];
        if (!Object.prototype.hasOwnProperty.call(at, part))
            return false;
        at = at[part];
    }
    return true;
};

/**
 * @param key
 * @param value
 */
exports.Context.prototype.set = function (key, value) {
    var leaf = key[key.length - 1];
    var at = this.data;
    for (var i = 0, ii = key.length -1; i < ii; i++) {
        var part = key[i];
        at = UTIL.getset(at, part, {});
    }
    at[leaf] = value;
};

