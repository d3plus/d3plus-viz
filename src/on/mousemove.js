import {mouse, select} from "d3-selection";

/**
    @desc On mouse move event for all shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function() {

  if (this._tooltip) {
    this._tooltipClass.translate(mouse(select("html").node())).render();
  }

}
