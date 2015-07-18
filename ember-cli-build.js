/* jshint node: true */
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        // Any other options
    });

    app.import("file1.js");
    app.import("file2.js");

    return app.toTree();
};
