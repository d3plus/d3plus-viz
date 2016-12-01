/**
    @desc On click event for all shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  this._select.style("cursor", "auto");
  if (this._drawDepth < this._groupBy.length - 1) {

    const filterGroup = this._groupBy[this._drawDepth],
          filterId = filterGroup(d, i);

    this.highlight(false);
    if (this._tooltip) this._tooltipClass.data([]).render();

    this._history.push({
      depth: this._depth,
      filter: this._filter
    });

    this.config({
      depth: this._drawDepth + 1,
      filter: (f, x) => filterGroup(f, x) === filterId
    }).render();

  }

}
