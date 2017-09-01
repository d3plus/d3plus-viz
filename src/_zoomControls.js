import {event, select} from "d3-selection";
import {zoomTransform} from "d3-zoom";
import {stylize} from "d3plus-common";

/**
    @name zoomControls
    @desc Sets up initial zoom events and controls.
    @private
*/
export default function() {

  const that = this;
  this._zoomBehavior.on("zoom", zoomed.bind(this));

  let control = select(this._select.node().parentNode).selectAll("div.d3plus-geomap-control").data(this._zoom ? [0] : []);
  const controlEnter = control.enter().append("div").attr("class", "d3plus-geomap-control");
  control.exit().remove();
  control = control.merge(controlEnter)
    .style("position", "absolute")
    .style("top", `${this._margin.top}px`)
    .style("left", `${this._margin.left}px`);

  controlEnter.append("div").attr("class", "zoom-control zoom-in");
  control.select(".zoom-in")
    .on("click", zoomMath.bind(this, this._zoomFactor))
    .html("&#65291;");

  controlEnter.append("div").attr("class", "zoom-control zoom-out");
  control.select(".zoom-out")
    .on("click", zoomMath.bind(this, 1 / this._zoomFactor))
    .html("&#65293;");

  controlEnter.append("div").attr("class", "zoom-control zoom-reset");
  control.select(".zoom-reset")
    .on("click", zoomMath.bind(this, 0))
    .html("&#8634");

  control.selectAll(".zoom-control")
    .call(stylize, that._zoomControlStyle || {})
    .on("mouseenter", function() {
      select(this).call(stylize, that._zoomControlStyleHover || {});
    })
    .on("mouseleave", function() {
      select(this).call(stylize, that._zoomControlStyle || {});
    });

  // TODO: Brush to Zoom
  // const brushGroup = this._select.selectAll("g.brush").data([0]);
  // brushGroup.enter().append("g").attr("class", "brush");
  //
  // var xBrush = d3.scale.identity().domain([0, width]),
  //     yBrush = d3.scale.identity().domain([0, height]);
  //
  // function brushended(e) {
  //
  //   if (!event.sourceEvent) return;
  //
  //   const extent = brush.extent();
  //   brushGroup.call(brush.clear());
  //
  //   const zs = this._zoomBehavior.scale(), zt = this._zoomBehavior.translate();
  //
  //   const pos1 = extent[0].map((p, i) => (p - zt[i]) / (zs / this._polyZoom));
  //   const pos2 = extent[1].map((p, i) => (p - zt[i]) / (zs / this._polyZoom));
  //
  //   zoomToBounds([pos1, pos2]);
  //
  // }
  //
  // var brush = d3.svg.brush()
  //   .x(xBrush)
  //   .y(yBrush)
  //   .on("brushend", brushended);
  //
  // if (this._zoom) brushGroup.call(brush);

  // TODO: Detect zoom brushing
  // select("body")
  //   .on(`keydown.d3plus-geomap-${this._uuid}`, function() {
  //     if (event.keyCode === 16) {
  //       this._zoomBrush = true;
  //       zoomEvents();
  //     }
  //   })
  //   .on(`keyup.d3plus-geomap-${this._uuid}`, function() {
  //     if (event.keyCode === 16) {
  //       this._zoomBrush = false;
  //       zoomEvents();
  //     }
  //   });

  zoomEvents.bind(this)();
  if (this._renderTiles) this._renderTiles(zoomTransform(this._container.node()));

}

/**
    @name zoomEvents
    @desc Handles adding/removing zoom event listeners.
    @private
*/
function zoomEvents() {

  if (!this._container || !this._zoomGroup) return;

  if (this._zoomBrush) {
    // brushGroup.style("display", "inline");
    this._container.on(".zoom", null);
  }
  else if (this._zoom) {
    // brushGroup.style("display", "none");
    this._container.call(this._zoomBehavior);
    if (!this._zoomScroll) {
      this._container
        .on("wheel.zoom", null);
    }
    if (!this._zoomPan) {
      this._container
        .on("mousedown.zoom mousemove.zoom", null)
        .on("touchstart.zoom touchmove.zoom touchend.zoom touchcancel.zoom", null);
    }
  }
  else {
    this._container.on(".zoom", null);
  }

}

/**
    @name zoomed
    @desc Handles events dispatched from this._zoomBehavior
    @param {Object} [*transform* = event.transform]
    @param {Number} [*duration* = 0]
    @private
*/
function zoomed(transform = false, duration = 0) {

  if (this._zoomGroup) {
    if (!duration) this._zoomGroup.attr("transform", transform || event.transform);
    else this._zoomGroup.transition().duration(duration).attr("transform", transform || event.transform);
  }

  if (this._renderTiles) this._renderTiles(zoomTransform(this._container.node()));

}

/**
    @name zoomMath
    @desc Zooms in or out based on the provided multiplier.
    @param {Number} [*factor* = 0]
    @private
*/
function zoomMath(factor = 0) {

  if (!this._container) return;

  const center = this._zoomBehavior.extent().bind(document)()[1].map(d => d / 2),
        scaleExtent = this._zoomBehavior.scaleExtent(),
        t = zoomTransform(this._container.node());

  if (!factor) {
    t.k = scaleExtent[0];
    t.x = 0;
    t.y = 0;
  }
  else {
    const translate0 = [(center[0] - t.x) / t.k, (center[1] - t.y) / t.k];
    t.k *= factor;
    if (t.k <= scaleExtent[0]) {
      t.k = scaleExtent[0];
      t.x = 0;
      t.y = 0;
    }
    else {
      if (t.k > scaleExtent[1]) t.k = scaleExtent[1];

      t.x += center[0] - (translate0[0] * t.k + t.x);
      t.y += center[1] - (translate0[1] * t.k + t.y);
    }

  }
  zoomed.bind(this)(t);

}

// TODO: Zooming to Bounds
// function zoomToBounds(b, mod = 250) {
//
//   const w = width - mod;
//
//   let ns = this._scale / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / height);
//   const nt = [(w - ns * (b[1][0] + b[0][0])) / 2, (height - ns * (b[1][1] + b[0][1])) / 2];
//
//   ns = ns / Math.PI / 2 * this._polyZoom;
//
//   this._zoomBehavior.scale(ns * 2 * Math.PI).translate(nt);
//   zoomed();
//
// }
