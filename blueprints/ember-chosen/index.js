module.exports = {
  description: '',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var that = this;
    
    return that.addBowerPackageToProject('chosen', '1.4.2').then(
      function() {
        return that.addBowerPackageToProject('broccoli-funnel', '^0.2.3');
      }
    );
  }
};
