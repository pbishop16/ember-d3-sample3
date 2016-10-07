import Ember from 'ember';
import d3 from 'npm:d3';

export default Ember.Component.extend({

  didInsertElement() {

    this._super(...arguments);

    let data = this.get('data');
    let dataIndex = this.get('dataIndex');

    initLineChart(data, dataIndex);

  },
  didUpdate() {

    this._super(...arguments);

    let data = this.get('data');
    let dataIndex = this.get('dataIndex');

    lineChartUpdate(data, dataIndex);

  }
});



/* Line Chart */

let margin = { top:10, right:10, bottom:40, left:30 },
    width = 700 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom,
    svgContainer;

/**
* initLineChart
* Sets the base SVG line chart container and calls the line chart function
*
* @name initLineChart
* @function
* @param {Array} dataIn the base data array of arrays,
* @param {Number} dataIndexIn the array index,
*/
function initLineChart(dataIn, dataIndexIn){

  svgContainer = d3.select("#line-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g").attr("class", "container")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  lineChart(dataIn, dataIndexIn);
}

/**
* lineChart
* Sets the base Line Chart.
*
* @name lineChart
* @function
* @param {Array} dataIn the base data array of arrays,
* @param {Number} dataIndexIn the array index,
*/
function lineChart(dataIn, dataIndexIn){

  let data = dataIn[dataIndexIn];

  let xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.color; }))
        .rangeRound([0, width]);

  let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.count; })])
      .range([height,0]);

  let xAxis = d3.axisBottom(xScale);

  let yAxis = d3.axisLeft(yScale);

  let xAxis_g = svgContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height) + ")")
      .call(xAxis)
      .select("text");

  let yAxis_g = svgContainer.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis)
      .select("text");

  let line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(function(d) { return xScale(d.color) + xScale.bandwidth() / 2; })
      .y(function(d) { return yScale(d.count); });

  let lineElement = svgContainer.selectAll(".line")
      .data(data);

  let labels = svgContainer.selectAll(".label")
      .data(data);

  lineElement.enter()
      .append("g")
      .attr("class", "line")
      .append("path")
      .attr("d", line(data))
      .style("fill", "none")
      .attr("stroke", "#222")
      .attr("stroke-width", 1.5);

  labels.enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function(d) { return xScale(d.color) + xScale.bandwidth() / 2; })
      .attr("y", function(d) { return yScale(d.count) + 20; })
      .attr("dy", ".75em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.count; })
      .style("fill", "#00f");
}

/**
* lineChartUpdate
* Updates the base Line Chart
*
* @name lineChartUpdate
* @function
* @param {Array} dataIn the base data array of arrays,
* @param {Number} dataIndexIn the array index,
*/
function lineChartUpdate(dataIn, dataIndexIn) {

  let data = dataIn[dataIndexIn];

  let xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.color; }))
        .rangeRound([0, width]);

  let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.count; })])
      .range([height,0]);

  let yAxis = d3.axisLeft(yScale);

  svgContainer.select(".y.axis")
      .transition()
      .call(yAxis)
      .select("text");

  let line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(function(d) { return xScale(d.color) + xScale.bandwidth() / 2; })
      .y(function(d) { return yScale(d.count); });

  let lineElement = svgContainer.selectAll(".line")
      .data(data);

  let labels = svgContainer.selectAll(".label")
      .data(data);

  lineElement.select("path")
      .transition()
      .duration(1000)
      .attr("d", line(data));

  labels.transition()
      .duration(1000)
      .attr("y", function(d) { return yScale(d.count) + 20; })
      .text(function(d) { return d.count; });

}
