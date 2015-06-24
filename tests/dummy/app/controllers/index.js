import Ember from 'ember';

export default Ember.Controller.extend({
  grouping: 'test_group',
  
  options: Ember.A([
    { label: "Label 1", value: "Value 1", group: "Group A", alt_group: "Alt Group A" },
    { label: "Label 2", value: "Value 2", group: "Group A", alt_group: "Alt Group A" },
    { label: "Label 3", value: "Value 3", group: "Group B", alt_group: "Alt Group A" },
    { label: "Label 4", value: "Value 4", group: "Group B", alt_group: "Alt Group B" },
    { label: "Label 5", value: "Value 5", group: "Group C", alt_group: "Alt Group B" },
    { label: "Label 6", value: "Value 6", group: "Group C", alt_group: "Alt Group B" }
  ]),
  
  simpleOptions: Ember.A([
    "Simple Option 1", "Simple Option 2", "Simple Option 3"
  ]),
  
  actions: {
    
    save: function() {
      var that = this;
      
      /* */
      console.log(
        "%c%s#save...",
        "color: purple", // http://www.w3schools.com/html/html_colornames.asp
        that.toString()
      );
      //*/
    }
  }
});
