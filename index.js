/* jshint node: true */
'use strict';

var funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-chosen',
  included: function(app) {
    this._super.included(app);

    // Import the correct JS for chosen
    app.import(app.bowerDirectory + '/chosen/chosen.jquery.min.js');
    app.import(app.bowerDirectory + '/lodash/lodash.js');

    // Import Chosen CSS (done by default)
    app.import(app.bowerDirectory + '/chosen/chosen.min.css');
  },
  
  treeForPublic: function(treeName) {
    var tree;

    tree = funnel(this.app.bowerDirectory + '/chosen', {
      include: ['*.png'],
      destDir: '/assets'
    });

    return tree;
  },
  
  isDevelopingAddon: function() {
    return true;
  }
};
