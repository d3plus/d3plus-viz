import {extent, merge as arrayMerge} from "d3-array";
import {color} from "d3-color";
import {nest} from "d3-collection";
import {select} from "d3-selection";
import {transition} from "d3-transition";

import {date} from "d3plus-axis";
import {assign as colorAssign} from "d3plus-color";
import {accessor, assign, BaseClass, constant, elem, merge} from "d3plus-common";
import {Legend} from "d3plus-legend";
import {TextBox} from "d3plus-text";
import {Timeline} from "d3plus-timeline";
import {Tooltip} from "d3plus-tooltip";

import {default as colorNest} from "./colorNest";
import {default as getSize} from "./getSize";

import {default as click} from "./on/click";
import {default as mouseenter} from "./on/mouseenter";
import {default as mouseenterLegend} from "./on/mouseenter.legend";
import {default as mouseenterShape} from "./on/mouseenter.shape";
import {default as mousemove} from "./on/mousemove";
import {default as mouseleave} from "./on/mouseleave";

/**
    @class Viz
    @desc Creates an x/y plot based on an array of data. If *data* is specified, immediately draws the tree map based on the specified array and returns the current class instance. If *data* is not specified on instantiation, it can be passed/updated after instantiation using the [data](#treemap.data) method. See [this example](https://d3plus.org/examples/d3plus-treemap/getting-started/) for help getting started using the treemap generator.
*/
export default class Viz extends BaseClass {

  /**
      @memberof Viz
      @desc Invoked when creating a new class instance, and sets any default parameters.
      @private
  */
  constructor() {

    super();

    this._aggs = {};
    this._backClass = new TextBox()
      .on("click", () => {
        if (this._history.length) this.config(this._history.pop()).render();
        else this.depth(this._drawDepth - 1).filter(false).render();
      })
      .on("mousemove", () => this._backClass.select().style("cursor", "pointer"));
    this._data = [];
    this._duration = 600;
    this._highlightOpacity = 0.5;
    this._history = [];
    this._groupBy = [accessor("id")];
    this._legend = true;
    this._legendConfig = {
      shapeConfig: {
        fontResize: false
      }
    };
    this._legendClass = new Legend();
    this._on = {
      "click": click.bind(this),
      "mouseenter": mouseenter.bind(this),
      "mouseenter.legend": mouseenterLegend.bind(this),
      "mouseenter.shape": mouseenterShape.bind(this),
      "mousemove": mousemove.bind(this),
      "mouseleave": mouseleave.bind(this)
    };
    this._padding = 5;
    this._shapes = [];
    this._shapeConfig = {
      fill: (d, i) => colorAssign(this._groupBy[0](d, i)),
      highlightDuration: 50,
      opacity: constant(1),
      stroke: (d, i) => color(colorAssign(this._groupBy[0](d, i))).darker(),
      strokeWidth: constant(0)
    };
    this._timeline = true;
    this._timelineClass = new Timeline()
      .align("end")
      .on("end", s => {
        if (!(s instanceof Array)) s = [s, s];
        s = s.map(Number);
        this._timelineClass.selection(s);
        this.timeFilter(d => {
          const ms = date(this._time(d)).getTime();
          return ms >= s[0] && ms <= s[1];
        }).render();
      });
    this._timelineConfig = {};
    this._tooltip = true;
    this._tooltipClass = new Tooltip().pointerEvents("none");
    this._tooltipConfig = {duration: 50};

  }

  /**
      @memberof Viz
      @desc Preps a shapeConfig object for d3plus data, and optionally bubbles up a specific shape type.
      @param {String} *shape* The shape key to bubble up to the parent config level.
      @private
  */
  _shapeConfigPrep(shape = false) {

    let newConfig = {duration: this._duration};

    for (const key in this._shapeConfig) {

      if ({}.hasOwnProperty.call(this._shapeConfig, key)) {

        if (typeof this._shapeConfig[key] === "function") {
          newConfig[key] = (d, i, s) =>
            this._shapeConfig[key](d.__d3plus__ ? d.data : d, d.__d3plus__ ? d.i : i, s);
        }
        else newConfig[key] = this._shapeConfig[key];

      }

    }

    newConfig.on = Object.keys(this._on)
      .filter(e => !e.includes(".") || e.includes(".shape"))
      .reduce((obj, e) => {
        obj[e] = (d, i) =>
          this._on[e] ? this._on[e](d.__d3plus__ ? d.data : d, d.__d3plus__ ? d.i : i) : null;
        return obj;
      }, {});

    if (shape && this._shapeConfig[shape]) newConfig = assign(newConfig, this._shapeConfig[shape]);
    return newConfig;

  }

  /**
      @memberof Viz
      @desc Manages the SVG group for a UI element.
      @param {String} type
      @private
  */
  _uiGroup(type, condition = true) {
    return elem(`g.d3plus-viz-${type}`, {
      condition,
      enter: {transform: `translate(0, ${this._height / 2})`},
      exit: {opacity: 0},
      parent: this._select,
      transition: this._transition,
      update: {opacity: 1, transform: `translate(0, ${this._height / 2})`}
    });
  }

  /**
      The inner return object and draw function that gets assigned the public methods.
      @private
  */
  render(callback) {

    // Resets margins
    this._margin = {bottom: 0, left: 0, right: 0, top: 0};
    this._transition = transition().duration(this._duration);

    // Appends a fullscreen SVG to the BODY if a container has not been provided through .select().
    if (this._select === void 0 || this._select.node().tagName.toLowerCase() !== "svg") {
      const parent = this._select === void 0 ? select("body") : this._select;
      let [w, h] = getSize(parent.node());
      if (!this._width) this.width(w);
      if (!this._height) this.height(h);
      w = this._width;
      h = this._height;
      this.select(parent.append("svg").style("width", `${w}px`).style("height", `${h}px`).style("display", "block").node());
    }

    // Calculates the width and/or height of the Viz based on the this._select, if either has not been defined.
    if (!this._width || !this._height) {
      const [w, h] = getSize(this._select.node());
      if (!this._width) this.width(w);
      if (!this._height) this.height(h);
    }

    const that = this;

    // based on the groupBy, determine the draw depth and current depth id
    this._drawDepth = this._depth !== void 0 ? this._depth : this._groupBy.length - 1;
    this._id = this._groupBy[this._drawDepth];
    this._ids = (d, i) => this._groupBy
      .map(g => g(d.__d3plus__ ? d.data : d, d.__d3plus__ ? d.i : i))
      .filter(g => g !== void 0 && g.constructor !== Array);
    this._drawLabel = this._label || function(d, i) {
      const l = that._ids(d, i).filter(d => d && d.constructor !== Array);
      return l[l.length - 1];
    };

    this._legendData = [];
    this._filteredData = [];
    if (this._data.length) {

      let data = this._timeFilter ? this._data.filter(this._timeFilter) : this._data;
      if (this._filter) data = data.filter(this._filter);

      const dataNest = nest();
      for (let i = 0; i <= this._drawDepth; i++) dataNest.key(this._groupBy[i]);
      dataNest.rollup(leaves => this._legendData.push(merge(leaves, this._aggs))).entries(data);
      if (this._discrete && `_${this._discrete}` in this) dataNest.key(this[`_${this._discrete}`]);
      dataNest.rollup(leaves => this._filteredData.push(merge(leaves, this._aggs))).entries(data);

    }

    // Renders the timeline if this._time and this._timeline are not falsy and there are more than 1 tick available.
    let timelinePossible = this._time && this._timeline;
    const ticks = timelinePossible ? Array.from(new Set(this._data.map(this._time))).map(date) : [];
    timelinePossible = timelinePossible && ticks.length > 1;
    const timelineGroup = this._uiGroup("timeline", timelinePossible);
    if (timelinePossible) {

      const timeline = this._timelineClass
        .domain(extent(ticks))
        .duration(this._duration)
        .height(this._height / 2 - this._margin.bottom)
        .select(timelineGroup.node())
        .ticks(ticks.sort())
        .width(this._width);

      if (timeline.selection() === void 0) {

        let selection = extent(Array.from(new Set(arrayMerge(this._filteredData.map(d => {
          const t = this._time(d);
          return t instanceof Array ? t : [t];
        })))).map(date));

        if (selection.length === 1) selection = selection[0];
        timeline.selection(selection);

      }

      timeline
        .config(this._timelineConfig)
        .render();

      this._margin.bottom += timeline.outerBounds().height + timeline.padding() * 2;

    }

    // Renders the legend if this._legend is not falsy.
    const legendGroup = this._uiGroup("legend", this._legend);
    if (this._legend) {

      const legend = colorNest(this._legendData, this._shapeConfig.fill, this._groupBy);

      this._legendClass
        .id(legend.id)
        .duration(this._duration)
        .data(legend.data.length > 1 ? legend.data : [])
        .height(this._height / 2 - this._margin.bottom)
        .label(this._label || legend.id)
        .select(legendGroup.node())
        .verticalAlign("bottom")
        .width(this._width)
        .shapeConfig(this._shapeConfig)
        .shapeConfig({on: Object.keys(this._on)
          .filter(e => !e.includes(".") || e.includes(".legend"))
          .reduce((obj, e) => {
            obj[e] = this._on[e];
            return obj;
          }, {})})
        .config(this._legendConfig)
        .render();

      const legendBounds = this._legendClass.outerBounds();
      if (legendBounds.height) this._margin.bottom += legendBounds.height + this._legendClass.padding() * 2;

    }

    const titleGroup = elem("g.d3plus-viz-titles", {parent: this._select});

    this._backClass
      .data(this._history.length ? [{text: "Back", x: this._padding * 2, y: 0}] : [])
      .select(titleGroup.node())
      .render();

    this._margin.top += this._history.length ? this._backClass.fontSize()() + this._padding : 0;

    this._tooltipClass.config(this._tooltipConfig);

    if (callback) setTimeout(callback, this._duration + 100);

    // Draws a rectangle showing the available space for a visualization.
    // const tester = this._select.selectAll(".tester").data([0]);
    // tester.enter().append("rect").attr("fill", "#ccc").merge(tester)
    //   .attr("width", this._width - this._margin.left - this._margin.right)
    //   .attr("height", this._height - this._margin.top - this._margin.bottom)
    //   .attr("x", this._margin.left)
    //   .attr("y", this._margin.top);

    return this;

  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the aggregation method for each key in the object and returns the current class instance. If *value* is not specified, returns the current defined aggregation methods.
      @param {Object} [*value*]
  */
  aggs(_) {
    return arguments.length ? (this._aggs = assign(this._aggs, _), this) : this._aggs;
  }

  /**
      @memberof Viz
      @desc If *data* is specified, sets the data array to the specified array and returns the current class instance. If *data* is not specified, returns the current data array.
      @param {Array} [*data* = []]
  */
  data(_) {
    return arguments.length ? (this._data = _, this) : this._data;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the depth to the specified number and returns the current class instance. The *value* should correspond with an index in the [groupBy](#groupBy) array. If *value* is not specified, returns the current depth.
      @param {Number} [*value*]
  */
  depth(_) {
    return arguments.length ? (this._depth = _, this) : this._depth;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the discrete accessor to the specified method name (usually an axis) and returns the current class instance. If *value* is not specified, returns the current discrete method.
      @param {String} [*value*]
  */
  discrete(_) {
    return arguments.length ? (this._discrete = _, this) : this._discrete;
  }

  /**
      @memberof Viz
      @desc If *ms* is specified, sets the animation duration to the specified number and returns the current class instance. If *ms* is not specified, returns the current animation duration.
      @param {Number} [*ms* = 600]
  */
  duration(_) {
    return arguments.length ? (this._duration = _, this) : this._duration;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the filter to the specified function and returns the current class instance. If *value* is not specified, returns the current filter.
      @param {Function} [*value*]
  */
  filter(_) {
    return arguments.length ? (this._filter = _, this) : this._filter;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the group accessor(s) to the specified string, function, or array of values and returns the current class instance. If *value* is not specified, returns the current group accessor.
      @param {String|Function|Array} [*value*]
      @example
function value(d) {
  return d.id;
}
  */
  groupBy(_) {
    if (!arguments.length) return this._groupBy;
    if (!(_ instanceof Array)) _ = [_];
    return this._groupBy = _.map(k => {
      if (typeof k === "function") return k;
      else {
        if (!this._aggs[k]) {
          this._aggs[k] = a => {
            const v = Array.from(new Set(a));
            return v.length === 1 ? v[0] : v;
          };
        }
        return accessor(k);
      }
    }), this;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the overall height to the specified number and returns the current class instance. If *value* is not specified, returns the current overall height.
      @param {Number} [*value* = window.innerHeight]
  */
  height(_) {
    return arguments.length ? (this._height = _, this) : this._height;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the highlight method to the specified function and returns the current class instance. If *value* is not specified, returns the current highlight method.
      @param {Function} [*value*]
  */
  highlight(_) {

    let shapeData = arrayMerge(this._shapes.map(s => s.data()));
    shapeData = shapeData.concat(this._legendClass.data());
    const highlightData = _ ? shapeData.filter(_) : [];

    let highlightIds = [];
    highlightData.map(this._ids).forEach(ids => {
      for (let x = 1; x <= ids.length; x++) {
        highlightIds.push(JSON.stringify(ids.slice(0, x)));
      }
    });
    highlightIds = highlightIds.filter((id, i) => highlightIds.indexOf(id) === i);

    let highlightFunction;
    if (highlightIds.length) highlightFunction = (d, i) => highlightIds.includes(JSON.stringify(this._ids(d, i)));

    this._shapes.forEach(s => s.highlight(highlightFunction));
    if (this._legend) this._legendClass.highlight(highlightFunction);

    return this;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the label accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current text accessor, which is `undefined` by default.
      @param {Function|String} [*value*]
  */
  label(_) {
    return arguments.length ? (this._label = typeof _ === "function" ? _ : constant(_), this) : this._label;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the legend based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current value.
      @param {Boolean} [*value* = true]
  */
  legend(_) {
    return arguments.length ? (this._legend = _, this) : this._legend;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, the object is passed to the legend's config method. If *value* is not specified, returns the current legend config.
      @param {Object} [*value*]
  */
  legendConfig(_) {
    return arguments.length ? (this._legendConfig = _, this) : this._legendConfig;
  }

  /**
      @memberof Viz
      @desc If *selector* is specified, sets the SVG container element to the specified d3 selector or DOM element and returns the current class instance. If *selector* is not specified, returns the current SVG container element, which is `undefined` by default.
      @param {String|HTMLElement} [*selector*]
  */
  select(_) {
    return arguments.length ? (this._select = select(_), this) : this._select;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the shape accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current shape accessor.
      @param {Function|String} [*value*]
  */
  shape(_) {
    return arguments.length ? (this._shape = typeof _ === "function" ? _ : constant(_), this) : this._shape;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for each shape and returns the current class instance. If *value* is not specified, returns the current shape configuration.
      @param {Object} [*value*]
  */
  shapeConfig(_) {
    return arguments.length ? (this._shapeConfig = assign(this._shapeConfig, _), this) : this._shapeConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the time accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current time accessor. The time values that are returned should be valid Date objects, 4-digit year values, or strings that can be parsed into javascript Date objects (click [here](http://dygraphs.com/date-formats.html) for valid string formats).
      @param {Function|String} [*value*]
  */
  time(_) {
    if (arguments.length) {
      if (typeof _ === "function") {
        this._time = _;
      }
      else {
        this._time = accessor(_);
        if (!this._aggs[_]) {
          this._aggs[_] = a => {
            const v = Array.from(new Set(a));
            return v.length === 1 ? v[0] : v;
          };
        }
      }
      return this;
    }
    else return this._time;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the time filter to the specified function and returns the current class instance. If *value* is not specified, returns the current time filter.
      @param {Function} [*value*]
  */
  timeFilter(_) {
    return arguments.length ? (this._timeFilter = _, this) : this._timeFilter;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the timeline based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current timeline visibility.
      @param {Boolean} [*value* = true]
  */
  timeline(_) {
    return arguments.length ? (this._timeline = _, this) : this._timeline;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the timeline and returns the current class instance. If *value* is not specified, returns the current timeline configuration.
      @param {Object} [*value*]
  */
  timelineConfig(_) {
    return arguments.length ? (this._timelineConfig = assign(this._timelineConfig, _), this) : this._timelineConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current tooltip visibility.
      @param {Boolean} [*value* = true]
  */
  tooltip(_) {
    return arguments.length ? (this._tooltip = _, this) : this._tooltip;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the tooltip and returns the current class instance. If *value* is not specified, returns the current tooltip configuration.
      @param {Object} [*value*]
  */
  tooltipConfig(_) {
    return arguments.length ? (this._tooltipConfig = assign(this._tooltipConfig, _), this) : this._tooltipConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the overallwidth to the specified number and returns the current class instance. If *value* is not specified, returns the current overall width.
      @param {Number} [*value* = window.innerWidth]
  */
  width(_) {
    return arguments.length ? (this._width = _, this) : this._width;
  }

}
