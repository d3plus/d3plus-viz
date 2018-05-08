import {event} from "d3-selection";

/**
 @desc Global on click event for all entities in a Viz.
 @private
 */
export default function() {
  if (this._tooltip && !event.touches) this._tooltipClass.data([]).render();
}
