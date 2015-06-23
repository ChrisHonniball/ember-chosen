/* jshint node: true */
'use strict';

var pickFiles = require('broccoli-funnel');
var merge = require('lodash.merge');

module.exports = {
  name: 'ember-chosen',
  included: function(app) {
    this._super.included(app);

    // Setup default options for ember-chosen
    var options = merge({
      'jQuery': true,
      'importChosenCSS': true
    }, app.options['ember-chosen'] || {});

    options.chosenJSType = options.jQuery ? 'jquery' : 'proto';

    // Update `ember-chosen` options on our `app` with updated hash
    app.options['ember-chosen'] = options;

    // Import the correct JS for chosen
    app.import(app.bowerDirectory + '/chosen/chosen.' + options.chosenJSType + '.min.js');

    // Import Chosen CSS (done by default)
    if(options.importChosenCSS) { app.import(app.bowerDirectory + '/chosen/chosen.min.css'); }
  },
  treeForPublic: function(treeName) {
    var tree;

    // Only include the Chosen sprites if we're including Chosen CSS in the build
    if(this.app.options['ember-chosen'].importChosenCSS) {
      tree = pickFiles(this.app.bowerDirectory + '/chosen', {
        srcDir: '/',
        files: ['*.png'],
        destDir: '/assets'
      });
    }

    return tree;
  }
};
