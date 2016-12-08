import {elem, locale} from "d3plus-common";

/**
    @function _drawBack
    @desc Draws a back button if there are states in this._history.
    @private
*/
export default function() {

  const visible = this._history.length;

  const backGroup = elem("g.d3plus-viz-back", {
    parent: this._select,
    transition: this._transition,
    update: {transform: `translate(${this._margin.left}, ${this._margin.top})`}
  }).node();

  this._backClass
    .data(visible ? [{text: locale.t("Back", {lng: this._locale}), x: this._padding * 2, y: 0}] : [])
    .select(backGroup)
    .config(this._backConfig)
    .render();

  this._margin.top += visible ? this._backClass.fontSize()() + this._padding : 0;

}
