import {elem, locale} from "d3plus-common";

/**
    @function _drawBack
    @desc Draws a back button if there are states in this._history.
    @private
*/
export default function() {

  this._backClass
    .data(this._history.length ? [{text: locale.t("Back", {lng: this._locale}), x: this._padding * 2, y: 0}] : [])
    .select(elem("g.d3plus-viz-back", {parent: this._select}).node())
    .render();

  this._margin.top += this._history.length ? this._backClass.fontSize()() + this._padding : 0;

}
