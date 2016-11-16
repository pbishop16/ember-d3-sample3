import Ember from 'ember';
import d3 from 'npm:d3';

export default Ember.Component.extend({
  width: 360,
  height: 360,
  radius() {
    let width = this.get('width'),
        height = this.get('height');

    return Math.min(width, height) / 2;
  },
  color() {
    return d3.scaleOrdinal(d3.schemeCategory20b);
  },
  arc() {
    let radius = this.radius();
    return d3.arc().outerRadius(radius - 10).innerRadius(0);
  },
  labelArc() {
    let radius = this.radius();
    return d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);
  },
  didInsertElement() {
    this._super(...arguments);

    let data = this.get('data');
    let dataIndex = this.get('dataIndex');

    this.pieChart(data, dataIndex);

  },
  didUpdate() {
    this._super(...arguments);

    let data = this.get('data');
    let dataIndex = this.get('dataIndex');

    this.change(data, dataIndex);
  },
  pieChart(dataIn, dataIndexIn) {
    let width = this.get('width'),
        height = this.get('height'),
        arc = this.arc(),
        labelArc = this.labelArc(),
        color = this.color(),
        that = this;

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
        .each(function(d) { this._current = d; that.set('chartContext', this._current); });

    //Labels
    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .text(function(d) { return d.data.color; })
        .attr("text-anchor", "middle")
        .style("fill", "#FFF")
        .each(function(d) { this._current = d; that.set('chartContextLable', this._current); });

  },
  change(dataIn, dataIndexIn) {

    let labelArc = this.labelArc();
    let arc = this.arc();

    function labelArcTween(a) {
      let i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return "translate(" + labelArc.centroid(i(t)) + ")";
      };
    }

    function arcTween(a) {
      let i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    let pie = d3.pie()
        .value(function(d) { return d.count; })(dataIn[dataIndexIn]);
    let path = d3.select("#pie-chart").selectAll("path").data(pie);
    path.transition().duration(1000).attrTween("d", arcTween);
    d3.selectAll("text").data(pie).transition().duration(1000).attrTween("transform", labelArcTween);
  }

});
