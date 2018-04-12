/**
 @desc Global on click event for all entities in a Viz.
 @private
 */
export default function() {
  if (this._tooltip) this._tooltipClass.data([]).render();
}
