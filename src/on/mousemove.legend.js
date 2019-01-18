import {merge} from "d3-array";
import {event} from "d3-selection";

import {legendLabel} from "../_drawLegend";

/**
    @desc Tooltip logic for a specified data point.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @param {Object} [*config*] Optional configuration methods for the Tooltip class.
    @private
*/
export default function(d, i) {
  const position = event.touches ? [event.touches[0].clientX, event.touches[0].clientY] : [event.clientX, event.clientY];
  const dataLength = merge(this._legendClass.data().map((d, i) => {
    let id = this._id(d, i);
    if (!(id instanceof Array)) id = [id];
    return id;
  })).length;

  if (this._tooltip && d) {

    let id = this._id(d, i);
    if (id instanceof Array) id = id[0];

    this._select.style("cursor", "pointer");
    this._tooltipClass.data([d])
      .footer(this._solo.length && !this._solo.includes(id) ? "Click to Show<br />Shift+Click to Solo"
      : this._solo.length === 1 && this._solo.includes(id) || this._hidden.length === dataLength - 1 ? "Click to Reset"
      : this._solo.includes(id) ? "Click to Hide"
      : `${this._hidden.includes(id) ? "Click to Show" : "Click to Hide"}<br />Shift+Click to Solo`)
      .title(this._legendConfig.label ? this._legendClass.label() : legendLabel.bind(this))
      .position(position)
      .config(this._tooltipConfig)
      .config(this._legendTooltip)
      .render();

  }

}
