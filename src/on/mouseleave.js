/**
    @desc On mouseleave event for all shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function() {

  this.hover(false);
  this._select.style("cursor", "auto");
  if (this._tooltip) this._tooltipClass.data([]).render();

}
