import {merge} from "d3-array";
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

  if (!this._hiddenBehavior) {
    this._solo = [];
    this._hidden = [];
    return;
  }

  let id = this._id(d, i);
  if (!(id instanceof Array)) id = [id];
  const hiddenIndex = this._hidden.indexOf(id[0]);
  const soloIndex = this._solo.indexOf(id[0]);
  const dataLength = merge(this._legendClass.data().map((d, i) => {
    let id = this._id(d, i);
    if (!(id instanceof Array)) id = [id];
    return id;
  })).length;

  if (event.shiftKey) {

    if (hiddenIndex < 0 && !this._solo.length) {
      this._hidden = this._hidden.concat(id);
      if (this._solo.length === dataLength) this._solo = [];
      if (this._hidden.length === dataLength) this._hidden = [];
      this.render();
    }
    else if (soloIndex >= 0) {
      this._solo = [];
      this._hidden = [];
      this.render();
    }

  }
  else {
    if (soloIndex < 0 && this._hidden.length < dataLength - 1) {
      this._solo = id;
      this._hidden = [];
    }
    else {
      this._solo = [];
      this._hidden = [];
    }
    this.render();
  }

}
