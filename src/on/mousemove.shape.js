import {event} from "d3-selection";
import {configPrep} from "d3plus-common";

/**
    @desc Tooltip logic for a specified data point.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @param {Object} [*config*] Optional configuration methods for the Tooltip class.
    @private
*/
export default function(d, i, x) {

  if (this._tooltip && d) {
    this._select.style("cursor", "pointer");
    const position = event.touches ? [event.touches[0].clientX, event.touches[0].clientY] : [event.clientX, event.clientY];
    this._tooltipClass.data([x || d])
      .footer(this._drawDepth < this._groupBy.length - 1 ? this._translate("Click to Expand") : false)
      .title(this._drawLabel)
      .position(position)
      .config(configPrep.bind(this)(this._tooltipConfig))
      .render();
  }

}
