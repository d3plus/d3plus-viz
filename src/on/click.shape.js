import {default as mouseenter} from "./mouseenter";
import {default as tooltip} from "./tooltip";

/**
    @desc On click event for Shape classes.
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
        return filterId[this._drawDepth] === ids[this._drawDepth];
      });
    }

    tooltip.bind(this)(d, i);

  }

}
