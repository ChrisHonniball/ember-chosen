# Ember-Chosen

This project in currently a work-in-progress.

## Usage

```handlebars
{{ember-chosen
  content=someOpts
  optionValuePath="user_id"
  optionLabelPath="contact_fullname"
  optionGroupPath="status"
  value=model.user_id
  action="save"
}}
```
