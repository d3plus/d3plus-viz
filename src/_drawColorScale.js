import {min} from "d3-array";
import {elem} from "d3plus-common";

/**
    @function _drawColorScale
    @desc Renders the color scale if this._colorScale is not falsey.
    @private
*/
export default function() {

  const data = this._data;

  const position = this._colorScalePosition.bind(this)(this.config()) || "bottom";
  const wide = ["top", "bottom"].includes(position);
  const padding = this._colorScalePadding() ? this._padding : {top: 0, right: 0, bottom: 0, left: 0};

  const availableWidth = this._width - (this._margin.left + this._margin.right + padding.left + padding.right);

  const width = wide
    ? min([this._colorScaleMaxSize, availableWidth])
    : this._width - (this._margin.left + this._margin.right);

  const availableHeight = this._height - (this._margin.bottom + this._margin.top + padding.bottom + padding.top);

  const height = !wide
    ? min([this._colorScaleMaxSize, availableHeight])
    : this._height - (this._margin.bottom + this._margin.top);

  const transform = {
    opacity: position ? 1 : 0,
    transform: `translate(${wide ? this._margin.left + padding.left + (availableWidth - width) / 2 : this._margin.left}, ${wide ? this._margin.top : this._margin.top + padding.top + (availableHeight - height) / 2})`
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

    this._colorScaleClass
      .align({bottom: "end", left: "start", right: "end", top: "start"}[position] || "bottom")
      .duration(this._duration)
      .data(scaleData)
      .height(height)
      .locale(this._locale)
      .orient(position)
      .select(scaleGroup)
      .value(this._colorScale)
      .width(width)
      .config(this._colorScaleConfig)
      .render();

    const scaleBounds = this._colorScaleClass.outerBounds();
    if (position && !this._colorScaleConfig.select && scaleBounds.height) {
      if (wide) this._margin[position] += scaleBounds.height + this._legendClass.padding() * 2;
      else this._margin[position] += scaleBounds.width + this._legendClass.padding() * 2;
    }

  }
  else {
    this._colorScaleClass.config(this._colorScaleConfig);
  }



}
