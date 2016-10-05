import {extent, merge as arrayMerge} from "d3-array";
import {color} from "d3-color";
import {nest} from "d3-collection";
import {mouse, select} from "d3-selection";
import {transition} from "d3-transition";

import {date} from "d3plus-axis";
import {assign} from "d3plus-color";
import {accessor, BaseClass, constant, elem, merge, prefix} from "d3plus-common";
import {Legend} from "d3plus-legend";
import {strip, TextBox} from "d3plus-text";
import {Timeline} from "d3plus-timeline";
import {tooltip} from "d3plus-tooltip";

import {default as colorNest} from "./colorNest";
import {default as getSize} from "./getSize";

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

    this._backClass = new TextBox()
      .on("click", () => {
        if (this._history.length) this.config(this._history.pop()).render();
        else this.depth(this._drawDepth - 1).filter(false).render();
      });
    this._data = [];
    this._duration = 600;
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
      click: (d, i) => {

        if (this._drawDepth < this._groupBy.length - 1) {

          const filterGroup = this._groupBy[this._drawDepth],
                filterId = this._id(d, i);

          this.highlight(false);
          if (this._tooltip) this._tooltipClass.data([])();

          this._history.push({
            depth: this._depth,
            filter: this._filter
          });

          this.config({
            depth: this._drawDepth + 1,
            filter: (f, x) => filterGroup(f, x) === filterId
          }).render();

        }

      },
      mouseenter: (d, i) => {

        const filterId = this._id(d, i);

        this.highlight((h, x) => {
          const myId = this._id(h, x);
          if (myId.constructor === Array && filterId.constructor !== Array) return myId.includes(filterId);
          if (myId.constructor !== Array && filterId.constructor === Array) return filterId.includes(myId);
          return myId === filterId;
        });

        if (this._tooltip) {
          this._tooltipClass.data([d])
            .footer(this._drawDepth < this._groupBy.length - 1 ? "Click to Expand" : "")
            .translate(mouse(select("html").node()))
            ();
        }

      },
      mousemove: () => {

        if (this._tooltip) {
          this._tooltipClass.translate(mouse(select("html").node()))();
        }

      },
      mouseleave: () => {
        this.highlight(false);
        if (this._tooltip) this._tooltipClass.data([])();
      }
    };
    this._padding = 5;
    this._shapes = [];
    this._shapeConfig = {
      fill: (d, i) => assign(this._id(d, i)),
      opacity: constant(1),
      stroke: (d, i) => color(assign(this._id(d, i))).darker(),
      strokeWidth: constant(0)
    };
    this._timeline = {};
    this._timelineClass = new Timeline();
    this._tooltip = {duration: 50};
    this._tooltipClass = tooltip().pointerEvents("none");

  }

  /**
      @memberof Viz
      @desc Manages the SVG group for a UI element.
      @param {String} type
      @private
  */
  _uiGroup(type, condition = true) {
    return elem(`g.d3plus-plot-${type}`, {
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
    this._drawLabel = this._label || function(d, i) {
      let l = that._id(d, i);
      if (l.constructor !== Array) return l;
      for (let x = that._drawDepth; x >= 0; x--) {
        l = that._groupBy[x](d, i);
        if (l.constructor !== Array) break;
      }
      return l;
    };

    this._filteredData = [];
    if (this._data.length) {
      const aggs = {};
      if (this._timeKey) {
        aggs[this._timeKey] = a => {
          const v = Array.from(new Set(a));
          return v.length === 1 ? v[0] : v;
        };
      }
      const dataNest = nest().rollup(leaves => this._filteredData.push(merge(leaves, aggs)));
      for (let i = 0; i <= this._drawDepth; i++) dataNest.key(this._groupBy[i]);
      if (this._discrete) dataNest.key(this[`_${this._discrete}`]);
      const data = this._timeFilter ? this._data.filter(this._timeFilter) : this._data;
      dataNest.entries(this._filter ? data.filter(this._filter) : data);
    }

    // Renders the timeline if this._time and this._timeline are not falsy and there are more than 1 tick available.
    let timelinePossible = this._time && this._timeline;
    const ticks = timelinePossible ? Array.from(new Set(this._data.map(this._time))).map(date) : [];
    timelinePossible = timelinePossible && ticks.length > 1;
    const timelineGroup = this._uiGroup("timeline", timelinePossible);
    if (timelinePossible) {

      let selection = extent(Array.from(new Set(arrayMerge(this._filteredData.map(d => {
        const t = this._time(d);
        return t instanceof Array ? t : [t];
      })))).map(date));
      if (selection.length === 1) selection = selection[0];

      const timeline = this._timelineClass
        .align("end")
        .domain(extent(ticks))
        .duration(this._duration)
        .height(this._height / 2 - this._margin.bottom)
        .on("end", s => {
          if (!(s instanceof Array)) s = [s, s];
          s = s.map(Number);
          this.timeFilter(d => {
            const ms = date(this._time(d)).getTime();
            return ms >= s[0] && ms <= s[1];
          }).render();
        })
        .select(timelineGroup.node())
        .selection(selection)
        .ticks(ticks)
        .width(this._width)
        .config(this._timeline.constructor === Object ? this._timeline : {})
        .render();

      this._margin.bottom += timeline.outerBounds().height + timeline.padding() * 2;

    }

    // Renders the legend if this._legend is not falsy.
    const legendGroup = this._uiGroup("legend", this._legend);
    if (this._legend) {

      const legend = colorNest(this._filteredData, this._shapeConfig.fill, this._groupBy);

      this._legendClass
        .id((d, i) => legend.id(d, i))
        .duration(this._duration)
        .data(legend.data)
        .height(this._height / 2 - this._margin.bottom)
        .label(this._drawLabel)
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

      this._margin.bottom += this._legendClass.outerBounds().height + this._legendClass.padding() * 2;

    }

    const titleGroup = elem("g.d3plus-plot-titles", {parent: this._select});

    this._backClass
      .data(this._history.length ? [{text: "Back", x: this._padding * 2, y: 0}] : [])
      .select(titleGroup.node())
      .render();

    this._margin.top += this._history.length ? this._backClass.fontSize()() + this._padding : 0;

    this._tooltipClass.title(this._drawLabel);
    if (this._tooltip.constructor === Object) this._tooltipClass.config(this._tooltip);

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
    return this._groupBy = _.map(k => typeof k === "function" ? k : accessor(k)), this;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the overallheight to the specified number and returns the current class instance. If *value* is not specified, returns the current overall height.
      @param {Number} [*value* = window.innerHeight]
  */
  height(_) {
    return arguments.length ? (this._height = _, this) : this._height;
  }

  /**
      @memberof Viz
      @desc Highlights elements elements based on supplied data.
      @param {Array|Object} [*data*]
  */
  highlight(_) {
    const ids = _ ? Array.from(new Set(this._data.filter(_).map(this._id))).map(strip) : [];
    this._select.selectAll(".d3plus-Shape")
      .style(`${prefix()}transition`, `opacity ${this._tooltipClass.duration() / 1000}s`)
      .style("opacity", function() {
        const id = this.className.baseVal.split(" ").filter(c => c.indexOf("d3plus-id-") === 0)[0].slice(10);
        return ids.length === 0 || ids.includes(id) ? 1 : 0.25;
      });
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
      @desc Adds or removes a *listener* to each shape for the specified event *typenames*. If a *listener* is not specified, returns the currently-assigned listener for the specified event *typename*. Mirrors the core [d3-selection](https://github.com/d3/d3-selection#selection_on) behavior.
      @param {String} [*typenames*]
      @param {Function} [*listener*]
      @example <caption>By default, listeners apply to both the shapes and the legend. Passing a namespace with the typename gives control over specific elements:</caption>
new Plot
  .on("click.shape", function(d) {
    console.log("data for shape clicked:", d);
  })
  .on("click.legend", function(d) {
    console.log("data for legend clicked:", d);
  })
  */
  on(typenames, listener) {
    return arguments.length === 2 ? (this._on[typenames] = listener, this) : arguments.length ? this._on[typenames] : this._on;
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
    return arguments.length ? (this._shapeConfig = Object.assign(this._shapeConfig, _), this) : this._shapeConfig;
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
        this._timeKey = undefined;
      }
      else {
        this._time = accessor(_);
        this._timeKey = _;
      }
      return this;
    }
    else return this._timeKey || this._time;
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
      @desc If *value* is specified, toggles the timeline based on the specified boolean and returns the current class instance. If *value* is an object, then it is passed to the timeline's config method. If *value* is not specified, returns the current value.
      @param {Boolean|Object} [*value* = true]
  */
  timeline(_) {
    return arguments.length ? (this._timeline = _, this) : this._timeline;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance. If *value* is an object, then it is passed to the tooltip's config method. If *value* is not specified, returns the current tooltip visibility.
      @param {Boolean|Object} [*value* = true]
  */
  tooltip(_) {
    return arguments.length ? (this._tooltip = _, this) : this._tooltip;
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
