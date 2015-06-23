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
  
  /*
   * The path of the grouping for optgroups.
   * OPTIONAL
   */
  optionGroupPath: "",
  
  /*
   * The path of the value within the content array.
   * REQUIRED
   */
  optionValuePath: "",
  
  /*
   * The path of the label within the content array.
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
  inheritSelectClasses: false,
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
   * Gathers all the group names based on the optionGroupPath.
   */
  groupNames: Ember.computed.map('content', function(option) {
    return option[this.get('optionGroupPath')];
  }),
  
  /*
   * Unique group names from the content provided.
   */
  groups: Ember.computed.uniq('groupNames'),
  
  /*
   * Gathers all the sent values based on the content.
   */
  contentValues: Ember.computed.map('content', function(option) {
    return String(option[this.get('optionValuePath')]);
  }),
  
  /*
   * Built options from the content sent in to the ember-select.
   */
  options: Ember.computed('content', 'optionValuePath', 'optionLabelPath', 'optionGroupPath', {
    get: function(){
      var that = this,
        options = Ember.A();
      
      if(!that.get('content')) {
        return options;
      }
      
      if(that.get('optionGroupPath')) {
        that.get('groups').forEach(function(group) {
          var groupOptions = [];
          
          that.get('content').filterBy(that.get('optionGroupPath'), group).forEach(function(option) {
            groupOptions.push({
              value: option[that.get('optionValuePath')],
              label: option[that.get('optionLabelPath')],
              selected: that._checkSelected(option[that.get('optionValuePath')])
            })
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
            value: option[that.get('optionValuePath')],
            label: option[that.get('optionLabelPath')],
            selected: that._checkSelected(option[that.get('optionValuePath')])
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
      
      return options;
    }
  }),
  
  /*
   * Initializes the settings for th chosen select box.
   * Reformatts the camelized properties to underscired settings for chosen.
   */
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
  
  willInsertElement: function() {
    this._checkAttrs();
  },
  
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
   * Checks to see if a value is selected
   */
  _checkSelected: function(value) {
    var that = this,
      value = String(value),
      selectedValue = that.get('value'),
      selected = false;
    
    if(Ember.$.isArray(value)){
      if(Ember.$.inArray(value, selectedValue) !== -1) {
        selected = true;
      }
    } else {
      if(value === String(selectedValue)) {
        selected = true;
      }
    }
    
    return selected;
  },
  
  /*
   * Checks for required attributes for creating the options for the select box.
   */
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
  
  /*
   * Initializes the chosen select.
   */
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
