/* jshint node: true */
'use strict';

var funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-chosen',
  included: function(app) {
    this._super.included(app);

    // Import the correct JS for chosen
    app.import(app.bowerDirectory + '/chosen/chosen.min.jquery.js');

    // Import Chosen CSS
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

  afterInstall: function() {
    return this.addBowerPackageToProject('chosen', '~1.6.2');
  },

  isDevelopingAddon: function() {
    return true;
  }
};
