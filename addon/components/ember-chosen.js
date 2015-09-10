import Ember from 'ember';
import layout from '../templates/components/ember-chosen';

export default Ember.Component.extend({
  layout: layout,
  
  classNames: ['ember-chosen'],
  classNameBindings: ['isRTL:chosen-rtl'],
  
  attributeBindings: ['multiple', 'disabled', 'style'],
  
  
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
  content: null,
  
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
   * Validates the optionGroupPath in the content array.
   */
  validGroupPath: Ember.computed('optionGroupPath', {
    get() {
      let validGroupPath,
        lastObject = this.get('content.lastObject');
      
      if(!this.get('optionGroupPath')) {
        return false;
      }
      
      if(lastObject.hasOwnProperty(this.get('optionGroupPath'))) {
        validGroupPath = true;
      } else {
        Ember.Logger.log(
          "%c%s#validGroupPath Invalid optionGroupPath `%s`.",
          "color: red", // http://www.w3schools.com/html/html_colornames.asp
          this.toString(),
          this.get('optionGroupPath')
        );
        
        validGroupPath = false;
      }
      
      return validGroupPath;
    }
  }),
  
  valueObserver: Ember.observer('value', function(){
    this._updateChosen();
  }),
  
  /*
   * Built options from the content sent in to the ember-select.
   */
  options: Ember.computed('content', 'optionValuePath', 'optionLabelPath', 'optionGroupPath', 'disabled', {
    get() {
      let groupNames = [],
        groups = [],
        options = Ember.A();
      
      if(!this.get('content')) {
        return null;
      }
      
      if(this.get('validGroupPath')) {
        groupNames = this.get('content').mapBy(this.get('optionGroupPath'));
        groups = Ember.A(groupNames).uniq();
        
        /*  /
        Ember.Logger.log(
          "%c%s#options creating groups: %O from %O",
          "color: purple", // http://www.w3schools.com/html/html_colornames.asp
          this.toString(),
          groups,
          groupNames
        );
        //*/
         
        // Build the options with groups
        groups.forEach((group) => {
          let groupOptions = [];
          
          this.get('content').filterBy(this.get('optionGroupPath'), group).forEach((option) => {
            if(typeof option.get === "undefined" && typeof option !== "string") {
              option = Ember.Object.create(option);
            }
            
            groupOptions.push({
              value: this._lookupOptionValue(option),
              label: this._lookupOptionLabel(option),
              selected: this._checkSelected(this._lookupOptionValue(option))
            });
          });
          
          options.push({
            label: group,
            options: groupOptions
          });
        });
      } else {
        // Build the options array
        this.get('content').forEach((option) => {
          if(typeof option.get === "undefined" && typeof option !== "string") {
            option = Ember.Object.create(option);
          }
          
          options.push({
            value: this._lookupOptionValue(option),
            label: this._lookupOptionLabel(option),
            selected: this._checkSelected(this._lookupOptionValue(option))
          });
        });
      }
      
      /*  /
      Ember.Logger.log(
        "%c%s#options: %O, value: %O",
        "color: purple", // http://www.w3schools.com/html/html_colornames.asp
        this.toString(),
        options,
        this.get('value')
      );
      //*/
      
      this._updateChosen();
      
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
    function() {
      let properties = this.getProperties(
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
      
      for(let prop in properties){
        if( !properties.hasOwnProperty(prop) ){ continue; }
        
        // Convert the camelized properties to underscored for chosen.
        settings[Ember.String.underscore(prop)] = properties[prop];
      }
      
      this._updateChosen();
      
      return settings;
    }
  ),
  
  style: Ember.computed({
    get() {
      let style = String('width: ' + this.get('width'));
      
      return Ember.String.htmlSafe(style);
    }
  }),
  
  
  /////////////
  //! Events //
  /////////////
  
  didInsertElement() {
    this._setup();
  },
  
  willDestroyElement() {
    this._teardown();
  },
  
  
  ////////////////
  //! Functions //
  ////////////////
  
  /*
   * Updates the chosen select box.
   */
  _updateChosen() {
    Ember.run.next(this, () => {
      this.$('#ember-chosen-' + this.get('elementId')).trigger("chosen:updated");
    });
  },
  
  /*
   * Looks up the option's value
   */
  _lookupOptionValue(option) {
    let optionValue,
      lookupPath = null;
    
    if(this.get('optionValuePath')) {
      lookupPath = this.get('optionValuePath');
    } else {
      if(this.get('optionLabelPath')) {
        lookupPath = this.get('optionLabelPath');
      }
    }
    
    optionValue = (lookupPath) ? option.get(lookupPath) : option;
    
    return optionValue;
  },
  
  /*
   * Looks up the option's label
   */
  _lookupOptionLabel(option) {
    let optionLabel,
      lookupPath = null;
    
    if(this.get('optionLabelPath')) {
      lookupPath = this.get('optionLabelPath');
    } else {
      if(this.get('optionValuePath')) {
        lookupPath = this.get('optionValuePath');
      }
    }
    
    optionLabel = (lookupPath) ? option.get(lookupPath) : option;
    
    return optionLabel;
  },
  
  /*
   * Checks to see if a value is selected
   */
  _checkSelected(optionValue) {
    let value = this.get('value'),
      selected = false;
    
    if(Ember.$.isArray(value)){
      let found = value.indexOf(optionValue);

      if(found !== -1) {
        selected = true;
      }
    } else {
      if(String(value) === String(optionValue) && optionValue !== undefined) {
        selected = true;
      } else {
        selected = false;
      }
    }
    
    return selected;
  },
  
  /*
   * Initializes the chosen select.
   */
  _setup() {
    // If there is no content assume this we are using block content and attempt to select the appropriate option.
    if(!this.get('content')) {
      // Look for the selection via it's value.
      let foundSelectedOption = this.$('option[value="' + this.get('value') + '"]');
      
      // If not found, look for selection via it's HTML content.
      if(foundSelectedOption.length === 0){
        foundSelectedOption = this.$('option').filter((_i, $el) => {
          return Ember.$($el).html() === this.get('value');
        });
      }
      
     if(foundSelectedOption.length === 0){
        // If still not found, log notification.
        Ember.Logger.log(
          "%c%s#_setup unable to select option with a value or text of `%s`.",
          "color: red", // http://www.w3schools.com/html/html_colornames.asp
          this.toString(),
          this.get('value')
        );
      } else {
        // If found, select the option.
        foundSelectedOption.attr('selected', true);
      }
    }
    
    // Initialize the select box.
    this.$('#ember-chosen-' + this.get('elementId')).chosen(this.get('settings'));
  },
  
  /*
   * Destroys the chosen select.
   */
  _teardown() {
    this.$('#ember-chosen-' + this.get('elementId')).chosen('destroy');
  },
  
  
  //////////////
  //! Actions //
  //////////////
  
  actions: {
    selectValue() {
      this.set('value', this.$('#ember-chosen-' + this.get('elementId')).val());
      
      /*  /
      Ember.Logger.log(
        "%c%s#selectValue: %O",
        "color: purple", // http://www.w3schools.com/html/html_colornames.asp
        this.toString(),
        this.$('#ember-chosen-' + this.get('elementId')).val()
      );
      //*/
      
      if(this.get('action')) {
        Ember.run.once(this, 'sendAction');
      }
    }
  }
});
