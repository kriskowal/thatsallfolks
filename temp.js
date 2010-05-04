var taf = require("thatsallfolks/load");
var FS = require("narwhal/fs");
print(taf.load(FS.canonical("temp.html")).format({
    "foo": {
        "bar": 10
    },
    "fooz": [
        {"foo": 20},
        {"foo": 30}
    ]
}));
