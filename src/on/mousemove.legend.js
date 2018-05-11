import {event} from "d3-selection";

import {legendLabel} from "../_drawLegend";

/**
    @desc Tooltip logic for a specified data point.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @param {Object} [*config*] Optional configuration methods for the Tooltip class.
    @private
*/
export default function(d) {
  const position = event.touches ? [event.touches[0].clientX, event.touches[0].clientY] : [event.clientX, event.clientY];

  if (this._tooltip && d) {
    this._select.style("cursor", "pointer");
    this._tooltipClass.data([d])
      .footer(this._drawDepth < this._groupBy.length - 1 ? "Click to Expand" : "")
      .title(this._legendConfig.label ? this._legendClass.label() : legendLabel.bind(this))
      .position(position)
      .config(this._tooltipConfig)
      .config(this._legendTooltip)
      .render();
  }

}
