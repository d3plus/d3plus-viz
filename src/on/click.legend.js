import {event} from "d3-selection";

/**
    @desc On click event for all legend shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  this._select.style("cursor", "auto");
  if (this._tooltip) this._tooltipClass.data([]).render();

  const id = this._id(d, i);
  const hiddenIndex = this._hidden.indexOf(id);
  const soloIndex = this._solo.indexOf(id);
  const dataLength = this._legendClass.data().length;

  if (event.shiftKey) {
    if (soloIndex < 0) {
      this._solo = [id];
      this._hidden = [];
      this.render();
    }
  }
  else {
    if (soloIndex >= 0) this._solo.splice(soloIndex, 1);
    else if (this._solo.length) this._solo.push(id);
    else if (hiddenIndex >= 0) this._hidden.splice(hiddenIndex, 1);
    else this._hidden.push(id);
    if (this._solo.length === dataLength) this._solo = [];
    if (this._hidden.length === dataLength) this._hidden = [];
    this.render();
  }

}
