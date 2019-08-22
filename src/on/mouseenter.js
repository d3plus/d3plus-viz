const flattenIds = levels => levels.reduce((arr, level) => {
  if (level instanceof Array) {
    if (arr.length) {
      const oldArray = arr.slice();
      arr = [];
      level.forEach(id => arr = arr.concat(oldArray.map(a => `${a}_${id}`)));
    }
    else {
      arr = level.slice();
    }
  }
  else if (arr.length) {
    arr = arr.map(a => `${a}_${level}`);
  }
  else {
    arr.push(level);
  }
  return arr;
}, []);

/**
    @desc On mouseenter event for all shapes in a Viz.
    @param {Object} *d* The data object being interacted with.
    @param {Number} *i* The index of the data object being interacted with.
    @private
*/
export default function(d, i) {

  if (this._shapeConfig.hoverOpacity !== 1) {

    const filterIds = flattenIds(this._ids(d, i));
    this.hover((h, x) => {
      const ids = flattenIds(this._ids(h, x));
      return filterIds.some(id => ids.includes(id));
    });

  }

}
