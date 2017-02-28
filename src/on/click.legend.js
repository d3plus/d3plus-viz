import {min} from "d3-array";

import {default as mouseenter} from "./mouseenter";
import {default as tooltip} from "./tooltip";

/**
    @desc On click event for Legend class.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  if (this._hover && this._drawDepth >= this._groupBy.length - 1) {

    if (this._active && this._active(d, i)) {
      this.active(false);
      mouseenter.bind(this)(d, i);
    }
    else {

      const filterId = this._ids(d, i);

      this.active((h, x) => {
        const ids = this._ids(h, x);
        const index = min([ids.length - 1, filterId.length - 1, this._drawDepth]);
        return filterId.slice(0, index + 1).join("_") === ids.slice(0, index + 1).join("_");
      });
    }

    tooltip.bind(this)(d, i, {title: this._legendClass.label()});

  }

}
