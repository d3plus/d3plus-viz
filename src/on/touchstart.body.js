/**
 @desc On touchstart event for the Body element.
 @private
 */
export default function(d, i, x, event) {
  event.preventDefault();
  event.stopPropagation();

  if (!d) this._tooltipClass.data([]).render();
}
