import {elem} from "d3plus-common";

/**
    @function _drawColorScale
    @desc Renders the color scale if this._colorScale is not falsy.
    @param {Array} data The filtered data array to be displayed.
    @private
*/
export default function(data = []) {

  const transform = {
    opacity: this._colorScalePosition ? 1 : 0,
    transform: `translate(${this._margin.left}, ${this._margin.top})`
  };

  const showColorScale = this._colorScale && data && data.length > 1;

  const scaleGroup = elem("g.d3plus-viz-colorScale", {
    condition: showColorScale && !this._colorScaleConfig.select,
    enter: transform,
    parent: this._select,
    transition: this._transition,
    update: transform
  }).node();

  if (showColorScale) {

    const scaleData = data.filter((d, i) => {
      const c = this._colorScale(d, i);
      return c !== undefined && c !== null;
    });

    const position = this._colorScalePosition || "bottom";
    const wide = ["top", "bottom"].includes(position);

    this._colorScaleClass
      .align({bottom: "end", left: "start", right: "end", top: "start"}[position])
      .duration(this._duration)
      .data(scaleData)
      .height(this._height - this._margin.bottom - this._margin.top)
      .orient(position)
      .select(scaleGroup)
      .value(this._colorScale)
      .width(this._width - this._margin.left - this._margin.right)
      .config(this._colorScaleConfig)
      .render();

    const scaleBounds = this._colorScaleClass.outerBounds();
    if (this._colorScalePosition && !this._colorScaleConfig.select && scaleBounds.height) {
      if (wide) this._margin[position] += scaleBounds.height + this._legendClass.padding() * 2;
      else this._margin[position] += scaleBounds.width + this._legendClass.padding() * 2;
    }

  }

}
