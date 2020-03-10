import {event} from "d3-selection";

/**
 @desc On touchstart event for the Body element.
 @private
 */
export default function(d) {
  event.preventDefault();
  event.stopPropagation();

  if (!d) this._tooltipClass.data([]).render();
}
