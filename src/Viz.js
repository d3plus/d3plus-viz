/**
    @external BaseClass
    @see https://github.com/d3plus/d3plus-common#BaseClass
*/

import {max, merge as arrayMerge} from "d3-array";
import {color} from "d3-color";
import {nest} from "d3-collection";
import {queue} from "d3-queue";
import {select} from "d3-selection";
import {transition} from "d3-transition";

import {date} from "d3plus-axis";
import {colorAssign} from "d3plus-color";
import {accessor, assign, BaseClass, constant, merge} from "d3plus-common";
import {Select} from "d3plus-form";
import {ColorScale, Legend} from "d3plus-legend";
import {TextBox} from "d3plus-text";
import {Timeline} from "d3plus-timeline";
import {Tooltip} from "d3plus-tooltip";

import {default as drawBack} from "./_drawBack";
import {default as drawColorScale} from "./_drawColorScale";
import {default as drawControls} from "./_drawControls";
import {default as drawLegend} from "./_drawLegend";
import {default as drawTimeline} from "./_drawTimeline";
import {default as drawTitle} from "./_drawTitle";
import {default as drawTotal} from "./_drawTotal";
import {default as getSize} from "./_getSize";
import {default as inViewport} from "./_inViewport";
import {default as load} from "./data/load";

import {default as click} from "./on/click";
import {default as clickLegend} from "./on/click.legend";
import {default as clickShape} from "./on/click.shape";
import {default as mouseenter} from "./on/mouseenter";
import {default as mouseleave} from "./on/mouseleave";
import {default as mousemoveLegend} from "./on/mousemove.legend";
import {default as mousemoveShape} from "./on/mousemove.shape";

/**
    @class Viz
    @extends external:BaseClass
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
    this._backConfig = {
      fontSize: 10,
      resize: false
    };
    this._color = (d, i) => this._groupBy[0](d, i);
    this._colorScaleClass = new ColorScale();
    this._colorScaleConfig = {};
    this._colorScalePosition = "bottom";
    const controlTest = new Select();
    this._controlCache = {};
    this._controlConfig = {
      selectStyle: Object.assign({margin: "5px"}, controlTest.selectStyle())
    };
    this._data = [];
    this._detectResize = true;
    this._detectVisible = true;
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
    this._legendPosition = "bottom";
    this._locale = "en-US";
    this._on = {
      "click": click.bind(this),
      "click.legend": clickLegend.bind(this),
      "click.shape": clickShape.bind(this),
      "mouseenter": mouseenter.bind(this),
      "mousemove.legend": mousemoveLegend.bind(this),
      "mousemove.shape": mousemoveShape.bind(this),
      "mouseleave": mouseleave.bind(this)
    };
    this._padding = 5;
    this._queue = [];

    this._shapeConfig = {
      fill: (d, i) => {
        if (this._colorScale) {
          const c = this._colorScale(d, i);
          if (c !== undefined && c !== null) return this._colorScaleClass._colorScale(c);
        }
        const c = this._color(d, i);
        if (color(c)) return c;
        return colorAssign(c);
      },
      opacity: constant(1),
      stroke: (d, i) => color(this._shapeConfig.fill(d, i)).darker(),
      strokeWidth: constant(0)
    };

    this._timeline = true;
    this._timelineClass = new Timeline()
      .align("end")
      .on("brush", s => {
        if (JSON.stringify(s) !== JSON.stringify(this._timelineSelection)) {
          this._timelineSelection = s;
          if (!(s instanceof Array)) s = [s, s];
          s = s.map(Number);
          this.timeFilter(d => {
            const ms = date(this._time(d)).getTime();
            return ms >= s[0] && ms <= s[1];
          }).render();
        }
      });
    this._timelineConfig = {};

    this._titleClass = new TextBox();
    this._titleConfig = {
      fontSize: 12,
      resize: false,
      textAnchor: "middle"
    };

    this._tooltip = true;
    this._tooltipClass = new Tooltip();
    this._tooltipConfig = {
      duration: 50,
      pointerEvents: "none"
    };

    this._totalClass = new TextBox();
    this._totalConfig = {
      fontSize: 10,
      resize: false,
      textAnchor: "middle"
    };

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
      @desc Called by render once all checks are passed.
      @private
  */
  _draw() {

    const that = this;

    // based on the groupBy, determine the draw depth and current depth id
    this._drawDepth = this._depth !== void 0 ? this._depth : this._groupBy.length - 1;
    this._id = this._groupBy[this._drawDepth];
    this._ids = (d, i) => this._groupBy
      .map(g => g(d.__d3plus__ ? d.data : d, d.__d3plus__ ? d.i : i))
      .filter(g => g !== void 0 && g !== null && g.constructor !== Array);
    this._drawLabel = this._label || function(d, i) {
      const l = that._ids(d, i).slice(0, that._drawDepth + 1).filter(d => d && d.constructor !== Array);
      return l[l.length - 1];
    };

    // set the default timeFilter if it has not been specified
    if (this._time && this._timeFilter === void 0) {

      const dates = this._data.map(this._time).map(date);
      const d = this._data[0], i = 0;

      if (this._discrete && `_${this._discrete}` in this && this[`_${this._discrete}`](d, i) === this._time(d, i)) {
        this._timeFilter = () => true;
      }
      else {
        const latestTime = +max(dates);
        this._timeFilter = (d, i) => +date(this._time(d, i)) === latestTime;
      }

    }

    this._filteredData = [];
    let flatData = [];
    if (this._data.length) {

      flatData = this._timeFilter ? this._data.filter(this._timeFilter) : this._data;
      if (this._filter) flatData = flatData.filter(this._filter);

      const dataNest = nest();
      for (let i = 0; i <= this._drawDepth; i++) dataNest.key(this._groupBy[i]);
      if (this._discrete && `_${this._discrete}` in this) dataNest.key(this[`_${this._discrete}`]);
      dataNest.rollup(leaves => this._filteredData.push(merge(leaves, this._aggs))).entries(flatData);

    }

    drawTitle.bind(this)(flatData);
    drawControls.bind(this)(flatData);
    drawTimeline.bind(this)(flatData);
    drawLegend.bind(this)(flatData);
    drawColorScale.bind(this)(flatData);
    drawBack.bind(this)();
    drawTotal.bind(this)(flatData);

    this._shapes = [];

    // Draws a rectangle showing the available space for a visualization.
    // const tester = this._select.selectAll(".tester").data([0]);
    // console.log(this._margin);
    // tester.enter().append("rect")
    //     .attr("class", "tester")
    //     .attr("fill", "#ccc")
    //   .merge(tester)
    //     .attr("width", this._width - this._margin.left - this._margin.right)
    //     .attr("height", this._height - this._margin.top - this._margin.bottom)
    //     .attr("x", this._margin.left)
    //     .attr("y", this._margin.top);

  }

  /**
      @memberof Viz
      @desc Draws the visualization given the specified configuration.
      @param {Function} [*callback*] An optional callback function that, if passed, will be called after animation is complete.
      @chainable
  */
  render(callback) {

    // Resets margins
    this._margin = {bottom: 0, left: 0, right: 0, top: 0};
    this._transition = transition().duration(this._duration);

    // Appends a fullscreen SVG to the BODY if a container has not been provided through .select().
    if (this._select === void 0 || this._select.node().tagName.toLowerCase() !== "svg") {

      const parent = this._select === void 0 ? select("body") : this._select;
      let [w, h] = getSize(parent.node());
      const svg = parent.append("svg");
      w -= parseFloat(svg.style("border-left-width"), 10);
      w -= parseFloat(svg.style("border-right-width"), 10);
      h -= parseFloat(svg.style("border-top-width"), 10);
      h -= parseFloat(svg.style("border-bottom-width"), 10);
      if (!this._width) {
        this._autoWidth = true;
        this.width(w);
      }
      if (!this._height) {
        this._autoHeight = true;
        this.height(h);
      }

      svg
        .style("width", `${this._width}px`)
        .style("height", `${this._height}px`);

      this.select(svg.node());

    }

    // Calculates the width and/or height of the Viz based on the this._select, if either has not been defined.
    if (!this._width || !this._height) {
      const [w, h] = getSize(this._select.node());
      if (!this._width) this.width(w);
      if (!this._height) this.height(h);
    }

    this._select.transition(this._transition)
      .style("width", `${this._width}px`)
      .style("height", `${this._height}px`);

    clearInterval(this._visiblePoll);
    clearTimeout(this._resizePoll);
    select(window).on(`scroll.${this._uuid}`, null);
    select(window).on(`resize.${this._uuid}`, null);
    if (this._detectVisible && this._select.style("visibility") === "hidden") {

      this._visiblePoll = setInterval(() => {
        if (this._select.style("visibility") !== "hidden") {
          clearInterval(this._visiblePoll);
          this.render(callback);
        }
      }, 1000);

    }
    else if (this._detectVisible && this._select.style("display") === "none") {

      this._visiblePoll = setInterval(() => {
        if (this._select.style("display") !== "none") {
          clearInterval(this._visiblePoll);
          this.render(callback);
        }
      }, 1000);

    }
    else if (this._detectVisible && !inViewport(this._select.node())) {

      select(window).on(`scroll.${this._uuid}`, () => {
        if (inViewport(this._select.node())) {
          select(window).on(`scroll.${this._uuid}`, null);
          this.render(callback);
        }
      });

    }
    else {

      const q = queue();
      this._queue.forEach(p => q.defer(...p));
      this._queue = [];
      q.awaitAll(() => {
        this._draw(callback);

        if (this._detectResize && (this._autoWidth || this._autoHeight)) {
          select(window).on(`resize.${this._uuid}`, () => {
            clearTimeout(this._resizePoll);
            this._resizePoll = setTimeout(() => {
              clearTimeout(this._resizePoll);
              const display = this._select.style("display");
              this._select.style("display", "none");
              let [w, h] = getSize(this._select.node().parentNode);
              w -= parseFloat(this._select.style("border-left-width"), 10);
              w -= parseFloat(this._select.style("border-right-width"), 10);
              h -= parseFloat(this._select.style("border-top-width"), 10);
              h -= parseFloat(this._select.style("border-bottom-width"), 10);
              this._select.style("display", display);
              if (this._autoWidth) this.width(w);
              if (this._autoHeight) this.height(h);
              this.render(callback);
            }, 200);
          });
        }

        if (callback) setTimeout(callback, this._duration + 100);
      });

    }

    return this;

  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the active method to the specified function and returns the current class instance. If *value* is not specified, returns the current active method.
      @param {Function} [*value*]
      @chainable
  */
  active(_) {

    this._active = _;
    this._shapes.forEach(s => s.active(_));
    if (this._legend) this._legendClass.active(_);

    return this;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the aggregation method for each key in the object and returns the current class instance. If *value* is not specified, returns the current defined aggregation methods.
      @param {Object} [*value*]
      @chainable
  */
  aggs(_) {
    return arguments.length ? (this._aggs = assign(this._aggs, _), this) : this._aggs;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the back button and returns the current class instance. If *value* is not specified, returns the current back button configuration.
      @param {Object} [*value*]
      @chainable
  */
  backConfig(_) {
    return arguments.length ? (this._backConfig = assign(this._backConfig, _), this) : this._backConfig;
  }

  /**
      @memberof Viz
      @desc Defines the main color to be used for each data point in a visualization. Can be either an accessor function or a string key to reference in each data point. If a color value is returned, it will be used as is. If a string is returned, a unique color will be assigned based on the string.
      @param {Function|String} [*value*]
      @chainable
  */
  color(_) {
    return arguments.length ? (this._color = typeof _ === "function" ? _ : accessor(_), this) : this._color;
  }

  /**
      @memberof Viz
      @desc Defines the value to be used for a color scale. Can be either an accessor function or a string key to reference in each data point.
      @param {Function|String} [*value*]
      @chainable
  */
  colorScale(_) {
    return arguments.length ? (this._colorScale = typeof _ === "function" ? _ : accessor(_), this) : this._colorScale;
  }

  /**
      @memberof Viz
      @desc A pass-through to the config method of ColorScale.
      @param {Object} [*value*]
      @chainable
  */
  colorScaleConfig(_) {
    return arguments.length ? (this._colorScaleConfig = assign(this._colorScaleConfig, _), this) : this._colorScaleConfig;
  }

  /**
      @memberof Viz
      @desc Defines which side of the visualization to anchor the color scale. Acceptable values are `"top"`, `"bottom"`, `"left"`, and `"right"`. If no value is passed, the current legend position will be returned.
      @param {String} [*value* = "bottom"]
      @chainable
  */
  colorScalePosition(_) {
    return arguments.length ? (this._colorScalePosition = _, this) : this._colorScalePosition;
  }

  /**
      @memberof Viz
      @desc Defines a list of controls to be rendered at the bottom of the visualization.
      @param {Array} [*value*]
      @chainable
  */
  controls(_) {
    return arguments.length ? (this._controls = _, this) : this._controls;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the controls and returns the current class instance. If *value* is not specified, returns the current control configuration.
      @param {Object} [*value*]
      @chainable
  */
  controlConfig(_) {
    return arguments.length ? (this._controlConfig = assign(this._controlConfig, _), this) : this._controlConfig;
  }

  /**
      @memberof Viz
      @desc Sets the primary data array to be used when drawing the visualization. The value passed should be an *Array* of objects or a *String* representing a filepath or URL to be loaded. The following filetypes are supported: `csv`, `tsv`, `txt`, and `json`.

Additionally, a custom formatting function can be passed as a second argument to this method. This custom function will be passed the data that has been loaded, as long as there are no errors. This function should return the final array of obejcts to be used as the primary data array. For example, some JSON APIs return the headers split from the data values to save bandwidth. These would need be joined using a custom formatter.

If *data* is not specified, this method returns the current primary data array, which defaults to an empty array (`[]`);
      @param {Array|String} *data* = []
      @param {Function} [*formatter*]
      @chainable
  */
  data(_, f) {
    return arguments.length ? (this._queue.push([load.bind(this), _, f, "data"]), this) : this._data;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the depth to the specified number and returns the current class instance. The *value* should correspond with an index in the [groupBy](#groupBy) array. If *value* is not specified, returns the current depth.
      @param {Number} [*value*]
      @chainable
  */
  depth(_) {
    return arguments.length ? (this._depth = _, this) : this._depth;
  }

  /**
      @memberof Viz
      @desc If the width and/or height of a Viz is not user-defined, it is determined by the size of it's parent element. When this method is set to `true`, the Viz will listen for the `window.onresize` event and adjust it's dimensions accordingly.

If no value is specified, the method will return the current *Boolean* value.
      @param {Boolean} *value* = true
      @chainable
  */
  detectResize(_) {
    return arguments.length ? (this._detectResize = _, this) : this._detectResize;
  }

  /**
      @memberof Viz
      @desc Toggles whether or not the Viz should try to detect if it visible in the current viewport. When this method is set to `true`, the Viz will only be rendered when it has entered the viewport either through scrolling or if it's display or visibility is changed.

If no value is specified, the method will return the current *Boolean* value.
      @param {Boolean} *value* = true
      @chainable
  */
  detectVisible(_) {
    return arguments.length ? (this._detectVisible = _, this) : this._detectVisible;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the discrete accessor to the specified method name (usually an axis) and returns the current class instance. If *value* is not specified, returns the current discrete method.
      @param {String} [*value*]
      @chainable
  */
  discrete(_) {
    return arguments.length ? (this._discrete = _, this) : this._discrete;
  }

  /**
      @memberof Viz
      @desc If *ms* is specified, sets the animation duration to the specified number and returns the current class instance. If *ms* is not specified, returns the current animation duration.
      @param {Number} [*ms* = 600]
      @chainable
  */
  duration(_) {
    return arguments.length ? (this._duration = _, this) : this._duration;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the filter to the specified function and returns the current class instance. If *value* is not specified, returns the current filter.
      @param {Function} [*value*]
      @chainable
  */
  filter(_) {
    return arguments.length ? (this._filter = _, this) : this._filter;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the group accessor(s) to the specified string, function, or array of values and returns the current class instance. If *value* is not specified, returns the current group accessor.
      @param {String|Function|Array} [*value*]
      @chainable
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
      @chainable
  */
  height(_) {
    return arguments.length ? (this._height = _, this) : this._height;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the hover method to the specified function and returns the current class instance. If *value* is not specified, returns the current hover method.
      @param {Function} [*value*]
      @chainable
  */
  hover(_) {

    let hoverFunction = this._hover = _;
    if (typeof _ === "function") {

      let shapeData = arrayMerge(this._shapes.map(s => s.data()));
      shapeData = shapeData.concat(this._legendClass.data());
      const activeData = _ ? shapeData.filter(_) : [];

      let activeIds = [];
      activeData.map(this._ids).forEach(ids => {
        for (let x = 1; x <= ids.length; x++) {
          activeIds.push(JSON.stringify(ids.slice(0, x)));
        }
      });
      activeIds = activeIds.filter((id, i) => activeIds.indexOf(id) === i);

      if (activeIds.length) hoverFunction = (d, i) => activeIds.includes(JSON.stringify(this._ids(d, i)));

    }

    this._shapes.forEach(s => s.hover(hoverFunction));
    if (this._legend) this._legendClass.hover(hoverFunction);

    return this;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the label accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current text accessor, which is `undefined` by default.
      @param {Function|String} [*value*]
      @chainable
  */
  label(_) {
    return arguments.length ? (this._label = typeof _ === "function" ? _ : constant(_), this) : this._label;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the legend based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current value.
      @param {Boolean} [*value* = true]
      @chainable
  */
  legend(_) {
    return arguments.length ? (this._legend = _, this) : this._legend;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, the object is passed to the legend's config method. If *value* is not specified, returns the current legend config.
      @param {Object} [*value*]
      @chainable
  */
  legendConfig(_) {
    return arguments.length ? (this._legendConfig = _, this) : this._legendConfig;
  }

  /**
      @memberof Viz
      @desc Defines which side of the visualization to anchor the legend. Acceptable values are `"top"`, `"bottom"`, `"left"`, and `"right"`. If no value is passed, the current legend position will be returned.
      @param {String} [*value* = "bottom"]
      @chainable
  */
  legendPosition(_) {
    return arguments.length ? (this._legendPosition = _, this) : this._legendPosition;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the locale to the specified string and returns the current class instance. If *value* is not specified, returns the current locale.
      @param {String} [*value* = "en-US"]
      @chainable
  */
  locale(_) {
    return arguments.length ? (this._locale = _, this) : this._locale;
  }

  /**
      @memberof Viz
      @desc If *selector* is specified, sets the SVG container element to the specified d3 selector or DOM element and returns the current class instance. If *selector* is not specified, returns the current SVG container element, which is `undefined` by default.
      @param {String|HTMLElement} [*selector*]
      @chainable
  */
  select(_) {
    return arguments.length ? (this._select = select(_), this) : this._select;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the shape accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current shape accessor.
      @param {Function|String} [*value*]
      @chainable
  */
  shape(_) {
    return arguments.length ? (this._shape = typeof _ === "function" ? _ : constant(_), this) : this._shape;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for each shape and returns the current class instance. If *value* is not specified, returns the current shape configuration.
      @param {Object} [*value*]
      @chainable
  */
  shapeConfig(_) {
    return arguments.length ? (this._shapeConfig = assign(this._shapeConfig, _), this) : this._shapeConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the time accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current time accessor. The time values that are returned should be valid Date objects, 4-digit year values, or strings that can be parsed into javascript Date objects (click [here](http://dygraphs.com/date-formats.html) for valid string formats).
      @param {Function|String} [*value*]
      @chainable
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
      @chainable
  */
  timeFilter(_) {
    return arguments.length ? (this._timeFilter = _, this) : this._timeFilter;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the timeline based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current timeline visibility.
      @param {Boolean} [*value* = true]
      @chainable
  */
  timeline(_) {
    return arguments.length ? (this._timeline = _, this) : this._timeline;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the timeline and returns the current class instance. If *value* is not specified, returns the current timeline configuration.
      @param {Object} [*value*]
      @chainable
  */
  timelineConfig(_) {
    return arguments.length ? (this._timelineConfig = assign(this._timelineConfig, _), this) : this._timelineConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the title accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current title accessor.
      @param {Function|String} [*value*]
      @chainable
  */
  title(_) {
    return arguments.length ? (this._title = typeof _ === "function" ? _ : constant(_), this) : this._title;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the title and returns the current class instance. If *value* is not specified, returns the current title configuration.
      @param {Object} [*value*]
      @chainable
  */
  titleConfig(_) {
    return arguments.length ? (this._titleConfig = assign(this._titleConfig, _), this) : this._titleConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance. If *value* is not specified, returns the current tooltip visibility.
      @param {Boolean} [*value* = true]
      @chainable
  */
  tooltip(_) {
    return arguments.length ? (this._tooltip = _, this) : this._tooltip;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the tooltip and returns the current class instance. If *value* is not specified, returns the current tooltip configuration.
      @param {Object} [*value*]
      @chainable
  */
  tooltipConfig(_) {
    return arguments.length ? (this._tooltipConfig = assign(this._tooltipConfig, _), this) : this._tooltipConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the total accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current total accessor.
      @param {Boolean|Function|String} [*value*]
      @chainable
  */
  total(_) {
    return arguments.length ? (this._total = typeof _ === "function" ? _ : accessor(_), this) : this._total;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the total and returns the current class instance. If *value* is not specified, returns the current total configuration.
      @param {Object} [*value*]
      @chainable
  */
  totalConfig(_) {
    return arguments.length ? (this._totalConfig = assign(this._totalConfig, _), this) : this._totalConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the overallwidth to the specified number and returns the current class instance. If *value* is not specified, returns the current overall width.
      @param {Number} [*value* = window.innerWidth]
      @chainable
  */
  width(_) {
    return arguments.length ? (this._width = _, this) : this._width;
  }

}
