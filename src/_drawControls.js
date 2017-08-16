import {elem} from "d3plus-common";
import {saveElement} from "d3plus-export";
import {Button, Radio, Select} from "d3plus-form";
const formTypes = {Button, Radio, Select};

/**
    @function _drawLegend
    @desc Renders the legend if this._legend is not falsy.
    @param {Array} dara The filtered data array to be displayed.
    @private
*/
export default function() {

  const that = this;

  const areas = ["left", "right", "top", "bottom"];
  for (let a = 0; a < areas.length; a++) {
    const area = areas[a];
    const controls = (this._controls || []).filter(c => !c.position && area === "bottom" || c.position === area);

    if (this._downloadButton && this._downloadPosition === area) {
      controls.push({
        data: [{text: "Download", value: 1}],
        label: "downloadButton",
        on: {
          click: () => {
            const resize = this._detectResize;
            if (resize) this.detectResize(false).render();
            saveElement(this._select.node(), Object.assign({
              title: this._title || undefined
            }, this._downloadConfig), {
              callback: () => {
                setTimeout(() => {
                  if (resize) this.detectResize(resize).render();
                }, 5000);
              }
            });
          }
        },
        type: "Button"
      });
    }

    const transform = {
      height: this._height - this._margin.top - this._margin.bottom,
      width: this._width - this._margin.left - this._margin.right
    };

    transform.x = this._margin.left + (area === "right" ? transform.width : 0);
    transform.y = this._margin.top + (area === "bottom" ? transform.height : 0);

    const foreign = elem(`foreignObject.d3plus-viz-controls-${area}`, {
      condition: controls.length,
      enter: Object.assign({opacity: 0}, transform),
      exit: Object.assign({opacity: 0}, transform),
      parent: this._select,
      transition: this._transition,
      update: {height: transform.height, opacity: 1, width: transform.width}
    });

    let container = foreign.selectAll("div.d3plus-viz-controls-container")
      .data([null]);

    container = container.enter().append("xhtml:div")
        .attr("class", "d3plus-viz-controls-container")
      .merge(container);

    if (controls.length) {

      for (let i = 0; i < controls.length; i++) {

        const control = Object.assign({}, controls[i]);

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

        const id = control.label || `${area}-${i}`;
        if (!this._controlCache[id]) {
          const type = control.type && formTypes[control.type] ? control.type : "Select";
          this._controlCache[id] = new formTypes[type]().container(container.node());
          if (control.checked) this._controlCache[id].checked(control.checked);
          if (control.selected) this._controlCache[id].selected(control.selected);
        }
        delete control.checked;
        delete control.selected;

        this._controlCache[id]
          .config(control)
          .config({on})
          .config(this._controlConfig)
          .render();

      }

      container
          .style("display", ["top", "bottom"].includes(area) ? "block" : "inline-block")
          .style("text-align", ["top", "bottom"].includes(area) ? "center" : area);

      const bounds = container.node().getBoundingClientRect();

      foreign.transition(this._transition)
        .attr("x", transform.x - (area === "right" ? bounds.width : 0))
        .attr("y", transform.y - (area === "bottom" ? bounds.height : 0));

      this._margin[area] += ["top", "bottom"].includes(area) ? bounds.height : bounds.width;

    }

  }

}
