import {mouse, select} from "d3-selection";

import {locale} from "d3plus-common";

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
      .footer(this._drawDepth < this._groupBy.length - 1
            ? locale.t("Click to Expand", {lng: this._locale})
            : "")
      .title(this._drawLabel)
      .translate(mouse(select("html").node()))
      .config(this._tooltipConfig)
      .render();
  }

}
