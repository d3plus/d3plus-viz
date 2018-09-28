import {extent} from "d3-array";

import {date} from "d3plus-axis";
import {elem} from "d3plus-common";

/**
    @function setTimeFilter
    @desc Determines whether or not to update the timeFilter method of the Viz.
    @param {Array|Date} The timeline selection given from the d3 brush.
    @private
*/
function setTimeFilter(s) {
  if (!(s instanceof Array)) s = [s, s];
  if (JSON.stringify(s) !== JSON.stringify(this._timelineSelection)) {
    this._timelineSelection = s;
    s = s.map(Number);
    this.timeFilter(d => {
      const ms = date(this._time(d)).getTime();
      return ms >= s[0] && ms <= s[1];
    }).render();
  }
}

/**
    @function _drawTimeline
    @desc Renders the timeline if this._time and this._timeline are not falsy and there are more than 1 tick available.
    @param {Array} data The filtered data array to be displayed.
    @private
*/
export default function(data = []) {

  let timelinePossible = this._time && this._timeline;
  const ticks = timelinePossible ? Array.from(new Set(this._data.map(this._time))).map(date) : [];
  timelinePossible = timelinePossible && ticks.length > 1;

  const transform = {transform: `translate(${this._margin.left + this._padding.left}, 0)`};

  const timelineGroup = elem("g.d3plus-viz-timeline", {
    condition: timelinePossible,
    enter: transform,
    parent: this._select,
    transition: this._transition,
    update: transform
  }).node();

  if (timelinePossible) {

    const timeline = this._timelineClass
      .domain(extent(ticks))
      .duration(this._duration)
      .height(this._height - this._margin.bottom)
      .select(timelineGroup)
      .ticks(ticks.sort((a, b) => +a - +b))
      .width(this._width - (this._margin.left + this._margin.right + this._padding.left + this._padding.right));

    if (timeline.selection() === undefined) {
      this._timelineSelection = extent(data, this._time);
      timeline.selection(this._timelineSelection);
    }

    const config = this._timelineConfig;

    timeline
      .config(config)
      // .on("brush", s => {
      //   setTimeFilter.bind(this)(s);
      //   if (config.on && config.on.brush) config.on.brush(s);
      // })
      .on("end", s => {
        setTimeFilter.bind(this)(s);
        if (config.on && config.on.end) config.on.end(s);
      })
      .render();

    this._margin.bottom += timeline.outerBounds().height + timeline.padding() * 2;

  }

}
