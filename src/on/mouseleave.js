/**
    @desc On mouseleave event for all shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  setTimeout(() => {
    if (this._shapeConfig.hoverOpacity !== 1 && this._hover ? this._hover(d, i) : true) {
      this.hover(false);
    }
    if (this._tooltip && this._id(this._tooltipClass.data()[0]) === this._id(d)) this._tooltipClass.data([]).render();
  }, 50);

  this._select.style("cursor", "auto");

}
