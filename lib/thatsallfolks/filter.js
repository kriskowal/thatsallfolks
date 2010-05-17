
var HTML = require("narwhal/html");

/*whatsupdoc*/
/*markup markdown*/

/** */
var filters = exports.filters = {};

/*** */
filters.trim = function (value) {
    return String(value).trim();
};

/*** */
filters.html = function (value) {
    return HTML.escape(value);
};

/*** */
filters.attribute = function (value) {
    return HTML.escapeAttribute(value);
};

/*** */
filters.uri = function (value) {
    return encodeURI(value);
};

/*** */
filters.json = function (value) {
    return JSON.stringify(value, null, 4);
};

/*** */
filters['uri-component'] = function (value) {
    return encodeURIComponent(value);
};

/*** */
filters['iso-date'] = function (value) {
    return value.toISOString();
};

/*** */
filters['markdown'] = function (value) {
    return require("markdown").markdown(value);
};

