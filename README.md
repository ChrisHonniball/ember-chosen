# Ember-Chosen

This project in currently a work-in-progress.

## Usage

```javascript
// Your controller/component...
export default Ember.Controller.extend({
  selection: "test",
  
  someOpts: [
    { label: "something", value: "something" },
    { label: "to", value: "to" },
    { label: "test", value: "test" }
  ]
});
```

```handlebars
{{ember-chosen
  content=someOpts
  optionValuePath="value"
  optionLabelPath="label"
  optionGroupPath="group"
  value=selection
  action="save"
}}
```
