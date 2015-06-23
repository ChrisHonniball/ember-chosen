import Ember from 'ember';

export default Ember.Controller.extend({
  options: Ember.A([
    { label: "Controller Value Test 1", value: "Controller Test 1", group: "Group A" },
    { label: "Controller Value Test 2", value: "Controller Test 2", group: "Group A" },
    { label: "Controller Value Test 3", value: "Controller Test 3", group: "Group B" }
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
