import {elem} from "d3plus-common";

/**
    @function _drawTitle
    @desc Draws a title if this._title is defined.
    @param {Array} [*data*] The currently filtered dataset.
    @private
*/
export default function(data = []) {

  const text = this._title ? this._title(data) : false;

  const transform = {transform: `translate(${this._margin.left + this._padding.left}, ${this._margin.top})`};

  const group = elem("g.d3plus-viz-title", {
    enter: transform,
    parent: this._select,
    transition: this._transition,
    update: transform
  }).node();

  this._titleClass
    .data(text ? [{text}] : [])
    .select(group)
    .width(this._width - (this._margin.left + this._margin.right + this._padding.left + this._padding.right))
    .config(this._titleConfig)
    .render();

  this._margin.top += text ? group.getBBox().height : 0;

}
