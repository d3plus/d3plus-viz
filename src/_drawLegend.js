import {nest} from "d3-collection";
import {elem, merge} from "d3plus-common";

/**
    @function _drawLegend
    @desc Renders the legend if this._legend is not falsy.
    @param {Array} data The filtered data array to be displayed.
    @private
*/
export default function(data = []) {

  const transform = {transform: `translate(${this._margin.left}, ${this._margin.top})`};

  const legendGroup = elem("g.d3plus-viz-legend", {
    condition: this._legend,
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
      .label((d, i) => {
        const l = this._drawLabel(d, i);
        return l instanceof Array ? l.join(", ") : l;
      })
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
