
var Context = require("thatsallfolks/context").Context;

exports.test = function (ASSERT) {
    var parent = Context({});
    var context = Context(parent);
    parent.set(["a", "b"], 10);
    context.set(["a"], 20);
    ASSERT.equal(10, context.get(["a", "b"]));
    ASSERT.equal(20, context.get(["a"]));
};

if (module === require.main)
    require("narwhal/os").exit(require("test").run(exports));

