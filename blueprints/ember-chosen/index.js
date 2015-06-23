module.exports = {
  description: '',

  normalizeEntityName: function() {},

  afterInstall: function() {
    // Perform extra work here.
    return this.addBowerPackageToProject('chosen', '1.4.2');
  }
};
