import {mouse, select} from "d3-selection";

/**
    @desc On mouseenter event for all legend shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d) {

  if (this._tooltip) {
    const depth = this._drawDepth < this._groupBy.length - 1;
    this._select.style("cursor", depth ? "pointer" : "auto");
    this._tooltipClass.data([d])
      .footer(depth ? "Click to Expand" : "")
      .title(this._legendClass.label())
      .translate(mouse(select("html").node()))
      .render();
  }

}
