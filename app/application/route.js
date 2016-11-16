import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  model() {
    return [
      [
        {"color":"white","count":23},
        {"color":"blue","count":12},
        {"color":"green","count":35},
        {"color":"black","count":15},
        {"color":"red","count":10},
        {"color":"yellow","count":30},
        {"color":"purple","count":19},
        {"color":"orange","count":8}
      ],
      [
        {"color":"white","count":40},
        {"color":"blue","count":20},
        {"color":"green","count":15},
        {"color":"black","count":35},
        {"color":"red","count":5},
        {"color":"yellow","count":27},
        {"color":"purple","count":13},
        {"color":"orange","count":18}
      ],
      [
        {"color":"white","count":10},
        {"color":"blue","count":25},
        {"color":"green","count":21},
        {"color":"black","count":5},
        {"color":"red","count":18},
        {"color":"yellow","count":16},
        {"color":"purple","count":8},
        {"color":"orange","count":10}
      ]
    ];
  },
  setupController(controller, model) {
    this._super(...arguments);

    this.controllerFor('application').set('dataIndex', 0);
  },
  autoChangeChartData: task(function * () {
    let notify = this.get('notify');
    yield timeout(1000);
    try {
      notify.warning('Starting Automatic Process...');
      while (true) {
        yield timeout(2500);

        let dataIndex = this.controller.get('dataIndex');
        if (dataIndex < this.controller.get('model').length - 1) {
          dataIndex++;
          this.controller.set('dataIndex', dataIndex);
        } else {
          this.controller.set('dataIndex', 0);
        }
        // console.log(this.controller.get('dataIndex'));

        notify.info('Automatically changing chart data...');
      }
    } finally {
      notify.warning('Automatically changing data halted...');
    }
  }).restartable(),
  afterModel() {
    this.get('autoChangeChartData').perform();
  },
  actions: {
    changeChartData() {
      let notify = this.get('notify');
      let dataIndex = this.controller.get('dataIndex');
      if (dataIndex < this.controller.get('model').length - 1) {
        dataIndex++;
        this.controller.set('dataIndex', dataIndex);
      } else {
        this.controller.set('dataIndex', 0);
      }
      notify.success("User forced change.");
      // console.log(this.controller.get('dataIndex'));

    }
  }
});
