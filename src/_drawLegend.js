import {nest} from "d3-collection";
import {elem, merge} from "d3plus-common";

import {default as colorNest} from "./_colorNest";

/**
    @function _drawLegend
    @desc Renders the legend if this._legend is not falsy.
    @param {Array} dara The filtered data array to be displayed.
    @private
*/
export default function(data = []) {

  const position = this._legendPosition;
  const wide = ["top", "bottom"].includes(position);
  const transform = {transform: `translate(${this._margin.left}, ${this._margin.top})`};

  this._legendData = [];
  if (data.length) {

    const dataNest = nest();
    for (let i = 0; i <= this._drawDepth; i++) dataNest.key(this._groupBy[i]);
    dataNest.rollup(leaves => this._legendData.push(merge(leaves, this._aggs))).entries(data);

  }

  const legendGroup = elem("g.d3plus-viz-legend", {
    condition: this._legend,
    enter: transform,
    parent: this._select,
    transition: this._transition,
    update: transform
  }).node();

  if (this._legend) {

    const legend = colorNest.bind(this)(this._legendData);

    this._legendClass
      .id(legend.id)
      .align(wide ? "center" : position)
      .direction(wide ? "row" : "column")
      .duration(this._duration)
      .data(legend.data.length > 1 ? legend.data : [])
      .height(this._height - this._margin.bottom - this._margin.top)
      .label(this._label || legend.id)
      .select(legendGroup)
      .verticalAlign(!wide ? "middle" : position)
      .width(this._width - this._margin.left - this._margin.right)
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
    if (legendBounds.height) {
      if (wide) this._margin[position] += legendBounds.height + this._legendClass.padding() * 2;
      else this._margin[position] += legendBounds.width + this._legendClass.padding() * 2;
    }

  }

}
