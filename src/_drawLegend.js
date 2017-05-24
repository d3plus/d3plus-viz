import {nest} from "d3-collection";
import {configPrep, elem, merge} from "d3plus-common";

/**
    @function _drawLegend
    @desc Renders the legend if this._legend is not falsy.
    @param {Array} data The filtered data array to be displayed.
    @private
*/
export default function(data = []) {

  const transform = {transform: `translate(${this._margin.left}, ${this._margin.top})`};

  const legendGroup = elem("g.d3plus-viz-legend", {
    condition: this._legend && !this._legendConfig.select,
    enter: transform,
    parent: this._select,
    transition: this._transition,
    update: transform
  }).node();

  if (this._legend) {

    const position = this._legendPosition;
    const wide = ["top", "bottom"].includes(position);

    const legendData = [];
    const fill = (d, i) => `${this._shapeConfig.fill(d, i)}_${this._shapeConfig.opacity(d, i)}`;
    nest()
      .key(fill)
      .rollup(leaves => legendData.push(merge(leaves, this._aggs)))
      .entries(this._colorScale ? data.filter((d, i) => this._colorScale(d, i) === undefined) : data);

    this._legendClass
      .id(fill)
      .align(wide ? "center" : position)
      .direction(wide ? "row" : "column")
      .duration(this._duration)
      .data(legendData.length > 1 || this._colorScale ? legendData : [])
      .height(this._height - this._margin.bottom - this._margin.top)
      .select(legendGroup)
      .verticalAlign(!wide ? "middle" : position)
      .width(this._width - this._margin.left - this._margin.right)
      .shapeConfig(configPrep.bind(this)(this._shapeConfig, "legend"))
      .config(this._legendConfig)
      .render();

    const legendBounds = this._legendClass.outerBounds();
    if (!this._legendConfig.select && legendBounds.height) {
      if (wide) this._margin[position] += legendBounds.height + this._legendClass.padding() * 2;
      else this._margin[position] += legendBounds.width + this._legendClass.padding() * 2;
    }

  }

}
