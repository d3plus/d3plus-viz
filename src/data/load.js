import {csv, json, text, tsv} from "d3-request";
import {default as fold} from "./fold";
import {default as concat} from "./concat";

/** defaultFormatter */
const defaultFormatter = d => d;

/**
  @function dataLoad
  @desc Loads data from a filepath or URL, converts it to a valid JSON object, and returns it to a callback function.
  @param {Array|String} path The path to the file or url to be loaded. Also support array of paths strings. If an Array of objects is passed, the xhr request logic is skipped.
  @param {Function} [formatter] An optional formatter function that is run on the loaded data.
  @param {String} [key] The key in the `this` context to save the resulting data to.
  @param {Function} [callback] A function that is called when the final data is loaded. It is passed 2 variables, any error present and the data loaded.
*/
export default function(path, formatter, key, callback) {

  let parser;

  const getParser = path => {
    const ext = path.slice(path.length - 4);
    switch (ext) {
      case ".csv":
        return csv;
      case ".tsv":
        return tsv;
      case ".txt":
        return text;
      default:
        return json;
    }
  };

  const validateData = (err, parser, data) => {
    if (parser !== json && !err && data && data instanceof Array) {
      data.forEach(d => {
        for (const k in d) {
          if (!isNaN(d[k])) d[k] = parseFloat(d[k]);
          else if (d[k].toLowerCase() === "false") d[k] = false;
          else if (d[k].toLowerCase() === "true") d[k] = true;
          else if (d[k].toLowerCase() === "null") d[k] = null;
          else if (d[k].toLowerCase() === "undefined") d[k] = undefined;
        }
      });
    }
    return data;
  };

  // If data param is a single string url or an plain object then convert path to a 1 element array of urls to re-use logic
  if (typeof path === "string") {
    path = [path];
  }

  const isThereAnyString = path.find(dataItem => typeof dataItem === "string");

  let loaded = [];
  const toLoad = [];

  // If there is a string I'm assuming is a Array to merge, urls or data
  if (isThereAnyString) {
    path.forEach(dataItem => {
      if (typeof dataItem !== "string") {
        loaded.push(dataItem);
      }
      else if (typeof dataItem === "string") {
        toLoad.push(dataItem);
      }
    });
  }

  // Data array itself
  else {
    loaded.push(path);
  }

  // Load all urls an combine them with data arrays
  const alreadyLoaded = loaded.length;
  toLoad.forEach(url => {
    parser = getParser(url);
    parser(url, (err, data) => {
      data = err ? [] : data;
      if (data && !(data instanceof Array) && data.data && data.headers) data = fold(data);
      data = validateData(err, parser, data);
      loaded.push(data);
      if (loaded.length - alreadyLoaded === toLoad.length) { // All urls loaded

        // Format data
        data = defaultFormatter(loaded.length === 1 ? loaded[0] : loaded);
        if (formatter) {
          data = formatter(loaded.length === 1 ? loaded[0] : loaded);
        }
        else if (key === "data") {
          data = concat(loaded, "data");
        }

        if (key && `_${key}` in this) this[`_${key}`] = data;
        if (this._cache) this._lrucache.set(url, data);
        if (callback) callback(err, data);
      }
    });
  });

  // If there is no data to Load response is immediately
  if (toLoad.length === 0) {
    loaded = loaded.map(data => {
      if (data && !(data instanceof Array) && data.data && data.headers) data = fold(data);
      return data;
    });

    // Format data
    let data = defaultFormatter(loaded.length === 1 ? loaded[0] : loaded);
    if (formatter) {
      data = formatter(loaded.length === 1 ? loaded[0] : loaded);
    }
    else if (key === "data") {
      data = concat(loaded, "data");
    }

    if (key && `_${key}` in this) this[`_${key}`] = data;
    if (this._cache) this._lrucache.set(key, data);
    if (callback) callback(null, data);
  }

}
