/**
    @desc On mouseleave event for all shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  if (this._shapeConfig.hoverOpacity !== 1) {
    setTimeout(() => {
      if (this._hover ? this._hover(d, i) : true) {
        this.hover(false);
      }
    }, 100);
  }

  this._select.style("cursor", "auto");
  if (this._tooltip) this._tooltipClass.data([]).render();

}
