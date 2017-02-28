import {elem} from "d3plus-common";
import {Radio, Select} from "d3plus-form";
const formTypes = {Radio, Select};

/**
    @function _drawLegend
    @desc Renders the legend if this._legend is not falsy.
    @param {Array} dara The filtered data array to be displayed.
    @private
*/
export default function() {

  const condition = this._controls && this._controls.length;
  const that = this;
  const transform = {
    height: this._height - this._margin.top - this._margin.bottom,
    width: this._width - this._margin.left - this._margin.right,
    x: this._margin.left,
    y: this._margin.top
  };

  const foreign = elem("foreignObject.d3plus-viz-controls", {
    condition,
    enter: Object.assign({opacity: 0}, transform),
    exit: Object.assign({opacity: 0}, transform),
    parent: this._select,
    transition: this._transition,
    update: Object.assign({opacity: 1}, transform)
  });

  let container = foreign.selectAll("div.d3plus-viz-controls-container")
    .data([null]);

  container = container.enter().append("xhtml:div")
      .attr("class", "d3plus-viz-controls-container")
      .style("margin-top", `${transform.height}px`)
    .merge(container);

  if (condition) {

    for (let i = 0; i < this._controls.length; i++) {

      const control = this._controls[i];

      const on = {};
      if (control.on) {
        for (const event in control.on) {
          if ({}.hasOwnProperty.call(control.on, event)) {
            on[event] = function() {
              control.on[event].bind(that)(this.value);
            };
          }
        }

      }

      const id = control.label || i;
      if (!this._controlCache[id]) {
        const type = control.type && formTypes[control.type] ? control.type : "Select";
        this._controlCache[id] = new formTypes[type]().container(container.node());
        if (control.checked) {
          this._controlCache[id].checked(control.checked);
          delete control.checked;
        }
        if (control.selected) {
          this._controlCache[id].selected(control.selected);
          delete control.selected;
        }
      }

      this._controlCache[id]
        .config(control)
        .config({on})
        .config(this._controlConfig)
        .render();

    }

    const bounds = container.node().getBoundingClientRect();

    container
        .style("text-align", "center")
      .transition(this._transition)
        .style("margin-top", `${transform.height - bounds.height}px`);

    this._margin.bottom += bounds.height;

  }

}
