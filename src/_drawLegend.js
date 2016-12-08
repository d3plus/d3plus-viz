import {nest} from "d3-collection";
import {merge} from "d3plus-common";

import {default as colorNest} from "./_colorNest";

/**
    @function _drawLegend
    @desc Renders the legend if this._legend is not falsy.
    @param {Array} dara The filtered data array to be displayed.
    @private
*/
export default function(data = []) {

  const legendGroup = this._uiGroup("legend", this._legend);

  this._legendData = [];
  if (data.length) {

    const dataNest = nest();
    for (let i = 0; i <= this._drawDepth; i++) dataNest.key(this._groupBy[i]);
    dataNest.rollup(leaves => this._legendData.push(merge(leaves, this._aggs))).entries(data);

  }

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

}
