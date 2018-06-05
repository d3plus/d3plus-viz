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

  const transform = {transform: `translate(${this._margin.left + this._padding.left}, ${this._margin.top})`};

  const group = elem("g.d3plus-viz-total", {
    enter: transform,
    parent: this._select,
    transition: this._transition,
    update: transform
  }).node();

  const visible = typeof total === "number";

  this._totalClass
    .data(visible ? [{text: `Total: ${this._totalFormat(total)}`}] : [])
    .select(group)
    .width(this._width - (this._margin.left + this._margin.right + this._padding.left + this._padding.right))
    .config(this._totalConfig)
    .render();

  this._margin.top += visible ? group.getBBox().height : 0;

}
