import Ember from 'ember';
import d3 from 'npm:d3';

export default Ember.Component.extend({
  margin: {top:10, right:10, bottom:30, left:30},
  width() {
    let margin = this.get('margin');
    return 650 - margin.left - margin.right;
  },
  height() {
    let margin = this.get('margin');
    return 360 - margin.top - margin.bottom;
  },
  svgContainer: null,
  didInsertElement() {

    this._super(...arguments);

    let data = this.get('data');
    let dataIndex = this.get('dataIndex');

    this.initBarChart(data, dataIndex);

  },
  didUpdate() {

    this._super(...arguments);

    let data = this.get('data');
    let dataIndex = this.get('dataIndex');

    this.barChartUpdate(data, dataIndex);

  },
  initBarChart(dataIn, dataIndexIn) {
    let margin = this.get('margin'),
        width = this.width(),
        height = this.height(),
        svgContainer;

    svgContainer = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("class", "container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.set('svgContainer', svgContainer);

    this.barChart(dataIn, dataIndexIn);
  },
  barChart(dataIn, dataIndexIn) {
    let margin = this.get('margin'),
        width = this.width(),
        height = this.height(),
        svgContainer = this.get('svgContainer');

    let data = dataIn[dataIndexIn];

    let xScale = d3.scaleBand()
          .domain(data.map(function(d) { return d.color; }))
          .rangeRound([0, width]).padding(0.03);

    let yScale = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return d.count; })])
          .range([height, 0]);

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

    let bars = svgContainer.selectAll(".bar")
        .data(data);

    let labels = svgContainer.selectAll(".label")
        .data(data);

    /* Enter */
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", "#3986ff")
        .attr("stroke", "#222222")
        .attr("stroke-width", 2)
        .attr("x", function(d) { return xScale(d.color); })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) { return yScale(d.count); })
        .attr("height", function(d) { return height - yScale(d.count); });

    labels.enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function(d) { return xScale(d.color) + xScale.bandwidth() / 2; })
        .attr("y", function(d) { return yScale(d.count) + 5; })
        .attr("dy", ".75em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.count; })
        .style("fill", "#222");

  },
  barChartUpdate(dataIn, dataIndexIn) {
    let margin = this.get('margin'),
        width = this.width(),
        height = this.height(),
        svgContainer = this.get('svgContainer');

    let data = dataIn[dataIndexIn];

    let yScale = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return d.count; })])
          .range([height, 0]);

    let yAxis = d3.axisLeft(yScale);

    let bars = svgContainer.selectAll(".bar")
          .data(data);

    let labels = svgContainer.selectAll(".label")
          .data(data);

    /* update and transition */

    svgContainer.select(".y.axis")
        .transition()
        .call(yAxis)
        .select("text");

    bars.transition()
        .duration(1000)
        .attr("y", function(d) { return yScale(d.count); })
        .attr("height", function(d) { return height - yScale(d.count); });

    labels.transition()
        .duration(1000)
        .attr("class", "label")
        .attr("y", function(d) { return yScale(d.count) + 5; })
        .text(function(d) { return d.count; });
  }

});
