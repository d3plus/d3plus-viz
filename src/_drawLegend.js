import {nest} from "d3-collection";
import {configPrep, elem, merge} from "d3plus-common";

/**
    @function legendLabel
    @desc Default label function for the legend.
    @private
*/
export function legendLabel(d, i) {
  const l = this._drawLabel(d, i);
  return l instanceof Array ? l.join(", ") : l;
}

/**
    @function _drawLegend
    @desc Renders the legend if this._legend is not falsy.
    @param {Array} data The filtered data array to be displayed.
    @private
*/
export default function(data = []) {

  if (this._legend) {

    const legendBounds = this._legendClass.outerBounds();
    const position = this._legendPosition;
    const wide = ["top", "bottom"].includes(position);
    const padding = this._legendPadding() ? this._padding : {top: 0, right: 0, bottom: 0, left: 0};

    const transform = {transform: `translate(${wide ? this._margin.left + padding.left : this._margin.left}, ${wide ? this._margin.top : this._margin.top + padding.top})`};

    const legendGroup = elem("g.d3plus-viz-legend", {
      condition: this._legend && !this._legendConfig.select,
      enter: transform,
      parent: this._select,
      transition: this._transition,
      update: transform
    }).node();

    const legendData = [];

    const color = (d, i) => {
      const shape = this._shape(d, i);
      const attr = shape === "Line" ? "stroke" : "fill";
      const value = this._shapeConfig[shape] && this._shapeConfig[shape][attr]
        ? this._shapeConfig[shape][attr] : this._shapeConfig[attr];
      return typeof value === "function" ? value(d, i) : value;
    };

    const opacity = (d, i) => {
      const shape = this._shape(d, i);
      const value = this._shapeConfig[shape] && this._shapeConfig[shape].opacity
        ? this._shapeConfig[shape].opacity : this._shapeConfig.opacity;
      return typeof value === "function" ? value(d, i) : value;
    };

    const fill = (d, i) => `${ color(d, i) }_${ opacity(d, i) }`;

    nest()
      .key(fill)
      .rollup(leaves => legendData.push(merge(leaves, this._aggs)))
      .entries(this._colorScale ? data.filter((d, i) => this._colorScale(d, i) === undefined) : data);

    const hidden = (d, i) => {
      let id = this._id(d, i);
      if (id instanceof Array) id = id[0];
      return this._hidden.includes(id) || this._solo.length && !this._solo.includes(id);
    };

    this._legendClass
      .id(fill)
      .align(wide ? "center" : position)
      .direction(wide ? "row" : "column")
      .duration(this._duration)
      .data(legendData.length > this._legendCutoff || this._colorScale ? legendData : [])
      .height(wide ? this._height - (this._margin.bottom + this._margin.top) : this._height - (this._margin.bottom + this._margin.top + padding.bottom + padding.top))
      .select(legendGroup)
      .verticalAlign(!wide ? "middle" : position)
      .width(wide ? this._width - (this._margin.left + this._margin.right + padding.left + padding.right) : this._width - (this._margin.left + this._margin.right))
      .shapeConfig(configPrep.bind(this)(this._shapeConfig, "legend"))
      .config(this._legendConfig)
      .shapeConfig({
        fill: (d, i) => hidden(d, i) ? this._hiddenColor(d, i) : color(d, i),
        labelConfig: {
          fontOpacity: (d, i) => hidden(d, i) ? this._hiddenOpacity(d, i) : 1
        },
        opacity
      })
      .render();

    if (!this._legendConfig.select && legendBounds.height) {
      if (wide) this._margin[position] += legendBounds.height + this._legendClass.padding() * 2;
      else this._margin[position] += legendBounds.width + this._legendClass.padding() * 2;
    }
  }
}
