/**
    @desc On mouseenter event for all shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  const filterId = this._ids(d, i);

  this.highlight((h, x) => {
    const ids = this._ids(h, x);
    return filterId[filterId.length - 1] === ids[filterId.length - 1];
  });

}
