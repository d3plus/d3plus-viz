import {color} from "d3-color";
import {nest} from "d3-collection";
import {mouse, select} from "d3-selection";
import {transition} from "d3-transition";

import {assign} from "d3plus-color";
import {accessor, BaseClass, constant, elem, merge} from "d3plus-common";
import {Legend} from "d3plus-legend";
import {TextBox} from "d3plus-text";
import {tooltip} from "d3plus-tooltip";

import {default as colorNest} from "./colorNest";
import {default as getSize} from "./getSize";

/**
    @class Viz
    @desc Creates an x/y plot based on an array of data. If *data* is specified, immediately draws the tree map based on the specified array and returns the current class instance. If *data* is not specified on instantiation, it can be passed/updated after instantiation using the [data](#treemap.data) method. See [this example](https://d3plus.org/examples/d3plus-treemap/getting-started/) for help getting started using the treemap generator.
*/
export default class Viz extends BaseClass {

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
    this._highlight = false;
    this._legend = {};
    this._legendClass = new Legend();
    this._on = {
      click: (d, i) => {

        if (this._drawDepth < this._groupBy.length - 1) {

          const filterGroup = this._groupBy[this._drawDepth],
                filterId = this._id(d, i);

          this._highlight = false;
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

        this._highlight = (h, x) => {
          const myId = this._id(h, x);
          if (myId.constructor === Array && filterId.constructor !== Array) return myId.includes(filterId);
          if (myId.constructor !== Array && filterId.constructor === Array) return filterId.includes(myId);
          return myId === filterId;
        };

        if (this._tooltip) {
          this._tooltipClass.data([d])
            .footer(this._drawDepth < this._groupBy.length - 1 ? "Click to Expand" : "")
            .translate(mouse(select("html").node()))
            ();
        }

        this.update(100);

      },
      mousemove: () => {

        const dd = this._tooltipClass.duration();

        if (this._tooltip) {
          this._tooltipClass
            .duration(0)
            .translate(mouse(select("html").node()))
            ().duration(dd);
        }

      },
      mouseleave: () => {

        this._highlight = false;
        if (this._tooltip) this._tooltipClass.data([])();
        this.update(100);

      }
    };
    this._padding = 5;
    this._shapes = [];
    this._shapeConfig = {
      fill: (d, i) => assign(this._id(d, i)),
      opacity: (d, i) => this._highlight ? this._highlight(d, i) ? 1 : 0.25 : 1,
      stroke: (d, i) => color(assign(this._id(d, i))).darker(),
      strokeWidth: (d, i) => this._highlight ? this._highlight(d, i) ? 1 : 0 : 0
    };
    this._tooltip = {};
    this._tooltipClass = tooltip().pointerEvents("none");

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
    if (this._select === void 0) {
      const [w, h] = getSize(select("body").node());
      this.width(w).height(h);
      this.select(select("body").append("svg").style("width", `${w}px`).style("height", `${h}px`).style("display", "block").node());
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
      const dataNest = nest().rollup(leaves => this._filteredData.push(merge(leaves)));
      for (let i = 0; i <= this._drawDepth; i++) dataNest.key(this._groupBy[i]);
      dataNest.entries(this._filter ? this._data.filter(this._filter) : this._data);
    }

    // Manages visualization legend group
    const legendGroup = elem("g.d3plus-plot-legend", {
      condition: this._legend,
      enter: {transform: `translate(0,${this._height / 2})`},
      exit: {opacity: 0},
      parent: this._select,
      transition: this._transition,
      update: {opacity: 1, transform: `translate(0,${this._height / 2})`}
    });

    // Renders the legend if this._legend is not falsy.
    if (this._legend) {

      const legend = colorNest(this._filteredData, this._shapeConfig.fill, this._groupBy);

      this._legendClass
        .id((d, i) => legend.id(d, i))
        .duration(this._duration)
        .data(legend.data)
        .height(this._height / 2)
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
        .config(this._legend.constructor === Object ? this._legend : {})
        .render();

      this._margin.bottom = this._legendClass.outerBounds().height + this._legendClass.padding() * 4;

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
      @desc If *value* is specified, sets the highlight filter to the specified function and returns the current class instance. If *value* is not specified, returns the current highlight filter. When the highlight function returns true given a data point, the highlight styles will be used.
      @param {Function} [*value* = false]
  */
  highlight(_) {
    return arguments.length ? (this._highlight = _, this) : this._highlight;
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
      @desc If *value* is specified, toggles the legend based on the specified boolean and returns the current class instance. If *value* is an object, then it is passed to the legend's config method. If *value* is not specified, returns the current value.
      @param {Boolean|Object} [*value* = true]
  */
  legend(_) {
    return arguments.length ? (this._legend = _, this) : this._legend;
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
      @desc If *value* is specified, toggles the tooltip based on the specified boolean and returns the current class instance. If *value* is an object, then it is passed to the tooltip's config method. If *value* is not specified, returns the current tooltip visibility.
      @param {Boolean|Object} [*value* = true]
  */
  tooltip(_) {
    return arguments.length ? (this._tooltip = _, this) : this._tooltip;
  }

  /**
      @memberof Viz
      @desc If *ms* is specified, all shapes will redraw using the specified duration and return this generator. If *ms* is not specified, shapes will redraw instantly. This method is useful when only needing to change visual styles (and not data), like when setting custom [mouse events](#Plot.on).
      @param {Number} [*ms* = 0]
  */
  update(_ = 0) {
    this._legendClass.shapeConfig({duration: _}).render().shapeConfig({duration: this._duration});
    for (let s = 0; s < this._shapes.length; s++) this._shapes[s].duration(_).render().duration(this._duration);
    return this;
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
