import DS from 'ember-data';

export default DS.Model.extend({
  first_name: DS.attr('string'),
  mi: DS.attr('string'),
  last_name: DS.attr('string'),
  addr1: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string')
});
