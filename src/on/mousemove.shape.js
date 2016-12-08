import {default as tooltip} from "./tooltip.js";

/**
    @desc On mousemove event for all primary shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  tooltip.bind(this)(d, i);

}
