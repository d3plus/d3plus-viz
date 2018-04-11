import {event} from "d3-selection";

/**
    @desc Tooltip logic for a specified data point.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @param {Object} [*config*] Optional configuration methods for the Tooltip class.
    @private
*/
export default function(d) {

  if (this._tooltip && d) {
    this._select.style("cursor", "pointer");
    this._tooltipClass.data([d])
      .footer(this._drawDepth < this._groupBy.length - 1 ? "Click to Expand" : "")
      .title(this._drawLabel)
      .position([event.clientX, event.clientY])
      .config(this._tooltipConfig)
      .render();
  }

}
