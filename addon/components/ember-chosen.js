import Ember from 'ember';
import layout from '../templates/components/ember-chosen';

export default Ember.Component.extend({
  tagName: 'select',
  layout: layout,
  
  classNames: ['ember-chosen'],
  classNameBindings: ['isRTL:chosen-rtl'],
  
  attributeBindings: ['prompt:data-placeholder', 'multiple'],
  
  
  ////////////////
  //! Variables //
  ////////////////
  
  optionGroupPath: "",
  optionValuePath: "",
  optionLabelPath: "",
  
  content: Ember.A(),
  
  action: "",
  
  
  ///////////////
  //! Computed //
  ///////////////
  
  groupNames: Ember.computed.map('content', function(option) {
    return option[this.get('optionGroupPath')];
  }),
  
  groups: Ember.computed.uniq('groupNames'),
  
  options: Ember.computed('content', 'optionValuePath', 'optionLabelPath', 'optionGroupPath', {
    get: function(){
      var that = this,
        options = Ember.A();
      
      if(!that.get('content')) {
        return options;
      }
      
      if(that.get('optionGroupPath')) {
        that.get('groups').forEach(function(group) {
          options.push({
            label: group,
            options: that.get('content').filterBy(that.get('optionGroupPath'), group)
          });
        });
      } else {
        // Build the options array
        that.get('content').forEach(function(option) {
          options.push({
            value: option[that.get('optionValuePath')],
            label: option[that.get('optionLabelPath')]
          });
        });
      }
      
      /*  /
      console.log(
        "%c%s#options: %O",
        "color: purple", // http://www.w3schools.com/html/html_colornames.asp
        that.toString(),
        options
      );
      //*/
      
      return options;
    }
  }),
  
  
  ///////////////
  //! Settings //
  ///////////////
  
  placeholder: "Select an Option",
  
  /*
   * Chosen default options: http://harvesthq.github.io/chosen/options.html
   */
  allowSingleDeselect: false,
  disableSearch: false,
  disableSearchThreshold: 0,
  enableSplitWordSearch: true,
  inheritSelectClasses: false,
  maxSelectedOptions: "Infinity",
  noResultsText: "No Results Match",
  
  placeholderTextMultiple: Ember.computed.alias('placeholder'),
  placeholderTextSingle: Ember.computed.alias('placeholder'),
  
  searchContains: false,
  singleBackstrokeDelete: true,
  width: "100%",
  displayDisabledOptions: true,
  displaySelectedOptions: true,
  includeGroupLabelInSelected: false,
  
  settings: Ember.computed(
    'prompt',
    'isRtl',
    'multiple',
    'allowSingleDeselect',
    'disableSearch',
    'disableSearchThreshold',
    'enableSplitWordSearch',
    'inheritSelectClasses',
    'maxSelectedOptions',
    'noResultsText',
    'placeholderTextMultiple',
    'placeholderTextSingle',
    'searchContains',
    'singleBackstrokeDelete',
    'width',
    'displayDisabledOptions',
    'displaySelectedOptions',
    'includeGroupLabelInSelected',
    function(){
      var that = this,
        properties = that.getProperties(
          'prompt',
          'isRtl',
          'multiple',
          'allowSingleDeselect',
          'disableSearch',
          'disableSearchThreshold',
          'enableSplitWordSearch',
          'inheritSelectClasses',
          'maxSelectedOptions',
          'noResultsText',
          'placeholderTextMultiple',
          'placeholderTextSingle',
          'searchContains',
          'singleBackstrokeDelete',
          'width',
          'displayDisabledOptions',
          'displaySelectedOptions',
          'includeGroupLabelInSelected'
        ),
        settings = {};
      
      for(var prop in properties){
        if( !properties.hasOwnProperty(prop) ){ continue; }
        
        settings[Ember.String.underscore(prop)] = properties[prop];
      }
      
      Ember.run.next(this, function(){
        this.$().trigger("chosen:updated");
      });
      
      return settings;
    }
  ),
  
  _checkAttrs: function() {
    var that = this,
      requiredAttrs = ['optionValuePath', 'optionLabelPath'],
      missingAttrs = [];
    
    requiredAttrs.forEach(function(attr) {
      if(that.get(attr) === "") {
        missingAttrs.push(attr);
      }
    });
    
    if(missingAttrs.length > 0) {
      that.setProperties({
        invalidAttrs: true,
        error: "Missing required attributes: " + missingAttrs.join(', ')
      });
    }
  },
  
  _setup: function(){
    var that = this;
    
    if(that.get('invalidAttrs')) {
      /* */
      console.log(
        "%c%s#_setup %s",
        "color: red;", // http://www.w3schools.com/html/html_colornames.asp
        that.toString(),
        that.get('error')
      );
      //*/
    } else {
      /*  /
      console.log(
        "%c%s#_setup settings: %O",
        "color: purple", // http://www.w3schools.com/html/html_colornames.asp
        that.toString(),
        that.get('settings')
      );
      //*/
      that.$().chosen(that.get('settings')).change(Ember.$.proxy(that.change, that));
    }
  },
  
  _teardown: function(){
    this.$().chosen('destroy');
  },
  
  willInsertElement: function() {
    this._checkAttrs();
  },
  
  didInsertElement: function(){
    this._setup();
  },
  
  willDestroyElement: function(){
    this._teardown();
  },
  
  change: function(){
    this.send('valueUpdate', this.$().val());
  },
  
  
  //////////////
  //! Actions //
  //////////////
  
  actions: {
    valueUpdate: function(value){
      this.set('value', value);
      
      if(this.get('action')) {
        Ember.run.once(this, 'sendAction');
      }
    }
  }
});
