/**
    @external BaseClass
    @see https://github.com/d3plus/d3plus-common#BaseClass
*/

import {max, merge as arrayMerge} from "d3-array";
import {brush} from "d3-brush";
import {color} from "d3-color";
import {nest} from "d3-collection";
import {queue} from "d3-queue";
import {select} from "d3-selection";
import {transition} from "d3-transition";
import {zoom} from "d3-zoom";

import lrucache from "lrucache";

import {date} from "d3plus-axis";
import {colorAssign, colorContrast} from "d3plus-color";
import {accessor, assign, BaseClass, constant, merge} from "d3plus-common";
import {Select} from "d3plus-form";
import {ColorScale, Legend} from "d3plus-legend";
import {TextBox} from "d3plus-text";
import {Timeline} from "d3plus-timeline";
import {Tooltip} from "d3plus-tooltip";

import Message from "./Message";

import drawBack from "./_drawBack";
import drawColorScale from "./_drawColorScale";
import drawControls from "./_drawControls";
import {default as drawLegend, legendLabel} from "./_drawLegend";
import drawTimeline from "./_drawTimeline";
import drawTitle from "./_drawTitle";
import drawTotal from "./_drawTotal";
import getSize from "./_getSize";
import inViewport from "./_inViewport";
import load from "./data/load";

import click from "./on/click";
import mouseenter from "./on/mouseenter";
import mouseleave from "./on/mouseleave";
import mousemoveLegend from "./on/mousemove.legend";
import mousemoveShape from "./on/mousemove.shape";

import zoomControls from "./_zoomControls";

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
    this._cache = true;
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
    this._detectResizeDelay = 400;
    this._detectVisible = true;
    this._detectVisibleInterval = 1000;
    this._downloadButton = false;
    this._downloadConfig = {type: "png"};
    this._downloadPosition = "top";
    this._duration = 600;
    this._history = [];
    this._groupBy = [accessor("id")];
    this._legend = true;
    this._legendConfig = {
      label: legendLabel.bind(this),
      shapeConfig: {
        labelConfig: {
          fontColor: undefined,
          fontResize: false
        }
      }
    };
    this._legendTooltip = {};
    this._legendClass = new Legend();
    this._legendPosition = "bottom";

    this._loadingHTML = constant(`
    <div style="font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <strong>Loading Visualization</strong>
      <sub style="display: block; margin-top: 5px;"><a href="https://d3plus.org" target="_blank">Powered by D3plus</a></sub>
    </div>`);

    this._loadingMessage = true;
    this._locale = "en-US";
    this._lrucache = lrucache(10);
    this._messageClass = new Message();
    this._messageMask = "rgba(0, 0, 0, 0.1)";
    this._messageStyle = {
      "left": "0px",
      "position": "absolute",
      "text-align": "center",
      "top": "45%",
      "width": "100%"
    };

    this._noDataHTML = constant(`
    <div style="font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <strong>No Data Available</strong>
    </div>`);

    this._noDataMessage = true;
    this._on = {
      "click": click.bind(this),
      "mouseenter": mouseenter.bind(this),
      "mouseleave": mouseleave.bind(this),
      "mousemove.shape": mousemoveShape.bind(this),
      "mousemove.legend": mousemoveLegend.bind(this)
    };
    this._padding = 5;
    this._queue = [];
    this._shape = constant("Rect");
    this._shapes = [];
    this._shapeConfig = {
      fill: (d, i) => {
        while (d.__d3plus__ && d.data) {
          d = d.data;
          i = d.i;
        }
        if (this._colorScale) {
          const c = this._colorScale(d, i);
          if (c !== undefined && c !== null) {
            const scale = this._colorScaleClass._colorScale;
            if (!scale.domain().length) return scale.range()[scale.range().length - 1];
            return scale(c);
          }
        }
        const c = this._color(d, i);
        if (color(c)) return c;
        return colorAssign(c);
      },
      labelConfig: {
        fontColor: (d, i) => {
          const c = typeof this._shapeConfig.fill === "function" ? this._shapeConfig.fill(d, i) : this._shapeConfig.fill;
          return colorContrast(c);
        }
      },
      opacity: constant(1),
      stroke: (d, i) => {
        const c = typeof this._shapeConfig.fill === "function" ? this._shapeConfig.fill(d, i) : this._shapeConfig.fill;
        return color(c).darker();
      },
      strokeWidth: constant(0)
    };

    this._timeline = true;
    this._timelineClass = new Timeline().align("end");
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
      pointerEvents: "none",
      titleStyle: {
        "max-width": "200px"
      }
    };

    this._totalClass = new TextBox();
    this._totalConfig = {
      fontSize: 10,
      resize: false,
      textAnchor: "middle"
    };

    this._zoom = false;
    this._zoomBehavior = zoom();
    this._zoomBrush = brush();
    this._zoomBrushHandleSize = 1;
    this._zoomBrushHandleStyle = {
      fill: "#444"
    };
    this._zoomBrushSelectionStyle = {
      "fill": "#777",
      "stroke-width": 0
    };
    this._zoomControlStyle = {
      "background": "rgba(255, 255, 255, 0.75)",
      "border": "1px solid rgba(0, 0, 0, 0.75)",
      "color": "rgba(0, 0, 0, 0.75)",
      "display": "block",
      "font": "900 15px/21px 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      "height": "20px",
      "margin": "5px",
      "opacity": 0.75,
      "padding": 0,
      "text-align": "center",
      "width": "20px"
    };
    this._zoomControlStyleActive = {
      background: "rgba(0, 0, 0, 0.75)",
      color: "rgba(255, 255, 255, 0.75)",
      opacity: 1
    };
    this._zoomControlStyleHover = {
      cursor: "pointer",
      opacity: 1
    };
    this._zoomFactor = 2;
    this._zoomMax = 16;
    this._zoomPadding = 20;
    this._zoomPan = true;
    this._zoomScroll = true;

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
      .map(g => !d || d.__d3plus__ && !d.data ? undefined : g(d.__d3plus__ ? d.data : d, d.__d3plus__ ? d.i : i))
      .filter(g => g !== undefined && g !== null && g.constructor !== Array);

    this._drawLabel = (d, i) => {
      if (!d) return "";
      while (d.__d3plus__ && d.data) {
        d = d.data;
        i = d.i;
      }
      if (this._label) return this._label(d, i);
      const l = that._ids(d, i).slice(0, this._drawDepth + 1);
      return l[l.length - 1];
    };

    // set the default timeFilter if it has not been specified
    if (this._time && this._timeFilter === void 0 && this._data.length) {

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
      if (this._discrete && `_${this._discrete}2` in this) dataNest.key(this[`_${this._discrete}2`]);
      dataNest.rollup(leaves => this._filteredData.push(merge(leaves, this._aggs))).entries(flatData);

    }
    if (this._noDataMessage && !this._filteredData.length) {
      this._messageClass.render({
        container: this._select.node().parentNode,
        html: this._noDataHTML(this),
        mask: this._messageMask,
        style: this._messageStyle
      });
    }

    drawTitle.bind(this)(this._filteredData);
    drawControls.bind(this)(this._filteredData);
    drawTimeline.bind(this)(this._filteredData);
    drawLegend.bind(this)(this._filteredData);
    drawColorScale.bind(this)(this._filteredData);
    drawBack.bind(this)();
    drawTotal.bind(this)(this._filteredData);

    this._shapes = [];

    // Draws a container and zoomGroup to test functionality.
    // this._container = this._select.selectAll("svg.d3plus-viz").data([0]);
    //
    // this._container = this._container.enter().append("svg")
    //     .attr("class", "d3plus-viz")
    //     .attr("width", this._width - this._margin.left - this._margin.right)
    //     .attr("height", this._height - this._margin.top - this._margin.bottom)
    //     .attr("x", this._margin.left)
    //     .attr("y", this._margin.top)
    //     .style("background-color", "transparent")
    //   .merge(this._container);
    //
    // this._zoomGroup = this._container.selectAll("g.d3plus-viz-zoomGroup").data([0]);
    // const enter = this._zoomGroup.enter().append("g").attr("class", "d3plus-viz-zoomGroup")
    //   .merge(this._zoomGroup);
    //
    // this._zoomGroup = enter.merge(this._zoomGroup);
    //
    // this._shapes.push(new Rect()
    //   .config(this._shapeConfig)
    //   .data(this._filteredData)
    //   .label("Test Label")
    //   .select(this._zoomGroup.node())
    //   .on(this._on)
    //   .id(d => d.group)
    //   .x(d => d.value * 10 + 200)
    //   .y(d => d.value * 10 + 200)
    //   .width(100)
    //   .height(100)
    //   .render());

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
      }, this._detectVisibleInterval);

    }
    else if (this._detectVisible && this._select.style("display") === "none") {

      this._visiblePoll = setInterval(() => {
        if (this._select.style("display") !== "none") {
          clearInterval(this._visiblePoll);
          this.render(callback);
        }
      }, this._detectVisibleInterval);

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

      if (this._loadingMessage) {
        this._messageClass.render({
          container: this._select.node().parentNode,
          html: this._loadingHTML(this),
          mask: this._messageMask,
          style: this._messageStyle
        });
      }

      this._queue.forEach(p => {
        const cache = this._cache ? this._lrucache.get(p[1]) : undefined;
        if (!cache) q.defer(...p);
        else this[`_${p[3]}`] = cache;
      });
      this._queue = [];
      q.awaitAll(() => {

        this._draw(callback);
        zoomControls.bind(this)();

        if (this._messageClass._isVisible && (!this._noDataMessage || this._filteredData.length)) this._messageClass.hide();

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
            }, this._detectResizeDelay);
          });
        }

        if (callback) setTimeout(callback, this._duration + 100);
      });

    }

    return this;

  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the active method to the specified function and returns the current class instance.
      @param {Function} [*value*]
      @chainable
  */
  active(_) {

    this._active = _;

    if (this._shapeConfig.activeOpacity !== 1) {
      this._shapes.forEach(s => s.active(_));
      if (this._legend) this._legendClass.active(_);
    }

    return this;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the aggregation method for each key in the object and returns the current class instance.
      @param {Object} [*value*]
      @chainable
  */
  aggs(_) {
    return arguments.length ? (this._aggs = assign(this._aggs, _), this) : this._aggs;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the back button and returns the current class instance.
      @param {Object} [*value*]
      @chainable
  */
  backConfig(_) {
    return arguments.length ? (this._backConfig = assign(this._backConfig, _), this) : this._backConfig;
  }

  /**
      @memberof Viz
      @desc Enables a lru cache that stores up to 5 previously loaded files/URLs. Helpful when constantly writing over the data array with a URL in the render function of a react component.
      @param {Boolean} [*value* = false]
      @chainable
  */
  cache(_) {
    return arguments.length ? (this._cache = _, this) : this._cache;
  }

  /**
      @memberof Viz
      @desc Defines the main color to be used for each data point in a visualization. Can be either an accessor function or a string key to reference in each data point. If a color value is returned, it will be used as is. If a string is returned, a unique color will be assigned based on the string.
      @param {Function|String|False} [*value*]
      @chainable
  */
  color(_) {
    return arguments.length ? (this._color = !_ || typeof _ === "function" ? _ : accessor(_), this) : this._color;
  }

  /**
      @memberof Viz
      @desc Defines the value to be used for a color scale. Can be either an accessor function or a string key to reference in each data point.
      @param {Function|String|False} [*value*]
      @chainable
  */
  colorScale(_) {
    return arguments.length ? (this._colorScale = !_ || typeof _ === "function" ? _ : accessor(_), this) : this._colorScale;
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
      @desc Defines which side of the visualization to anchor the color scale. Acceptable values are `"top"`, `"bottom"`, `"left"`, `"right"`, and `false`. A `false` value will cause the color scale to not be displayed, but will still color shapes based on the scale.
      @param {String|Boolean} [*value* = "bottom"]
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
      @desc If *value* is specified, sets the config method for the controls and returns the current class instance.
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
      @desc If *value* is specified, sets the depth to the specified number and returns the current class instance. The *value* should correspond with an index in the [groupBy](#groupBy) array.
      @param {Number} [*value*]
      @chainable
  */
  depth(_) {
    return arguments.length ? (this._depth = _, this) : this._depth;
  }

  /**
      @memberof Viz
      @desc If the width and/or height of a Viz is not user-defined, it is determined by the size of it's parent element. When this method is set to `true`, the Viz will listen for the `window.onresize` event and adjust it's dimensions accordingly.
      @param {Boolean} *value* = true
      @chainable
  */
  detectResize(_) {
    return arguments.length ? (this._detectResize = _, this) : this._detectResize;
  }

  /**
      @memberof Viz
      @desc When resizing the browser window, this is the millisecond delay to trigger the resize event.
      @param {Number} *value* = 400
      @chainable
  */
  detectResizeDelay(_) {
    return arguments.length ? (this._detectResizeDelay = _, this) : this._detectResizeDelay;
  }

  /**
      @memberof Viz
      @desc Toggles whether or not the Viz should try to detect if it visible in the current viewport. When this method is set to `true`, the Viz will only be rendered when it has entered the viewport either through scrolling or if it's display or visibility is changed.
      @param {Boolean} *value* = true
      @chainable
  */
  detectVisible(_) {
    return arguments.length ? (this._detectVisible = _, this) : this._detectVisible;
  }

  /**
      @memberof Viz
      @desc The interval, in milliseconds, for checking if the visualization is visible on the page.
      @param {Number} *value* = 1000
      @chainable
  */
  detectVisibleInterval(_) {
    return arguments.length ? (this._detectVisibleInterval = _, this) : this._detectVisibleInterval;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the discrete accessor to the specified method name (usually an axis) and returns the current class instance.
      @param {String} [*value*]
      @chainable
  */
  discrete(_) {
    return arguments.length ? (this._discrete = _, this) : this._discrete;
  }

  /**
      @memberof Viz
      @desc Shows a button that allows for downloading the current visualization.
      @param {Boolean} [*value* = false]
      @chainable
  */
  downloadButton(_) {
    return arguments.length ? (this._downloadButton = _, this) : this._downloadButton;
  }

  /**
      @memberof Viz
      @desc Sets specific options of the saveElement function used when downloading the visualization.
      @param {Object} [*value* = {type: "png"}]
      @chainable
  */
  downloadConfig(_) {
    return arguments.length ? (this._downloadConfig = assign(this._downloadConfig, _), this) : this._downloadConfig;
  }

  /**
      @memberof Viz
      @desc Defines which control group to add the download button into.
      @param {String} [*value* = "top"]
      @chainable
  */
  downloadPosition(_) {
    return arguments.length ? (this._downloadPosition = _, this) : this._downloadPosition;
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
      @desc If *value* is specified, sets the filter to the specified function and returns the current class instance.
      @param {Function} [*value*]
      @chainable
  */
  filter(_) {
    return arguments.length ? (this._filter = _, this) : this._filter;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the group accessor(s) to the specified string, function, or array of values and returns the current class instance.
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
      @desc If *value* is specified, sets the overall height to the specified number and returns the current class instance.
      @param {Number} [*value* = window.innerHeight]
      @chainable
  */
  height(_) {
    return arguments.length ? (this._height = _, this) : this._height;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the hover method to the specified function and returns the current class instance.
      @param {Function} [*value*]
      @chainable
  */
  hover(_) {

    let hoverFunction = this._hover = _;

    if (this._shapeConfig.hoverOpacity !== 1) {

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

    }

    return this;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the label accessor to the specified function or string and returns the current class instance.
      @param {Function|String} [*value*]
      @chainable
  */
  label(_) {
    return arguments.length ? (this._label = typeof _ === "function" ? _ : constant(_), this) : this._label;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the legend based on the specified boolean and returns the current class instance.
      @param {Boolean} [*value* = true]
      @chainable
  */
  legend(_) {
    return arguments.length ? (this._legend = _, this) : this._legend;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, the object is passed to the legend's config method.
      @param {Object} [*value*]
      @chainable
  */
  legendConfig(_) {
    return arguments.length ? (this._legendConfig = assign(this._legendConfig, _), this) : this._legendConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the legend tooltip and returns the current class instance.
      @param {Object} [*value* = {}]
      @chainable
  */
  legendTooltip(_) {
    return arguments.length ? (this._legendTooltip = assign(this._legendTooltip, _), this) : this._legendTooltip;
  }

  /**
      @memberof Viz
      @desc Defines which side of the visualization to anchor the legend. Expected values are `"top"`, `"bottom"`, `"left"`, and `"right"`.
      @param {String} [*value* = "bottom"]
      @chainable
  */
  legendPosition(_) {
    return arguments.length ? (this._legendPosition = _, this) : this._legendPosition;
  }

  /**
      @memberof Viz
      @desc Sets the inner HTML of the status message that is displayed when loading AJAX requests and displaying errors. Must be a valid HTML string or a function that, when passed this Viz instance, returns a valid HTML string.
      @param {Function|String} [*value*]
      @chainable
  */
  loadingHTML(_) {
    return arguments.length ? (this._loadingHTML = typeof _ === "function" ? _ : constant(_), this) : this._loadingHTML;
  }

  /**
      @memberof Viz
      @desc Toggles the visibility of the status message that is displayed when loading AJAX requests and displaying errors.
      @param {Boolean} [*value* = true]
      @chainable
  */
  loadingMessage(_) {
    return arguments.length ? (this._loadingMessage = _, this) : this._loadingMessage;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the locale to the specified string and returns the current class instance.
      @param {String} [*value* = "en-US"]
      @chainable
  */
  locale(_) {
    return arguments.length ? (this._locale = _, this) : this._locale;
  }

  /**
      @memberof Viz
      @desc Sets the color of the mask used underneath the status message that is displayed when loading AJAX requests and displaying errors. Additionally, `false` will turn off the mask completely.
      @param {Boolean|String} [*value* = "rgba(0, 0, 0, 0.1)"]
      @chainable
  */
  messageMask(_) {
    return arguments.length ? (this._messageMask = _, this) : this._messageMask;
  }

  /**
      @memberof Viz
      @desc Defines the CSS style properties for the status message that is displayed when loading AJAX requests and displaying errors.
      @param {Object} [*value*]
      @chainable
  */
  messageStyle(_) {
    return arguments.length ? (this._messageStyle = assign(this._messageStyle, _), this) : this._messageStyle;
  }

  /**
      @memberof Viz
      @desc Sets the inner HTML of the status message that is displayed when no data is supplied to the visualization. Must be a valid HTML string or a function that, when passed this Viz instance, returns a valid HTML string.
      @param {Function|String} [*value*]
      @chainable
  */
  noDataHTML(_) {
    return arguments.length ? (this._noDataHTML = typeof _ === "function" ? _ : constant(_), this) : this._noDataHTML;
  }

  /**
     @memberof Viz
     @desc Toggles the visibility of the status message that is displayed when no data is supplied to the visualization.
     @param {Boolean} [*value* = true]
     @chainable
  */
  noDataMessage(_) {
    return arguments.length ? (this._noDataMessage = _, this) : this._noDataMessage;
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
      @desc If *value* is specified, sets the shape accessor to the specified function or number and returns the current class instance.
      @param {Function|String} [*value*]
      @chainable
  */
  shape(_) {
    return arguments.length ? (this._shape = typeof _ === "function" ? _ : constant(_), this) : this._shape;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for each shape and returns the current class instance.
      @param {Object} [*value*]
      @chainable
  */
  shapeConfig(_) {
    return arguments.length ? (this._shapeConfig = assign(this._shapeConfig, _), this) : this._shapeConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the time accessor to the specified function or string and returns the current class instance.
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
      @desc If *value* is specified, sets the time filter to the specified function and returns the current class instance.
      @param {Function} [*value*]
      @chainable
  */
  timeFilter(_) {
    return arguments.length ? (this._timeFilter = _, this) : this._timeFilter;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the timeline based on the specified boolean and returns the current class instance.
      @param {Boolean} [*value* = true]
      @chainable
  */
  timeline(_) {
    return arguments.length ? (this._timeline = _, this) : this._timeline;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the timeline and returns the current class instance.
      @param {Object} [*value*]
      @chainable
  */
  timelineConfig(_) {
    return arguments.length ? (this._timelineConfig = assign(this._timelineConfig, _), this) : this._timelineConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the title accessor to the specified function or string and returns the current class instance.
      @param {Function|String} [*value*]
      @chainable
  */
  title(_) {
    return arguments.length ? (this._title = typeof _ === "function" ? _ : constant(_), this) : this._title;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the title and returns the current class instance.
      @param {Object} [*value*]
      @chainable
  */
  titleConfig(_) {
    return arguments.length ? (this._titleConfig = assign(this._titleConfig, _), this) : this._titleConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance.
      @param {Boolean} [*value* = true]
      @chainable
  */
  tooltip(_) {
    return arguments.length ? (this._tooltip = _, this) : this._tooltip;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the tooltip and returns the current class instance.
      @param {Object} [*value*]
      @chainable
  */
  tooltipConfig(_) {
    return arguments.length ? (this._tooltipConfig = assign(this._tooltipConfig, _), this) : this._tooltipConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the total accessor to the specified function or string and returns the current class instance.
      @param {Boolean|Function|String} [*value*]
      @chainable
  */
  total(_) {
    return arguments.length ? (this._total = typeof _ === "function" ? _ : accessor(_), this) : this._total;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the config method for the total and returns the current class instance.
      @param {Object} [*value*]
      @chainable
  */
  totalConfig(_) {
    return arguments.length ? (this._totalConfig = assign(this._totalConfig, _), this) : this._totalConfig;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the overallwidth to the specified number and returns the current class instance.
      @param {Number} [*value* = window.innerWidth]
      @chainable
  */
  width(_) {
    return arguments.length ? (this._width = _, this) : this._width;
  }

  /**
      @memberof Viz
      @desc Toggles the ability to zoom/pan the visualization. Certain parameters for zooming are required to be hooked up on a visualization by visualization basis.
      @param {Boolean} *value* = false
      @chainable
  */
  zoom(_) {
    return arguments.length ? (this._zoom = _, this) : this._zoom;
  }

  /**
      @memberof Viz
      @desc The pixel stroke-width of the zoom brush area.
      @param {Number} *value* = 1
      @chainable
  */
  zoomBrushHandleSize(_) {
    return arguments.length ? (this._zoomBrushHandleSize = _, this) : this._zoomBrushHandleSize;
  }

  /**
      @memberof Viz
      @desc An object containing CSS key/value pairs that is used to style the outer handle area of the zoom brush. Passing `false` will remove all default styling.
      @param {Object|Boolean} *value*
      @chainable
  */
  zoomBrushHandleStyle(_) {
    return arguments.length ? (this._zoomBrushHandleStyle = _, this) : this._zoomBrushHandleStyle;
  }

  /**
      @memberof Viz
      @desc An object containing CSS key/value pairs that is used to style the inner selection area of the zoom brush. Passing `false` will remove all default styling.
      @param {Object|Boolean} *value*
      @chainable
  */
  zoomBrushSelectionStyle(_) {
    return arguments.length ? (this._zoomBrushSelectionStyle = _, this) : this._zoomBrushSelectionStyle;
  }

  /**
      @memberof Viz
      @desc An object containing CSS key/value pairs that is used to style each zoom control button (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.
      @param {Object|Boolean} *value*
      @chainable
  */
  zoomControlStyle(_) {
    return arguments.length ? (this._zoomControlStyle = _, this) : this._zoomControlStyle;
  }

  /**
      @memberof Viz
      @desc An object containing CSS key/value pairs that is used to style each zoom control button when active (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.
      @param {Object|Boolean} *value*
      @chainable
  */
  zoomControlStyleActive(_) {
    return arguments.length ? (this._zoomControlStyleActive = _, this) : this._zoomControlStyleActive;
  }

  /**
      @memberof Viz
      @desc An object containing CSS key/value pairs that is used to style each zoom control button on hover (`.zoom-in`, `.zoom-out`, `.zoom-reset`, and `.zoom-brush`). Passing `false` will remove all default styling.
      @param {Object|Boolean} *value*
      @chainable
  */
  zoomControlStyleHover(_) {
    return arguments.length ? (this._zoomControlStyleHover = _, this) : this._zoomControlStyleHover;
  }

  /**
      @memberof Viz
      @desc The multiplier that is used in with the control buttons when zooming in and out.
      @param {Number} *value* = 2
      @chainable
  */
  zoomFactor(_) {
    return arguments.length ? (this._zoomFactor = _, this) : this._zoomFactor;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, sets the max zoom scale to the specified number and returns the current class instance. If *value* is not specified, returns the current max zoom scale.
      @param {Number} *value* = 16
      @chainable
  */
  zoomMax(_) {
    return arguments.length ? (this._zoomMax = _, this) : this._zoomMax;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles panning to the specified boolean and returns the current class instance. If *value* is not specified, returns the current panning value.
      @param {Boolean} *value* = true
      @chainable
  */
  zoomPan(_) {
    return arguments.length ? (this._zoomPan = _, this) : this._zoomPan;
  }

  /**
      @memberof Viz
      @desc A pixel value to be used to pad all sides of a zoomed area.
      @param {Number} *value* = 20
      @chainable
  */
  zoomPadding(_) {
    return arguments.length ? (this._zoomPadding = _, this) : this._zoomPadding;
  }

  /**
      @memberof Viz
      @desc If *value* is specified, toggles scroll zooming to the specified boolean and returns the current class instance. If *value* is not specified, returns the current scroll zooming value.
      @param {Boolean} [*value* = true]
      @chainable
  */
  zoomScroll(_) {
    return arguments.length ? (this._zoomScroll = _, this) : this._zoomScroll;
  }

}
