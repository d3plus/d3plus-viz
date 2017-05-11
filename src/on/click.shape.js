import {default as tooltip} from "./tooltip";

/**
    @desc On click event for Shape classes.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  tooltip.bind(this)(d, i);

}
