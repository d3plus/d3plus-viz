import {mouse, select} from "d3-selection";

import {locale} from "d3plus-common";

/**
    @desc Tooltip logic for a specified data point.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @param {Object} [*config*] Optional configuration methods for the Tooltip class.
    @private
*/
export default function(d, i, config = {}) {

  if (this._tooltip && d) {
    this._select.style("cursor", "pointer");
    this._tooltipClass.data([d])
      .footer(this._drawDepth < this._groupBy.length - 1
            ? locale.t("Click to Expand", {lng: this._locale})
            : this._active && this._active(d, i)
            ? !this._focus || this._focus === this._id(d, i)
            ? locale.t("Click to Remove Highlight", {lng: this._locale})
            : locale.t("Click to Highlight", {lng: this._locale})
            : locale.t("Click to Highlight", {lng: this._locale}))
      .title(this._drawLabel)
      .translate(mouse(select("html").node()))
      .config(config)
      .config(this._tooltipConfig)
      .render();
  }

}
