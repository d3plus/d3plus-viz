import {merge, sum} from "d3-array";
import {nest} from "d3-collection";
import {merge as combine} from "d3plus-common";

/**
    @function _colorNest
    @desc Returns an Array of data objects based on a given color accessor and groupBy levels.
    @param {Array} raw The raw data Array to be grouped by color.
    @param {Function} fill The color accessor for each data object.
    @param {Array} [groupBy = []] An optional array of grouping accessors. Will autodetect if a certain group by level is assigning the colors, and will return the appropriate accessor.
    @private
*/
export default function(raw, fill, groupBy = []) {

  if (groupBy && !(groupBy instanceof Array)) groupBy = [groupBy];

  const colors = nest().key(fill).entries(raw);
  if (colors.length < 2) return {data: [], id: fill};
  let data, id;

  if (groupBy.length) {
    const numColors = colors.length;
    for (let i = 0; i < groupBy.length; i++) {
      const ids = colors.map(c => Array.from(new Set(c.values.map(d => groupBy[i](d))))),
            total = sum(ids, d => d.length),
            uniques = new Set(merge(ids)).size;
      if (total === numColors && uniques === numColors || i === groupBy.length - 1) {
        id = groupBy[i];
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
