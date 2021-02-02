import {merge} from "d3-array";

import {configPrep} from "d3plus-common";

import {legendLabel} from "../_drawLegend";

/**
    @desc Tooltip logic for a specified data point.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @param {Object} [*config*] Optional configuration methods for the Tooltip class.
    @private
*/
export default function(d, i, x, event) {

  const position = event.touches ? [event.touches[0].clientX, event.touches[0].clientY] : [event.clientX, event.clientY];
  const dataLength = merge(this._legendClass.data().map((d, i) => {
    let id = this._id(d, i);
    if (!(id instanceof Array)) id = [id];
    return id;
  })).length;

  if (d && this._tooltip(d, i)) {

    let id = this._id(d, i);
    if (id instanceof Array) id = id[0];
    const t = this._translate;

    this._select.style("cursor", "pointer");
    this._tooltipClass.data([x || d])
      .footer(
        this._solo.length && !this._solo.includes(id) ? t("Click to Highlight")
        : this._solo.length === 1 && this._solo.includes(id) || this._hidden.length === dataLength - 1 ? t("Click to Reset")
        : this._solo.includes(id) ? t("Click to Hide")
        : this._hidden.includes(id) ? t("Click to Highlight")
        : `${t("Click to Highlight")}<br />${t("Shift+Click to Hide")}`
      )
      .title(this._legendConfig.label ? this._legendClass.label() : legendLabel.bind(this))
      .position(position)
      .config(configPrep.bind(this)(this._tooltipConfig))
      .config(configPrep.bind(this)(this._legendTooltip))
      .render();

  }

}
