import {merge, sum} from "d3-array";
import {nest} from "d3-collection";
import {merge as combine} from "d3plus-common";

/**
    @function _colorNest
    @desc Returns an Array of data objects based on a given color accessor and groupBy levels.
    @param {Array} raw The raw data Array to be grouped by color.
    @private
*/
export default function(raw) {

  const fill = (d, i) => `${this._shapeConfig.fill(d, i)}_${this._shapeConfig.opacity(d, i)}`;
  const colors = nest().key(fill).entries(raw);
  let data, id;

  if (this._groupBy.length) {
    const numColors = colors.length;
    for (let i = 0; i < this._groupBy.length; i++) {
      id = d => this._ids(d).slice(0, i + 1).join("_");
      const ids = colors.map(c => Array.from(new Set(c.values.map(id)))),
            total = sum(ids, d => d.length),
            uniques = new Set(merge(ids)).size;
      if (total === numColors && uniques === numColors || i === this._groupBy.length - 1) {
        data = nest().key(id).entries(raw).map(d => combine(d.values));
        break;
      }
    }
  }
  else {
    id = fill;
    data = colors.map(d => combine(d.values));
  }

  return {data, id};

}
