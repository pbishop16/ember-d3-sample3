import Ember from 'ember';

export default Ember.Controller.extend({
  dataOut: Ember.computed('dataIndex', function() {
    let data = this.get('model');
    let dataIndex = this.get('dataIndex');
    return data[dataIndex];
  })
});
