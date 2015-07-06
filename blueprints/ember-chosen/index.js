module.exports = {
  description: '',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var that = this;
    
    return that.addBowerPackagesToProject([
      { name: 'chosen', target: '1.4.2' },
      { name: 'lodash' }
    ]);
  }
};
