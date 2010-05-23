
var ASSERT = require("assert");
var Context = require("thatsallfolks/context").Context;

exports.test = function (ASSERT) {
    var parent = Context({});
    var context = Context(parent);
    parent.set(["a", "b"], 10);
    context.set(["a"], 20);
    ASSERT.equal(context.get(["a", "b"]), 10);
    ASSERT.equal(context.get(["a"]), 20);
};

exports.testObjectObject = function () {
    var context = Context({
        "a": 10
    }, {
        "b": 20
    });
    ASSERT.equal(context.get(["a"]), 10);
    ASSERT.equal(context.get(["b"]), 20);
};

exports.testContextContext = function () {
    ASSERT['throws'](function () {
        Context(Context(), Context());
    });
};

exports.testSelf = function () {
    var context = Context(10);
    ASSERT.equal(context.get(["."]), 10);
};

exports.testChildSelfGet = function () {
    var context = Context({});
    context.set(["a"], 10);
    ASSERT.equal(context.get(["a", "."]), 10);
    ASSERT.equal(context.get([".", "a"]), 10);
};

exports.testChildSelfHas = function () {
    var context = Context({});
    ASSERT.equal(context.has(["."]), true);
};

exports.testChildSelfHasOwn = function () {
    var context = Context({});
    ASSERT.equal(context.hasOwn(["."]), true);
};


exports.testChildSelfSet1 = function () {
    var context = Context({});
    context.set(["a", "."], 10);
    ASSERT.equal(context.get(["a"]), 10);
};

exports.testChildSelfSet2 = function () {
    var context = Context({});
    context.set([".", "a"], 10);
    ASSERT.equal(context.get(["a"]), 10);
};

if (module === require.main)
    require("narwhal/os").exit(require("test").run(exports));

