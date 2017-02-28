import {min} from "d3-array";

/**
    @desc On mouseenter event for all shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  const filterId = this._ids(d, i);

  this.hover((h, x) => {
    const ids = this._ids(h, x);
    const index = min([ids.length - 1, filterId.length - 1, this._drawDepth]);
    return filterId.slice(0, index + 1).join("_") === ids.slice(0, index + 1).join("_");
  });

}
