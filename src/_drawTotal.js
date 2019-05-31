import {sum} from "d3-array";

import {elem} from "d3plus-common";

/**
    @function _drawTotal
    @desc Draws a total title if this._total is defined.
    @param {Array} [*data*] The currently filtered dataset.
    @private
*/
export default function(data = []) {

  const total = typeof this._total === "function" ? sum(data.map(this._total))
    : this._total === true && this._size ? sum(data.map(this._size)) : false;

  const padding = this._totalPadding() ? this._padding : {top: 0, right: 0, bottom: 0, left: 0};

  const transform = {transform: `translate(${this._margin.left + padding.left}, ${this._margin.top})`};

  const group = elem("g.d3plus-viz-total", {
    enter: transform,
    parent: this._select,
    transition: this._transition,
    update: transform
  }).node();

  const visible = typeof total === "number";

  this._totalClass
    .data(visible ? [{text: this._totalFormat(total)}] : [])
    .locale(this._locale)
    .select(group)
    .width(this._width - (this._margin.left + this._margin.right + padding.left + padding.right))
    .config(this._totalConfig)
    .render();

  this._margin.top += visible ? group.getBBox().height + this._totalConfig.padding * 2 : 0;

}
