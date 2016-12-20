import {extent} from "d3-array";

import {date} from "d3plus-axis";
import {elem} from "d3plus-common";

/**
    @function _drawTimeline
    @desc Renders the timeline if this._time and this._timeline are not falsy and there are more than 1 tick available.
    @param {Array} dara The filtered data array to be displayed.
    @private
*/
export default function(data = []) {

  let timelinePossible = this._time && this._timeline;
  const ticks = timelinePossible ? Array.from(new Set(this._data.map(this._time))).map(date) : [];
  timelinePossible = timelinePossible && ticks.length > 1;

  const timelineGroup = elem("g.d3plus-viz-timeline", {
    condition: timelinePossible,
    parent: this._select,
    transition: this._transition
  }).node();

  if (timelinePossible) {

    const timeline = this._timelineClass
      .domain(extent(ticks))
      .duration(this._duration)
      .height(this._height - this._margin.bottom)
      .select(timelineGroup)
      .ticks(ticks.sort((a, b) => +a - +b))
      .width(this._width);

    if (this._timelineSelection === void 0) {

      const dates = extent(data.map(this._time).map(date));
      this._timelineSelection = dates[0] === dates[1] ? dates[0] : dates;
      timeline.selection(this._timelineSelection);

    }

    timeline
      .config(this._timelineConfig)
      .render();

    this._margin.bottom += timeline.outerBounds().height + timeline.padding() * 2;

  }

}
