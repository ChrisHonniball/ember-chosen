import Ember from 'ember';
import layout from '../templates/components/ember-chosen';

export default Ember.Component.extend({
  tagName: 'select',
  layout: layout,
  
  classNames: ['ember-chosen'],
  classNameBindings: ['isRTL:chosen-rtl'],
  
  attributeBindings: ['multiple', 'disabled'],
  
  
  ////////////////
  //! Variables //
  ////////////////
  
  isRTL: false,
  
  multiple: false,
  
  disabled: false,
  
  /*
   * The content path where the group name is located.
   * OPTIONAL
   */
  optionGroupPath: "",
  
  /*
   * The content path where the value is located.
   * REQUIRED
   */
  optionValuePath: "",
  
  /*
   * The content path where the label is located. 
   * REQUIRED
   */
  optionLabelPath: "",
  
  /*
   * Hides the empty option.
   */
  skipEmptyItem: false,
  
  /*
   * Content that is sent to the ember-chosen.
   * This is used to build the options array.
   */
  content: Ember.A(),
  
  /*
   * The action to execute on change.
   */
  action: "",
  
  
  ///////////////
  //! Settings //
  ///////////////
  
  /*
   * Placeholder text for both the multiple version of the chosen
   * and the single version.
   */
  placeholder: "Select an Option",
  
  /*
   * Chosen default options.
   * Reference: http://harvesthq.github.io/chosen/options.html
   */
  allowSingleDeselect: false,
  disableSearch: false,
  disableSearchThreshold: 0,
  enableSplitWordSearch: true,
  inheritSelectClasses: true,
  maxSelectedOptions: "Infinity",
  noResultsText: "No Results Match",
  searchContains: false,
  singleBackstrokeDelete: true,
  width: "100%",
  displayDisabledOptions: true,
  displaySelectedOptions: true,
  includeGroupLabelInSelected: false,
  
  /*
   * Aliased properties to the placeholder for easier setting.
   */
  placeholderTextMultiple: Ember.computed.alias('placeholder'),
  placeholderTextSingle: Ember.computed.alias('placeholder'),
  
  
  ///////////////
  //! Computed //
  ///////////////
  
  /*
   * Built options from the content sent in to the ember-select.
   */
  options: Ember.computed('content', 'optionValuePath', 'optionLabelPath', 'optionGroupPath', {
    get: function(){
      var that = this,
        options = Ember.A(),
        groupNames = that.get('content').mapBy(this.get('optionGroupPath')),
        groups = Ember.$.unique(groupNames);
      
      if(!that.get('content')) {
        return options;
      }
      
      if(that.get('optionGroupPath')) {
        groups.forEach(function(group) {
          var groupOptions = [];
          
          that.get('content').filterBy(that.get('optionGroupPath'), group).forEach(function(option) {
            groupOptions.push({
              value: that._lookupOptionValue(option),
              label: that._lookupOptionLabel(option),
              selected: that._checkSelected(that._lookupOptionValue(option))
            });
          });
          
          options.push({
            label: group,
            options: groupOptions
          });
        });
      } else {
        // Build the options array
        that.get('content').forEach(function(option) {
          options.push({
            value: that._lookupOptionValue(option),
            label: that._lookupOptionLabel(option),
            selected: that._checkSelected(that._lookupOptionValue(option))
          });
        });
      }
      
      /*  /
      console.log(
        "%c%s#options: %O, value: %O",
        "color: purple", // http://www.w3schools.com/html/html_colornames.asp
        that.toString(),
        options,
        that.get('value')
      );
      //*/
      
      Ember.run.next(that, function(){
        that.$().trigger("chosen:updated");
      });
      
      return options;
    }
  }),
  
  /*
   * Initializes the settings for th chosen select box.
   * Reformatts the camelized properties to underscired settings for chosen.
   */
  settings: Ember.computed(
    'isRtl',
    'multiple',
    'disabled',
    'placeholder',
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
        
        // Convert the camelized properties to underscored for chosen.
        settings[Ember.String.underscore(prop)] = properties[prop];
      }
      
      Ember.run.next(this, function(){
        this.$().trigger("chosen:updated");
      });
      
      return settings;
    }
  ),
  
  
  /////////////
  //! Events //
  /////////////
  
  didInsertElement: function(){
    this._setup();
  },
  
  willDestroyElement: function(){
    this._teardown();
  },
  
  /*
   * Default change event. Linked to the chosen change event.
   */
  change: function(){
    this.send('valueUpdate', this.$().val());
  },
  
  
  ////////////////
  //! Functions //
  ////////////////
  
  /*
   * Looks up the option's value
   */
  _lookupOptionValue: function(option) {
    var that = this, optionValue;
    
    if(that.get('optionValuePath')) {
      optionValue = option[that.get('optionValuePath')];
    } else {
      if(that.get('optionLabelPath')) {
        optionValue = option[that.get('optionLabelPath')];
      } else {
        optionValue = option;
      }
    }
    
    return optionValue;
  },
  
  /*
   * Looks up the option's label
   */
  _lookupOptionLabel: function(option) {
    var that = this, optionLabel;
    
    if(that.get('optionLabelPath')) {
      optionLabel = option[that.get('optionLabelPath')];
    } else {
      if(that.get('optionValuePath')) {
        optionLabel = option[that.get('optionValuePath')];
      } else {
        optionLabel = option;
      }
    }
    
    return optionLabel;
  },
  
  /*
   * Checks to see if a value is selected
   */
  _checkSelected: function(value) {
    var that = this,
      valueStr = String(value),
      selectedValue = that.get('value'),
      selected = false;
    
    if(Ember.$.isArray(value)){
      if(Ember.$.inArray(value, selectedValue) !== -1) {
        selected = true;
      }
    } else {
      if(valueStr === String(selectedValue)) {
        selected = true;
      }
    }
    
    return selected;
  },
  
  /*
   * Initializes the chosen select.
   */
  _setup: function(){
    var that = this;
    
    that.$().chosen(that.get('settings'));
  },
  
  /*
   * Destroys the chosen select.
   */
  _teardown: function(){
    this.$().chosen('destroy');
  },
  
  
  //////////////
  //! Actions //
  //////////////
  
  actions: {
    /*
     * Handles setting the value when the select box's value changes.
     */
    valueUpdate: function(value){
      this.set('value', value);
      
      if(this.get('action')) {
        Ember.run.once(this, 'sendAction');
      }
    }
  }
});
