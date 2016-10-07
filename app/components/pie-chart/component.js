import Ember from 'ember';
import d3 from 'npm:d3';

export default Ember.Component.extend({

  didInsertElement() {
    this._super(...arguments);

    let data = this.get('data');
    let dataIndex = this.get('dataIndex');

    pieChart(data, dataIndex);

  },
  didUpdate() {
    this._super(...arguments);

    let data = this.get('data');
    let dataIndex = this.get('dataIndex');

    change(data, dataIndex);
  }
});

// Pie Chart code
let width = 300,
    height = 400,
    radius = Math.min(width, height) / 2;

let color = d3.scaleOrdinal(d3.schemeCategory20b);

let arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

let labelArc = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

/**
* pieChart
* Sets the base Pie Chart.
*
* @name pieChart
* @function
* @param {Array} dataIn the base data array of arrays,
* @param {Number} dataIndexIn the array index,
*/
function pieChart(dataIn, dataIndexIn) {

  let data = dataIn;

  let pie = d3.pie()
        .value(function(d) { return d.count; })(data[dataIndexIn]);

  let svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + ", " + height/2 + ")");

  let g = svg.selectAll("arc")
        .data(pie)
        .enter().append("g")
        .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d, i) { return color(i); })
      .style("stroke", "#222")
      .each(function(d) { this._current = d; });

  //Labels
  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .text(function(d) { return d.data.color; })
      .attr("text-anchor", "middle")
      .style("fill", "#FFF")
      .each(function(d) { this._current = d; });
};

/**
* arcTween
* Interpolates the current and new values for the pie chart sections
*
* @name arcTween
* @function
* @param {Array} dataIn the base data array of arrays
* @return {String} The new interplated value for the attr
*/
function arcTween(a) {
  let i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

/**
* labelArcTween
* Interpolates the current and new values for the pie chart labels
*
* @name labelArcTween
* @function
* @param {Array} dataIn the base data array of arrays
* @return {String} The new interplated value for the attr
*/
function labelArcTween(a) {
  let i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return "translate(" + labelArc.centroid(i(t)) + ")";
  };
}

/**
* change
* Updates the base Pie Chart.
*
* @name change
* @function
* @param {Array} dataIn the base data array of arrays,
* @param {Number} dataIndexIn the array index,
*/
function change(dataIn, dataIndexIn) {
  let pie = d3.pie()
      .value(function(d) { return d.count; })(dataIn[dataIndexIn]);
  let path = d3.select("#pie-chart").selectAll("path").data(pie);
  path.transition().duration(1000).attrTween("d", arcTween);
  d3.selectAll("text").data(pie).transition().duration(1000).attrTween("transform", labelArcTween);
};
